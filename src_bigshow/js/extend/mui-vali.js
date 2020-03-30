/**
 * 依赖 mui-tooltip
 * 用法：
 * <form id="form1">
 *     <input type="text" required />
 *     <input type="radio" required value="11" name="radioMustHave" />
 *     <input type="checkbox" required value="22" name="checkboxMustHave" />
 *     <input type="password" pattern="[a-zA-Z0-9_]{12,36}" />
 *     <textarea required></textarea>
 *     <select required>
 *          <option>SomeValue</option>
 *     </select>
 *     <label required mui-value="aaa">自定义元素</label>
 * </form>
 *
 * import Vali from 'mui-vali.js';
 * const formElem = document.getElementById('form1');
 * const formVali = new Vali(formElem);
 * formVali.check(); // 检查 报一个错
 * formVali.checkAll(); // 检查 报所有错
 *
 * 仅支持 required, pattern, equals
 */
import ErrMsg from './mui-errmsg.js';
const $ = undefined;
const ERRMSG_MAP = {
    VALUE_REQUIRED: '请填写此字段',
    VALUE_PATTERN: '请填写符合格式要求的内容',
    SELECT: '请在列表中选择一项',
    GROUP: '请从这些选项中选择一个'
};
function showRequiredMsg(elem, text) {
    return showErrorMsg(elem, elem.getAttribute('required-errmsg') || text);
}
function showPatternMsg(elem, text) {
    return showErrorMsg(elem, elem.getAttribute('pattern-errmsg') || text);
}
const isElemVisible = (elem) => {
    return (elem.offsetWidth > 0 && elem.offsetHeight > 0) || (elem.getClientRects().length > 0);
};
/**
 * Constructor 构造方法
 */
function MUIVali(formElem) {
    if (!formElem) {
        throw Error('Param Form Element Error.');
    }
    this.form = formElem;
}
const proto = MUIVali.prototype;
proto.reset = function () {
    this.nameStackMap = {};
    if (this.err) {
        this.err.dispose();
        this.err = null;
    }
    if (this.errs) {
        this.errs.forEach(e => e.dispose());
        this.errs.length = 0;
    }
    this.errs = [];
};
// 所有带required, pattern的元素
proto.getInputs = function () {
    return this.form.querySelectorAll('[required],[pattern],[equals]');
};
// 所有有效的inputs
proto.getAvailableInputs = function () {
    const list = this.getInputs();
    const inputs = [];
    for (let i = 0; i < list.length; i++) {
        let elem = list[i];
        if (!isElemVisible(elem)) { // 不可见
            continue;
        }
        if (elem.disabled) {
            continue;
        }
        inputs.push(elem);
    }
    return inputs;
};
// 检查 pop one
proto.check = function () {
    this.reset();
    const inputs = this.getAvailableInputs();
    const queue = [];
    for (let i = 0; i < inputs.length; i++) {
        let result = this.checkElem(inputs[i]);
        result && queue.push(result);
    }
    if (queue.length === 0) {
        return true;
    }
    let first = queue[0];
    first.elem.scrollIntoViewIfNeeded();
    const dataMsg = first.elem.getAttribute(first.errtype + '-errmsg');
    this.err = new ErrMsg(first.elem, dataMsg || first.errmsg);
    return false;
};
// 检查 pop all
proto.checkAll = function () {
    this.reset();
    const inputs = this.getAvailableInputs();
    for (let i = 0; i < inputs.length; i++) {
        let result = this.checkElem(inputs[i]);
        if (result) {
            let dataMsg = result.elem.getAttribute(result.errtype + '-errmsg');
            this.errs.push(new ErrMsg(result.elem, dataMsg || result.errmsg));
        }
    }
    if (this.errs.length === 0) {
        return true;
    }
    return false;
};
/**
 * 检查元素
 * @param {HTMLElement} elemm
 * @return null or {
 *    "elem": elem,
 *    "errtype": "required"|"pattern",
 *    "errmsg": String
 * }
 */
proto.checkElem = function (elem) {
    const tagName = elem.tagName.toUpperCase();
    if (tagName === 'INPUT') {
        const type = (elem.getAttribute('type') || '').toLowerCase();
        if (type === 'radio' || type === 'checkbox') {
            return this.checkRadio(elem, type);
        } else {
            return this.checkValue(elem);
        }
    } else if (tagName === 'SELECT') {
        return this.checkValue(elem);
    } else if (tagName === 'TEXTAREA') {
        return this.checkValue(elem);
    } else {
        return this.checkAttr(elem, 'mui-value');
    }
};
//---------- 检查value ----------
proto.checkValue = function (elem) {
    if (elem.getAttribute('required')) {
        const value = elem.value;
        if (value === undefined || value === null || value === '') {
            return {
                elem, errtype: 'required', errmsg: ERRMSG_MAP.VALUE_REQUIRED
            }
        }
    }
    if (elem.getAttribute('equals')) {
        if (elem.value !== elem.getAttribute('equals')) {
            return {
                elem, errtype: 'equals', errmsg: elem.getAttribute('required-errmsg')
            }
        }
    }
    if (elem.getAttribute('pattern')) {
        const reg = new RegExp(elem.getAttribute('pattern'), 'i');
        const val = elem.value;
        if (!reg.test(val)) {
            return {
                elem, errtype: 'pattern', errmsg: ERRMSG_MAP.VALUE_PATTERN
            }
        }
    }
};
//---------- 检查attribute ----------
proto.checkAttr = function (elem, attrName) {
    if (elem.getAttribute('required')) {
        const value = elem.getAttribute(attrName);
        if (value === undefined || value === null || value === '') {
            return {
                elem, errtype: 'required', errmsg: ERRMSG_MAP.VALUE_REQUIRED
            }
        }
    }
    if (elem.getAttribute('pattern')) {
        const reg = new RegExp(elem.getAttribute('pattern'), 'i');
        const val = elem.getAttribute(attrName);
        if (!reg.test(val)) {
            return {
                elem, errtype: 'pattern', errmsg: ERRMSG_MAP.VALUE_PATTERN
            }
        }
    }
};
//---------- 检查radio和checkbox ----------
proto.checkRadio = function (elem, type) {
    let name = elem.getAttribute('name');
    // 无名不验
    if (!name) {
        return null;
    }
    // 如果入栈失败，说明已经同名check过了，不重复进行
    if (!this.inNameStack(elem, 'input_' + type + '_' + name)) {
        return null;
    }
    // 获取同名元素
    const inputs = this.getSameGroupInputs(type, name);
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            return null;
        }
    }
    return {
        elem, errtype: "required", errmsg: ERRMSG_MAP.GROUP
    }
};
// 将elem按名字入栈
// 防止同name的<radio />或<checkbox />重复检查
proto.inNameStack = function (elem, key) {
    if (this.nameStackMap[key]) {
        this.nameStackMap[key].push(elem);
        return false;
    } else {
        this.nameStackMap[key] = [elem];
        return true;
    }
};
// 获取同组的Inputs
proto.getSameGroupInputs = function (type, name) {
    return this.form.querySelectorAll(`input[type=${type}][name=${name}]`);
};
proto.dispose = function () {
    this.reset();
};
export default MUIVali;
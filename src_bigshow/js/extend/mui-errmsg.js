import Tooltip from './mui-tooltip.js';

function MUIErrMsg(elem, errmsg) {
    if (!elem) {
        return;
    }
    this.elem = elem;
    this.errmsg = errmsg;
    this.tooltip = new Tooltip({
        target: elem,
        text: errmsg,
        silent: true,
        autoShow: true,
        skin: 'vali'
    });
    this.elemTagName = elem.tagName.toUpperCase();
    this.elemType = (elem.getAttribute('type') || '').toLowerCase();
    // 15秒自动消失
    this.timer = setTimeout(() => {
        this.dispose();
    }, 15 * 1000);
    this.dispose = () => {this._dispose()};

    this.bind();
}
const proto = MUIErrMsg.prototype;
proto.findForm = function () {
    let elem = this.elem;
    do {
        var p = elem.parentNode || elem.parentElement;
        if (!p) {
            return null;
        }
        const tagName = p.tagName.toUpperCase();
        if (tagName === 'FORM' || tagName === 'BODY') {
            return p;
        }
        elem = p;
    } while (elem);
};
proto.bind = function () {
    if (this.elemTagName === 'INPUT') {
        if (this.elemType === 'radio' || this.elemType === 'checkbox') {
            this.bindRadio();
        } else {
            this.elem.addEventListener('input', this.dispose);
            if (this.elem.readOnly || this.elem.disabled) {
                this.elem.addEventListener('click', this.dispose);
            }
        }
    } else if (this.elemTagName === 'SELECT') {
        this.elem.addEventListener('change', this.dispose);
        this.elem.addEventListener('click', this.dispose);
    } else if (this.elemTagName === 'TEXTAREA') {
        this.elem.addEventListener('input', this.dispose);
    } else {
        this.elem.addEventListener('click', this.dispose);
        this.elem.addEventListener('focus', this.dispose);
        this.elem.addEventListener('focusin', this.dispose);
    }
};
proto.unbind = function () {
    if (this.elemTagName === 'INPUT') {
        this.elem.removeEventListener('input', this.dispose);
        this.elem.removeEventListener('click', this.dispose);
    } else if (this.elemTagName === 'SELECT') {
        this.elem.removeEventListener('change', this.dispose);
        this.elem.removeEventListener('click', this.dispose);
    } else if (this.elemTagName === 'TEXTAREA') {
        this.elem.removeEventListener('input', this.dispose);
    } else {
        this.elem.removeEventListener('click', this.dispose);
        this.elem.removeEventListener('focus', this.dispose);
        this.elem.removeEventListener('focusin', this.dispose);
    }

    if (this.inputs) {
        this.unbindRadio();
        this.inputs = undefined;
    }
};
proto.bindRadio = function () {
    const formElem = this.findForm();
    if (!formElem) {
        return;
    }
    const name = this.elem.getAttribute('name');
    if (!name) {
        return;
    }
    const inputs = formElem.querySelectorAll(`input[type=${this.elemType}][name=${name}]`);
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('click', this.dispose);
        inputs[i].addEventListener('change', this.dispose);
    }
    this.inputs = inputs;
};
proto.unbindRadio = function () {
    const inputs = this.inputs;
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].removeEventListener('click', this.dispose);
        inputs[i].removeEventListener('change', this.dispose);
    }
};
proto._dispose = function () {
    this.unbind();
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = 0;
    }
    if (this.tooltip) {
        this.tooltip.destroy();
        this.tooltip = null;
    }
};
export default MUIErrMsg;
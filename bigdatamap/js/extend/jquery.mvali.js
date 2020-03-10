let $ = require('jquery');

/**
 * Form表单对象
 *
 * @param      {HtmlElement}  elem    The element
 * @param      {jQuery}       $elem   The element
 */
function mVali(elem, $elem) {
    this.elem = elem;
    this.$elem = $elem;
}
mVali.prototype.init = function () {
    this.pushInputs();
};
/**
 * form初始化
 */
mVali.prototype.hasInput = function (elem) {
    if (!this.inputs || !this.inputs.length) {
        return false;
    }
    for (var i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].elem === elem) {
            return true;
        }
    }
    return false;
};
mVali.prototype.pushInputs = function () {
    this.inputs = [];
    var inputs = this.inputs;
    var self = this;
    this.$elem.find('[data-vali]').each(function () {
        if (self.hasInput(this)) {
            return;
        }
        inputs.push(new mInput(this, $(this)));
    });
};
/**
 * 检查
 *
 */
mVali.prototype.check = function (arr) {
    this.pushInputs();
    var isValid = true;
    for (var i = 0; i < this.inputs.length; i++) {
        if (!this.inputs[i].check(arr)) {
            isValid = false;
        }
    }
    return isValid;
};
mVali.prototype.reset = function () {
    var $error = this.$elem.find('[error-for]');
    $error.text('').hide();
};

/**
 * 输入项
 *
 * @param      {HtmlElement}  elem    The element
 * @param      {jQuery}       $elem   The element
 */
function mInput(elem, $elem) {
    this.elem = elem;
    this.$elem = $elem;
    this.tagName = elem.tagName.toLowerCase();
    this.inputName = this.$elem.attr('name');
    this.type = (elem.getAttribute('type') || '').toLowerCase();
    this.rules = (elem.getAttribute('data-vali') || '').split('|');
    this.$form = this.$elem.parents('[vali-form]');
    if (this.$form.length === 0) {
        this.$form = this.$elem.parents('form');
    }
    

    this.elem.mInput = this;
    // 类型判断
    if (this.tagName === 'textarea') {
        this.isTextInput = true;
    } else if (this.tagName === 'input') {
        if (this.type === 'text' || this.type === 'password') {
            this.isTextInput = true;
        } else if (this.type === 'checkbox') {
            this.isCheckbox = true;
        } else if (this.type === 'radio') {
            this.isRadio = true;
        }
    } else if (this.tagName === 'select') {
        this.isSelect = true;
    }

    if (this.isRadio) {
        this.$radio = this.getRadioElem();
    }

    this.bind();
}
mInput.prototype.bind = function () {
    var self = this;
    if (this.isTextInput) {
        this.$elem.on('keyup', function () {
            self.check();
        });
        this.$elem.on('blur', this.delayCheck.bind(this));
    } else if (this.isCheckbox) {
        this.$elem.on('click change', function () {
            self.check();
        });
    } else if (this.isRadio) {
        this.$radio.on('click change', function () {
            self.check();
        });
    }
};

/**
 * 校验（不进行错误提示）
 *
 * @return     {boolean}
 */
mInput.prototype.vali = function () {
    for (var i = 0; i < this.rules.length; i++) {
        var rule = this.rules[i];
        if (!this['_' + rule]) {
            continue;
        }
        if (this['_' + rule]() === false) {
            return false;
        }
    }
    return true;
};
mInput.prototype.delayCheck = function (e) {
    if (this.delayTimer) {
        clearTimeout(this.delayTimer);
    }
    this.delayTimer = setTimeout(this.check.bind(this), 150);
    return e;
};
/**
 * 检查并提示错误
 */
mInput.prototype.check = function (arr) {
    var isValid = true;
    for (var i = 0; i < this.rules.length; i++) {
        var rule = this.rules[i];
        var method = '_' + rule;
        if (!this[method]) {
            continue;
        }
        var result = this[method]();
        if (!result) {
            // 显示错误
            var errmsg = this.showError(rule);
            isValid = false;
            if (arr) {
                arr.push({
                    errmsg: errmsg,
                    mInput: this
                });
            }
        } else if (isValid) {
            // 隐藏错误
            this.hideError(rule);
        }
    }
    if (isValid) {
        this.showSuccess();
    } else {
        this.hideSuccess();
    }
    return isValid;
};
/**
 * 获取radio同名元素
 */
mInput.prototype.getRadioElem = function () {
    // 没有名字
    if (!this.inputName || this.$form.length === 0) {
        return this.$elem;
    }
    // 同名radio
    return this.$form.find('input[type=radio][name=' + name + ']');
};
/**
 * 获取被选中的radio
 */
mInput.prototype.getCheckedRadio = function () {
    if (this.$radio && this.$radio.length) {
        return this.$radio.filter(':checked');
    }
    return this.$elem.filter(':checked');
};

mInput.prototype.getErrorElem = function (rule) {
    if (!this.inputName || !this.$form.length) {
        return null;
    }
    var $error = this.$form.find('[error-for=' + this.inputName + ']');
    var $elem;
    $error.each(function () {
        var elemRule = this.getAttribute('rule');
        if (!elemRule || elemRule === rule) {
            $elem = $(this);
        }
    });
    return $elem;
};
mInput.prototype.getSuccessElem = function () {
    if (!this.inputName || !this.$form.length) {
        return null;
    }
    return this.$form.find('[success-for=' + this.inputName + ']');
};
mInput.prototype.showSuccess = function () {
    var $elem = this.getSuccessElem();
    if ($elem) {
        $elem.show();
    }
};
mInput.prototype.hideSuccess = function () {
    var $elem = this.getSuccessElem();
    if ($elem) {
        $elem.hide();
    }
};
mInput.prototype.showErrmsg = function (errmsg) {
    var $error = this.getErrorElem();
    if ($error) {
        $error.text(errmsg).show();
        return true;
    }
    return false;
};
mInput.prototype.showError = function (rule) {
    var $error = this.getErrorElem(rule);
    if ($error) {
        if (!$error.text()) {
            var errmsg = this.getErrorMsg(rule);
            $error.text(errmsg);
        }
        $error.show();
    }
    return errmsg;
};
mInput.prototype.hideError = function (rule) {
    var $error = this.getErrorElem(rule);
    if ($error) {
        $error.text('').hide();
    }
};
/**
 * 错误提示信息
 * @type {Object}
 */
var errorMessages = {
    number: '请填写数字',
    version: '只输入正确格式，例如1.8.3',
    maxlen: '超过最大长度限制',
    mobile: '请输入11位有效手机号',
    password: '密码为6-16位数字或字母',
    url: '请输入正确的URL'
};
mInput.prototype.getErrorMsg = function (rule) {

    var elemMsg = this.$elem.attr('errmsg-' + rule) || this.$elem.attr('errmsg');
    if (elemMsg === ':placeholder') {
        return this.$elem.attr('placeholder');
    }
    if (elemMsg) {
        return elemMsg;
    }
    if (rule === 'required') {
        if (this.isTextInput) {
            return '内容不能为空';
        } else if (this.isCheckbox || this.isRadio) {
            return '请勾选此项';
        } else if (this.isSelect) {
            return '请选择一项';
        }
    }

    return errorMessages[rule] || '表单错误';
};
mInput.prototype.getValue = function () {
    if (this.isTextInput) {
        return $.trim(this.$elem.val());
    }
    return this.$elem.val();
};
/**
 * 不能为空
 */
mInput.prototype._required = function () {
    if (this.isTextInput) {
        return $.trim(this.$elem.val()) !== '';
    }
    if (this.isCheckbox) {
        return !!this.$elem.prop('checked');
    }
    if (this.isRadio) {
        return (this.getCheckedRadio().length > 0);
    }
    
    return !!this.$elem.val();
};

/**
 * 数字
 */
mInput.prototype._number = function () {
    var val = this.getValue();
    if (isNaN(val)) {
        return false;
    }
    return true;
};

/**
 * 版本号
 *
 */
mInput.prototype._version = function () {
    var val = this.getValue() + '';
    var arr = val.split('.');
    if (arr.length < 2) {
        return false;
    }
    for (var i = 0; i < arr.length; i++) {
        if (!arr[i] || isNaN(arr[i])) {
            return false;
        }
    }
    return true;
};

/**
 * 手机号
 *
 */
mInput.prototype._mobile = function () {
    var MOBILE_REG = /^1\d{10}$/;
    var val = this.getValue();
    return !!MOBILE_REG.test(val);
};

/**
 * 密码
 *
 */
mInput.prototype._password = function () {
    var reg = /^[a-zA-Z0-9]{6,16}$/;
    var val = this.getValue();
    return !!reg.test(val);
};

mInput.prototype._url = function () {
    var reg = /^((http|ftp|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[a-zA-Z0-9\&%_\./-~-]*)?$/;
    var val = this.getValue();
    return !!reg.test(val);
};

// Email正则
// var ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

//身份证号（18位）正则
// var cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;


/**
 * Exports
 *
 */
$.fn.mVali = function (method) {
    var args = Array.prototype.slice.call(arguments, 1);
    var result;
    this.each(function () {
        if (!this.mVali) {
            this.mVali = new mVali(this, $(this));
        }

        if (this.mVali[method]) {
            var ret = this.mVali[method].apply(this.mVali, args);
            // 只返回第一个返回值
            if (result === undefined) {
                result = ret;
            }
        }
    });
    return result;
};

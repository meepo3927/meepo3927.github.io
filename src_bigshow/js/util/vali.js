const isNull = (str) => {
    return (str === '' || str === null || str === undefined);
};
const errmsg = {
    required: '请填写',
    number: '请填写数字',
    maxlen: '超过最大长度限制',
    mobile: '请输入11位有效手机号',
    password: '密码为6-16位数字或字母',
    email: '请输入正确的email，例如：abc@gmail.com',
    url: '请输入正确的URL'
};
const exports = {
    errmsg
};

const execute = (ruleName, val) => {
    let func = exports[ruleName];
    if (typeof func !== 'function' || ruleName === 'all') {
        return true;
    }
    return func(val);
};

exports.required = (val) => {
    return (val.trim().length > 0);
};

exports.mobile = (val) => {
    const MOBILE_REG = /^1\d{10}$/;
    return !!MOBILE_REG.test(val);
};

exports.email = (val) => {
    var EMAIL_REG = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return !!EMAIL_REG.test(val);
};

exports.all = (rules) => {
    if (!rules || rules.length === 0) {
        return true;
    }
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let val = rule[0];
        //let pureVal = val.trim();
        for (let j = 1; j < rule.length; j++) {
            if (rule[j] === 'nullPass' && isNull(val)) {
                break;
            }
            let arr = rule[j].split(':');
            let ruleName = arr[0];
            let subfix = arr[1] || '';
            if (!execute(ruleName, val)) {
                return errmsg[ruleName] + subfix;
            }
        }
    }
    return true;
};

module.exports = exports;
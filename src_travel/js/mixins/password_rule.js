const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
const RULE_TIP = '密码中必须包含大写字母、小写字母、数字，至少8个字符，最多32个字符';
let methods = {};
methods.checkPasswordRule = function (str) {
    if (str.length < 8 || str.length > 32) {
        return RULE_TIP;
    }
    let hasUp = false, hasLower = false, hasNum = false;
    for (var i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code >= 48 && code <= 59) {
            hasNum = true;
        } else if (code >= 97 && code <= 122) {
            hasLower = true;
        } else if (code >= 65 && code <= 90) {
            hasUp = true;
        }
    }
    if (hasNum && hasLower && hasUp) {
        return true;
    } else {
        return RULE_TIP
    }
};
let computed = {};
computed.passwordRuleTip = function () {
    return RULE_TIP;
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {}
};
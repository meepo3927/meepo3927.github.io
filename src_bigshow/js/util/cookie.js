/**
 * cookie方法
 */
define([], function () {
    "use strict";
    var doc = document;
    var _exp = "; expires=";
    var _domain = "; domain=";
    var _path = '; path=/';
    var exports = {};

    /**
     * 获取cookie的值
     *
     * @method get
     * @param a {String} cookie中得key
     * @return {String}
     */
    exports.get = function (name) {
        var result = doc.cookie.match("(?:;|^)\\s*" + name + "\\s*=\\s*([^;]+)\\s*(?:;|$)");
        return result && result[1];
    };

    function getNowTime() {
        return (new Date()).getTime();
    }

    /**
     * 设置cookie的值
     *
     * @method set
     * @param name {String} key
     * @param value {String|Number} value
     * @param expire {Number} expiration time(s)
     * @param domain {String} domain
     */
    exports.set = function (name, value, expire, domain) {
        var str = name + '=' + value;
        if (expire) {
            let d = new Date();
            d.setTime(getNowTime() + expire * 1000);
            str += _exp + d.toUTCString();
        }
        if (domain) {
            str += _domain + domain;
        }
        str += _path;
        doc.cookie = str;
        return str;
    };

    /**
     * 删除cookie的值
     *
     * @method remove
     * @param name {String} key
     */
    exports.remove = function (name, domain) {
        return exports.set(name, '', -3600 * 24);
    };

    return exports;
});
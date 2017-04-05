/*jshint asi:true */
/*global define window document */
/**
 * cooki方法
 *
 * @module cookie
 */
define([], function () {
    "use strict";
    var _exp = "; expires=",
        _domain = "; domain=",
        doc = document;

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
     * @param expire {Date} expiration time(s)
     * @param domain {String} domain
     */
    exports.set = function (name, value, expire, domain) {
        var str = name + '=' + value;
        if (expire) {
            str += _exp + (new Date(getNowTime + expire * 1000)).toGMTString();
        }
        if (domain) {
            str += _domain + domain;
        }
        str += '; path=/';
        doc.cookie = str;
    };

    /**
     * 删除cookie的值
     *
     * @method remove
     * @param name {String} key
     */
    exports.remove = function (name) {
        doc.cookie = name + "=" + _exp + (new Date()).toGMTString();
    };

    return exports;
});
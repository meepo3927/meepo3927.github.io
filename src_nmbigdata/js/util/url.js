/**
 * @描述  轻量级URL库
 * @用法:
 * 1. getQuery(url)   将URL参数解析成对象，例如将 a=1&b=2 解析成 {"a":"1", "b":"2"}
 * 2. buildQuery(obj) 将对象组成URL参数，例如将 {"a":"1", "b":"2"} 组成 a=1&b=2
 * 3. query(bool)     获取当前URL参数，反复调用不会重新解析
 */

(function (name, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        window[name] = factory();
    }
}('URL', function () {
    "use strict";
    var exports = {};

    /**
     * 获取query对象
     * @param  {string} url URL
     * @return {Object}
     */
    exports.getQuery = function (url) {
        url = url || window.location.search;

        var qMarkPos = url.indexOf('?');
        if (qMarkPos >= 0) {
            url = url.substr(qMarkPos + 1);
        }

        var hashPos = url.indexOf('#');
        if (hashPos >= 0) {
            url = url.substr(0, hashPos);
        }

        var ret = {};
        var arr = url.split('&');
        for (var i = 0; i < arr.length; i++) {
            var kv = arr[i].split('=');
            if (kv[0]) {
                ret[kv[0]] = kv[1] || '';
            }
        }
        return ret;
    };

    /**
     * 将query对象构造成字符串
     * @param  {Object} obj Query对象
     * @return {string}
     */
    exports.buildQuery = function (obj) {
        var str = [];
        for (var key in obj) {
            if (!obj.hasOwnProperty(key) || !key) {
                return;
            }
            var val = encodeURIComponent(obj[key] || '');
            str.push(
                encodeURIComponent(key) + '=' + val
            );
        };
        return str.join('&');
    };

    exports.getHash = function () {
        var str = location.hash;
        if (!str) {
            return '';
        }
        var charFound = false;
        var result = '';
        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i);
            if (char === '#') {
                if (charFound) {
                    break;
                } else {
                    continue;
                }
            }
            charFound = true;
            result += char;
        }
        return result;
    };

    exports.getHashArray = function (split) {
        split = split || '-';
        var hash = location.hash.substr(1);
        return hash ? hash.split(split) : [];
    };

    /**
     * 获取当前url参数
     * 
     * @return {Object}
     */
    exports.query = (function () {
        var q;
        return function (force) {
            if (!q || force) {
                q = exports.getQuery();
            }
            return q;
        };
    })();

    return exports;
}));
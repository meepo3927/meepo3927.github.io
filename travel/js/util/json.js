/**
 * @file    轻量级JSON库
 * @author  guoye (guoye01@baidu.com)
 */

define([], function () {
    'use strict';
    var parse = function (str) {
        var obj;
        try {
            obj = (
                new Function(
                    'return (' + str + ')'
                )
            )();
        } catch (e) {
            obj = null;
        }
        return obj;
    };

    // 如果浏览器有原生JSON对象
    if (window.JSON) {
        var encode = window.JSON.stringify;
    } else {
        var escapeJsonMap = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"' : '\\"',
            "\\": '\\\\'
        };
        var jsonPad = function (source) {
            return source < 10 ? '0' + source : source;
        };
        var encodeJsonString = function (source) {
            if (/["\\\x00-\x1f]/.test(source)) {
                source = source.replace(
                    /["\\\x00-\x1f]/g, 
                    function (match) {
                        var c = escapeJsonMap[match];
                        if (c) {
                            return c;
                        }
                        c = match.charCodeAt();
                        return "\\u00" 
                                + Math.floor(c / 16).toString(16) 
                                + (c % 16).toString(16);
                    }
                );
            }
            return '"' + source + '"';
        };
        var encodeJsonDate = function (source) {
            return '"'
                + source.getFullYear() + "-" 
                + jsonPad(source.getMonth() + 1) + "-" 
                + jsonPad(source.getDate()) + "T" 
                + jsonPad(source.getHours()) + ":" 
                + jsonPad(source.getMinutes()) + ":" 
                + jsonPad(source.getSeconds()) + '"';
        };
        var encodeJsonArray = function (source) {
            var result = ["["];
            var encodeFunc = encode;
            var len = source.length;
            var preComma = false;
            var i
            for (i = 0; i < len; i++) {
                var item = source[i];
                var type = typeof item;
                if(type === 'undefined'
                    || type === 'unknown'
                    || type === 'function') {
                    continue;
                }
                preComma && result.push(',');
                preComma = true;
                result.push(encodeFunc(item));
            }
            result.push("]");
            return result.join("");
        };
        var encodeJsonComplex = function (obj) {
            var result = ['{'];
            var encodeFunc = encode;
            var preComma = false;
            for (var key in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                    continue;
                }
                var item = obj[key];
                var type = typeof item;
                if (type === 'undefined'
                    || type === 'unknown'
                    || type === 'function') {
                    continue;
                }
                preComma && result.push(',');
                preComma = true;
                result.push(encodeFunc(key) + ':' + encodeFunc(item));
            }
            result.push('}');
            return result.join('');
        };
        var encodeJsonObject = function (obj) {
            if (obj === null) {
                return 'null';
            } else if (obj instanceof Array) {
                return encodeJsonArray(obj);
            } else if (obj instanceof Date) {
                return encodeJsonDate(obj);
            } else {
                return encodeJsonComplex(obj);
            }
        };
        var encode = function (obj) {
            switch (typeof obj) {
                case 'undefined': return 'undefined';
                case 'number'   : return isFinite(obj) ? String(obj) : 'null';
                case 'string'   : return encodeJsonString(obj);
                case 'boolean'  : return String(obj);
                default : return encodeJsonObject(obj);
            }
        };
    }

    var exports = {};

    // string -> object
    exports.parse = parse;
    exports.decode = parse;

    var stringify = function (object) {
        var string = encode(object);
        if (!string) {
            return '';
        }
        return string.replace(/\\u([0-9a-fA-F]{2,4})/g, function (string, matched) {
            return String.fromCharCode(parseInt(matched, 16));
        });
    };
    // object -> string
    exports.encode = stringify;
    exports.stringify = stringify;

    return exports;
});

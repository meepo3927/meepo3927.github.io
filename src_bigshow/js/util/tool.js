/**
 * @描述  轻量级工具
 * @用法  ...
 */

(function (name, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        window[name] = factory();
    }
}('UtilTool', function () {
    "use strict";
    var exports = {};

    var getRandInt = function (p1, p2) {
        var min;
        var max;
        if (arguments.length === 1) {
            min = 0;
            max = p1;
        } else {
            min = p1;
            max = p2;
        }
        return Math.round(Math.random() * (max - min)) + min;
    };

    exports.getUniqueId = (function () {
        var i = getRandInt() + 10000;
        return function () {
            return (i++);
        };
    })();

    var rhashcode = /\d\.\d{4}/;
    exports.getRandomHash = function (prefix) {
        prefix = prefix || 'hash';
        return String(Math.random() + Math.random()).replace(rhashcode, prefix);
    };

    exports.getTotalPage = function (total, rows) {
        if (!total) {
            return 1;
        }

        return Math.floor((total - 1) / rows) + 1;
    };

    exports.eacho = (o, f) => {
        if (!o || !f) {
            return;
        }
        for (let i in o) {
            if (o.hasOwnProperty(i)) {
                f(o[i], i, o);
            }
        }
    };

    exports.padZero = function (num, len) {
        len = len || 2;
        num = num + '';
        var count = len - num.length;
        for (var i = 0; i < count; i++) {
            num = '0' + num;
        }
        return num;
    };

    exports.getRandInt = getRandInt;

    exports.getRandIntBatch = function (min, max, num) {
        var r = [];
        for (var i = 0; i < num; i++) {
            r.push(exports.getRandInt(min, max));
        }
        return r;
    };

    exports.getRandFromArray = function (arr, count) {
        var copy = [];
        Array.prototype.push.apply(copy, arr);
        if (count >= copy.length) {
            return copy;
        }
        var r = [];
        for (var i = 0; i < count; i++) {
            var j = exports.getRandInt(copy.length - 1);
            r.push(copy[j]);
            copy.splice(j, 1);
        }
        return r;
    };

    exports.getRandomColor = function () {
        var arr = [];
        arr.push(
            exports.getRandInt(60, 240),
            exports.getRandInt(60, 240),
            exports.getRandInt(60, 240)
        );
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].toString(16);
        }
        return '#' + arr.join('');
    };
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    function escapeHTML (string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }
    exports.escapeHTML = escapeHTML;

    var toStr = Object.prototype.toString;
    var isType = function (obj, type) {
        return toStr.call(obj) === ('[object ' + type + ']');
    };
    var isArray = function (o) {
        return isType(o, 'Array');
    };
    var isObject = function (o) {
        return isType(o, 'Object');
    };
    var isFunction = function (f) {
        return isType(f, 'Function');
    };
    
    exports.isType = isType;
    exports.isArray = isArray;
    exports.isObject = isObject;
    exports.isFunction = isFunction;

    var inArray = function (v, arr) {
        if (v === undefined) {
            return false;
        }
        for (var i = 0; i < arr.length; i++) {
            if (v === arr[i]) {
                return true;
            }
        }
        return false;
    };

    var pushUnique = function (arr, v) {
        if (!inArray(v, arr)) {
            arr.push(v);
        }
    };

    var mExtend = function (target, obj, arr) {
        var toStr = Object.prototype.toString;

        target = target || {};
        obj = obj || {};

        pushUnique(arr, target);
        pushUnique(arr, obj);

        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) {
                continue;
            }
            var value = obj[i];

            // 打破循环
            if (inArray(value, arr)) {
                continue;
            }

            var type = toStr.call(value);
            if (type === '[object Array]') {
                // 数据
                target[i] = mExtend(target[i] || [], value, arr);
            } else if (type === '[object Object]') {
                target[i] = mExtend(target[i], value, arr);
            } else {
                target[i] = value;
            }
        }

        return target;
    };

    exports.extend = function extend(target, obj) {
        if (arguments.length > 2) {
            for (var i = 1; i < arguments.length; i++) {
                target = mExtend(target, arguments[i], []);
            }
            return target;
        }

        return mExtend(target, obj, []);
    };
    
    var deepEqual = function (o1, o2) {
        if (isArray(o1)) {
            o2 = o2 || [];
            for (var i = 0; i < o1.length; i++) {
                if (!deepEqual(o1[i], o2[i])) {
                    return false;
                }
            }
            return true;
        } else if (isObject(o1)) {
            o2 = o2 || {};
            for (var i in o1) {
                if (o1.hasOwnProperty(i) && !deepEqual(o1[i], o2[i])) {
                    return false;
                }
            }
            return true;
        }
        return (o1 === o2);
    };
    exports.deepEqual = deepEqual;

    exports.selectText = function (elem, start, end) {
        if (!elem) {
            return;
        }
        if (start === undefined) {
            start = 0;
        }
        if (end === undefined) {
            end = elem.value.length;
        }
        if (elem.setSelectionRange) {
            elem.setSelectionRange(start, end);
        } else if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveStart("character", start);
            range.moveEnd("character",start - end);
            range.select();
        }
        elem.focus();
    };

    function getCursortPosition (elem) {
        if (document.selection) {
            elem.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -elem.value.length);
            return Sel.text.length;
        }
        if (elem.selectionStart || elem.selectionStart == '0') {
            return elem.selectionStart;
        }
        return 0;
    }
    exports.getCursortPosition = getCursortPosition;

    exports.getIEVersion = function () {
        var versions = {
            objectobject: 7, //IE7-8
            objectundefined: 6, //IE6
            undefinedfunction: NaN, // other modern browsers
            undefinedobject: NaN
        };
        return document.documentMode || versions[typeof document.all + typeof XMLHttpRequest];
    };

    exports.debounce = function (func, wait) {
        wait = wait || 300;
        var timer;
        return function () {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            var context = this;
            var args = Array.prototype.slice.call(arguments);
            timer = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        };
    };

    exports.filterEmpty = function (o) {
        if (!o) {
            return o;
        }
        var r = {};
        for (var i in o) {
            if (!o.hasOwnProperty(i)) {
                continue;
            }
            var v = o[i];
            if (v === undefined || v === null || v === '') {
                continue;
            }

            r[i] = v;
        }
        return r;
    };

    var loopdeep = (list, callback) => {
        if (!list || !list.length) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            let item = list[i] || {};
            if (callback(item) === false) {
                break;
            }
            loopdeep(item.children, callback);
        }
    };
    exports.loopdeep = loopdeep;

    exports.strEndWith = (long, short) => {
        if (!long || !short) {
            return false;
        }
        if (long.length < short.length) {
            return false;
        }
        let m = long.length - short.length;
        if (long.substr(m) === short) {
            return true;
        }
        return false;
    };

    exports.strlen = (str) => {
        if (!str || !str.length) {
            return 0;
        }
        return str.replace(/[^\x00-\xff]/g, '**').length;
    };

    exports.isNotBlankObject = (o) => {
        if (!isObject(o)) {
            return false;
        }
        for (let i in o) {
            if (o.hasOwnProperty(i)) {
                return true;
            }
        }
        return false;
    };

    exports.addNumDot = (num) => {
        let str = num + '';
        let len = str.length;
        let arr = [];
        let count = 0;
        for (let i = len - 1; i >= 0; i--) {
            arr.unshift(str.charAt(i))
            if ((++count % 3) === 0 && (i !== 0)) {
                arr.unshift(',');
            }
        }

        return arr.join('')
    };

    exports.winopen = (url, params = {}) => {
        var width = params.width || 1024;
        var height = params.height || 768;
        window.open(url, '', [
            'toolbar=no',
            'menubar=no',
            'status=no',
            'location=yes',
            'scrollbars=yes',
            'resizable=yes',
            'width=' + (width + 'px'),
            'height=' + (height + 'px')
        ].join(','));
    };

    exports.randStr = () => {
        return (Math.random().toString(32)).substr(2);
    };

    return exports;
}));

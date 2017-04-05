define([], function () {
    var exports = {};

    exports.getUniqueId = (function () {
        var i = 1;
        return function () {
            return (i++);
        };
    })();

    exports.getTotalPage = function (total, rows) {
        if (!total) {
            return 1;
        }

        return Math.floor((total - 1) / rows) + 1;
    };

    exports.makeAttr = function (obj) {
        var arr = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var value = obj[i] || '';
                if (value.replace) {
                    value = value.replace(/"/g, '');
                }
                arr.push(i + '="' + value + '"');
            }
        }
        return ' ' + arr.join(' ') + ' ';
    };

    exports.isIframe = function () {
        return window.top !== window.self;
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

    exports.getRandInt = function (p1, p2) {
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

    exports.extend = function extend(target, obj) {
        target = target || {};
        obj = obj || {};
        var toStr = Object.prototype.toString;
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) {
                continue;
            }
            if (obj[i] === target) {
                continue;
            }
            var type = toStr.call(obj[i]);
            if (type === '[object Array]') {
                target[i] = extend(target[i] || [], obj[i]);
            } else if (type === '[object Object]') {
                target[i] = extend(target[i], obj[i]);
            } else {
                target[i] = obj[i];
            }
        }
        if (arguments.length > 2) {
            for (i = 2; i < arguments.length; i++) {
                target = extend(target, arguments[i]);
            }
        }
        return target;
    };

    // IE版本
    exports.getIEVersion = function () {
        var versions = {
            objectobject: 7, //IE7-8
            objectundefined: 6, //IE6
            undefinedfunction: 0, // other modern browsers
            undefinedobject: 0
        };
        return document.documentMode || versions[typeof document.all + typeof XMLHttpRequest];
    };

    return exports;
});
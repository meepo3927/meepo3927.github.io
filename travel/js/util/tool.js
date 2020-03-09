define([], function () {
    var exports = {};

    exports.getUniqueId = (function () {
        var i = 1;
        return function () {
            return (i++);
        };
    })();

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
        if (arguments.length > 2) {
            for (i = 1; i < arguments.length; i++) {
                target = extend(target, arguments[i]);
            }
            return target;
        }
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

    exports.convertDate = function (dateString) {
        var dates = dateString.replace(/-/g, ',').split(',');
        if (dates.length === 3) {
            return new Date(dates[0], dates[1] - 1, dates[2]);
        }
        return new Date(dates[0], dates[1] - 1, dates[2], dates[3], dates[4], dates[5]);
    };

    var toStr = Object.prototype.toString;
    var isArray = function (o) {
        return toStr.call(o) === '[object Array]';
    };
    var isObject = function (o) {
        return toStr.call(o) === '[object Object]';
    };
    var isFunction = function (f) {
        return toStr.call(o) === '[object Function]';
    };
    exports.isArray = isArray;
    exports.isObject = isObject;
    exports.isFunction = isFunction;

    exports.copy = (a) => {
        if (isArray(a)) {
            return exports.extend([], a);
        } else if (isObject(a)) {
            return exports.extend({}, a);
        }
        return JSON.stringify(JSON.parse(a));
    };

    function padDecimal(num, len = 2) {
        let a = (num + '').split('.');
        let str = a[1] || '';
        while (str.length < len) {
            str += '0';
        }
        return a[0] + '.' + str;
    }

    exports.padDecimal = padDecimal;

    exports.getPercent = function (x, all, o = {subfix: '%', len: 2}) {
        var n;
        if (all === 0) {
            n = 0;
        } else {
            n = (x * 100) / all;
        }
        if (o.len === 0) {
            n = Math.round(n);
        } else {
            let p = Math.pow(10, o.len);
            n = Math.round(n * p) / p;
            n = padDecimal(n, o.len);
        }
        return n + o.subfix;
    };
    exports.getMaxInArray = (a) => {
        let max = -Infinity;
        let index = -1;
        a.forEach((v, i) => {
            if (max < v) {
                max = v;
                index = i;
            }
        });
        return {max, index};
    };
    exports.getMaxInMap = (o) => {
        let max = -Infinity;
        let key = null;
        for (let i in o) {
            if (!o.hasOwnProperty(i)) {
                continue;
            }
            let v = o[i];
            if (isNaN(v)) {
                continue;
            }

            if (max < v) {
                max = v;
                key = i;
            }
        }
        return {max, key};
    };

    exports.calPercent = (a, key = 'value', o) => {
        let total = 0;
        a.forEach((v) => {
            total += (v[key] * 1);
        });

        a.forEach((v) => {
            v._percent = exports.getPercent(v[key], total, o);
        });

        return a;
    };
    exports.calPercentByKey = (a, keys) => {
        let total = 0;
        let my = 0;
        a.forEach((v) => {
            total += v.value;
            if (keys.indexOf(v.name) >= 0) {
                my += v.value;
            }
        });
        return exports.getPercent(my, total);
    };

    exports.strlen = (str) => {
        if (!str || !str.length) {
            return 0;
        }
        return str.replace(/[^\x00-\xff]/g, '**').length;
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
            for (var i in o2) {
                if (o2.hasOwnProperty(i) && !o1.hasOwnProperty(i)) {
                    return false;
                }
            }
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

    exports.calDataMapTotal = (data) => {
        let totalArray = [];
        exports.eacho(data.dataMap, (arr, name) => {
            arr.forEach((v, i) => {
                if (!totalArray[i]) {
                    totalArray[i] = 0;
                }

                totalArray[i] += v;
            });
        });

        return totalArray;
    };

    exports.getPercentMaxIndex = (data, names, totalArray) => {
        let map = data.dataMap;
        let nameTotal = [];
        names.forEach((name, i) => {
            let arr = map[name];
            if (!arr) {
                return;
            }
            arr.forEach((v, k) => {
                if (!nameTotal[k]) {
                    nameTotal[k] = 0;
                }
                nameTotal[k] += v;
            });
        });
        let maxPercent = 0;
        let maxIndex = -1;
        nameTotal.forEach((v, i) => {
            let p = Math.round(v * 10000 / totalArray[i]) / 100;
            
            if (p > maxPercent) {
                maxPercent = p;
                maxIndex = i;
            }
        });
        return {
            maxIndex,
            maxPercent,
            theStr: padDecimal(maxPercent) + '%',
            theName: data.names[maxIndex]
        };
    };

    return exports;
});
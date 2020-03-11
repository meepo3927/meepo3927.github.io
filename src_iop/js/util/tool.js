define(['config'], function (config) {
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
    exports.extend = function extend(target, obj) {
        target = target || {};
        obj = obj || {};
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) {
                continue;
            }
            if (obj[i] === target) {
                continue;
            }
            var o = obj[i];
            if (isArray(o)) {
                target[i] = extend(target[i] || [], o);
            } else if (isObject(o)) {
                target[i] = extend(target[i], o);
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

    exports.loadImage = function (src, callback) {
        let image = new Image();
        image.onload = function () {
            callback(src);
        };
        image.src = src;
        return image;
    };

    exports.filterEmpty = (o) => {
        if (!o) {
            return o;
        }
        let r = {};
        for (let i in o) {
            if (!o.hasOwnProperty(i)) {
                continue;
            }
            let v = o[i];
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

    exports.limitNumber = function (n, min = 0, max = 100) {
        let num = parseInt(n, 10);
        if (isNaN(num)) {
            return 0;
        }
        if (num < min) {
            return min;
        } else if (num > max) {
            return max;
        }
        return num;
    };

    exports.eachTree = (node, f, parent, i) => {
        if (!node) {
            return;
        }
        f(node, parent, i);
        if (!node.children || !node.children.length) {
            return;
        }
        for (let i = node.children.length - 1; i >= 0; i--) {
            let v = node.children[i];
            exports.eachTree(v, f, node, i);
        }
    };

    var camelizeRE = /-(\w)/g;
    exports.camelize = function (str) {
        return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
    };

    exports.capitalize = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    };
    exports.transformLacCell = (str) => {
        let str1 = str.substr(0, 4);
        let str2 = str.substr(4);

        let n1 = parseInt(str1, 16);
        let n2 = parseInt(str2, 16);
        return n1 + '-' + n2;
    };

    exports.winOpen = (url, params = {}) => {
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
});
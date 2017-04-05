webpackJsonp([2],{

/***/ 19:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common__ = __webpack_require__(4);

var mlayer = __webpack_require__(1);

var methods = {};
methods.alert = function () {
    mlayer.msg('alert123');
    __webpack_require__.e/* require.ensure */(0).then((function () {
        var URL = __webpack_require__(8);

        mlayer.msg(URL.query().name);
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

window.Index = new __WEBPACK_IMPORTED_MODULE_0_common__["a" /* Vue */]({
    el: '#main',
    methods: methods,
    data: {
        name: 'index-123'
    }
});

/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_polyfill__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_polyfill___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_polyfill__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1_vue___default.a; });
/* unused harmony reexport $ */


// 基础库




/***/ }),

/***/ 6:
/***/ (function(module, exports) {

/**
 * 1. Function.prototype.bind
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function fNOP() {},
            fBound = function fBound() {
            return fToBind.apply(this instanceof fNOP ? this : oThis || this, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

/**
 * 2. requestAnimationFrame, cancelAnimationFrame
 */
(function (window) {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
    || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function (callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () {
                callback(lastTime = nextTime);
            }, nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
})(window);

/**
 * 3. Date.now
 */
if (!Date.now) {
    Date.now = function now() {
        // return (new Date).valueOf();
        return new Date().getTime();
    };
}
/**
 * 4. [string].trim
 */
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
/**
 * 5. Array.isArray
 */
if (!Array.isArray) {
    Array.isArray = function (vArg) {
        return Object.prototype.toString.call(vArg) === '[object Array]';
    };
}
/**
 * 6. Array.prototype.forEach
 */
if (typeof Array.prototype.forEach != "function") {
    Array.prototype.forEach = function (fn, scope) {
        for (var i = 0; i < this.length; ++i) {
            if (i in this) {
                fn.call(scope, this[i], i, this);
            }
        }
    };
}
/**
 * 7. Array.prototype.map
 */
if (typeof Array.prototype.map != "function") {
    Array.prototype.map = function (fn, context) {
        var arr = [];
        if (typeof fn === "function") {
            for (var i = 0; i < this.length; i++) {
                arr.push(fn.call(context, this[i], i, this));
            }
        }
        return arr;
    };
}
/**
 * 8. Array.prototype.indexOf
 */
if (typeof Array.prototype.indexOf != "function") {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        fromIndex = fromIndex * 1 || 0;
        var len = this.length;
        for (var i = fromIndex; i < len; i++) {
            if (this[i] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

/***/ })

},[19]);
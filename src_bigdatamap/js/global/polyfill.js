/*
 * IE8 polyfill
*/

(function(window, document, undefined) {
    /*
     * Object ES5 extend
    */
    if (!Object.create) {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    if (!Object.keys) {
        Object.keys = function(o) {
            if (o !== Object(o)) {
                throw new TypeError('Object.keys called on a non-object');
            }
            var k = [], p;
            for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o,p)) {
                    k.push(p);
                }
            }
            return k;
        };
    }

    if (!Object.freeze) {
        Object.freeze = function (o) {
            return o;
        };
    }
    
    /*
     * Date ES5 extend
    */
    if (!Date.now) {
        Date.now = function now() {
            return (new Date).valueOf();
        };
    }
    
    /*
     * Function ES5 extend
    */
    if (!Function.prototype.bind) {
        var noop = function () {};
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1);
            var self = this;
            var context = (this instanceof noop ? this : oThis) || this;
            var fBound = function () {
                var args = aArgs.concat(Array.prototype.slice.call(arguments));
                return self.apply(context, args);
            };
            return fBound;
        };
    }

    /*
     * String ES5 extend
    */
    if(!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g,'');
        };
    }

    /*
     * Array ES5 extend
    */
    if(!Array.isArray) {
        Array.isArray = function (vArg) {
            return Object.prototype.toString.call(vArg) === "[object Array]";
        };
    }

    if (!Array.from) {
        Array.from = function(arrayLike) {
            return Array.prototype.slice.call(arrayLike);
        };
    }

    if (typeof Array.prototype.forEach != "function") {
        Array.prototype.forEach = function (fn, scope) {
            var i, len;
            for (i = 0, len = this.length; i < len; ++i) {
                if (i in this) {
                    fn.call(scope, this[i], i, this);
                }
            }
        };
    }
    
    if (typeof Array.prototype.map != "function") {
        Array.prototype.map = function (fn, context) {
            var arr = [];
            if (typeof fn === "function") {
                for (var k = 0, length = this.length; k < length; k++) {
                    arr.push(fn.call(context, this[k], k, this));
                }
            }
            return arr;
        };
    }
    
    if (typeof Array.prototype.filter != "function") {
        Array.prototype.filter = function (fn, context) {
            var arr = [];
            if (typeof fn === "function") {
                for (var k = 0, length = this.length; k < length; k++) {
                  fn.call(context, this[k], k, this) && arr.push(this[k]);
                }
            }
            return arr;
        };
    }
    
    if (typeof Array.prototype.some != "function") {
        Array.prototype.some = function (fn, context) {
            var passed = false;
            if (typeof fn === "function") {
                for (var k = 0, length = this.length; k < length; k++) {
                    if (passed === true) break;
                    passed = !!fn.call(context, this[k], k, this);
                }
            }
            return passed;
        };
    }
    
    if (typeof Array.prototype.every != "function") {
        Array.prototype.every = function (fn, context) {
            var passed = true;
            if (typeof fn === "function") {
                for (var k = 0, length = this.length; k < length; k++) {
                    if (passed === false) break;
                    passed = !!fn.call(context, this[k], k, this);
                }
            }
            return passed;
        };
    }
    
    if (typeof Array.prototype.indexOf != "function") {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var index = -1;
            fromIndex = fromIndex * 1 || 0;

            for (var k = 0, length = this.length; k < length; k++) {
                if (k >= fromIndex && this[k] === searchElement) {
                    index = k;
                    break;
                }
            }
            return index;
        };
    }
    
    if (typeof Array.prototype.lastIndexOf != "function") {
        Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
            var index = -1, length = this.length;
            fromIndex = fromIndex * 1 || length - 1;
    
            for (var k = length - 1; k > -1; k-=1) {
                if (k <= fromIndex && this[k] === searchElement) {
                    index = k;
                    break;
                }
            }
            return index;
        };
    }
    
    if (typeof Array.prototype.reduce != "function") {
        Array.prototype.reduce = function (callback, initialValue ) {
            var previous = initialValue, k = 0, length = this.length;
            if (typeof initialValue === "undefined") {
                previous = this[0];
                k = 1;
            }

            if (typeof callback === "function") {
                for (k; k < length; k++) {
                    this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
                }
            }
            return previous;
        };
    }

    if (typeof Array.prototype.reduceRight != "function") {
        Array.prototype.reduceRight = function (callback, initialValue) {
            var length = this.length;
            var k = length - 1;
            var previous = initialValue;
            if (typeof initialValue === "undefined") {
                previous = this[length - 1];
                k--;
            }
            if (typeof callback === "function") {
                for (k; k > -1; k-=1) {
                    this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
                }
            }
            return previous;
        };
    }

    /* 
     * getElementsByClassName
    */
    if (!document.getElementsByClassName) {
        if (document.querySelectorAll) {
            document.getElementsByClassName = function(classNames) {
                if (classNames && classNames.trim && classNames.replace) {
                    classNames = classNames.trim().replace(/\s+/g, ".");
                }
                return document.querySelectorAll('.' + classNames);
            };
        } else {
            document.getElementsByClassName = function (className) {
                var children = document.getElementsByTagName('*');
                var elements = [];
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var classNames = child.className.split(' ');
                    for (var j = 0; j < classNames.length; j++) {
                        if (!classNames[j]) {
                            continue;
                        }
                        if (classNames[j] === className) {
                            elements.push(child);
                            break;
                        }
                    }
                }
                return elements;
            };
        }
    }

    /**
     * getComputedStyle
    */
    if (typeof window.getComputedStyle !== "function") {
        window.getComputedStyle = function(el, pseudo) {
            var oStyle = {};
            var oCurrentStyle = el.currentStyle || {};
            for (var key in oCurrentStyle) {
                oStyle[key] = oCurrentStyle[key];
            }

            oStyle.styleFloat = oStyle.cssFloat;
             
            oStyle.getPropertyValue = function(prop) {
                // return oCurrentStyle.getAttribute(prop) || null;
                // IE6 do not support "key-key" but "keyKey"
                var re = /(\-([a-z]){1})/g;
                if (prop == 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            }
            return oStyle;
        }
    }

    /**
     * requestAnimationFrame, cancelAnimationFrame
     */
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = (
            window[vp + 'CancelAnimationFrame']
            ||
            window[vp + 'CancelRequestAnimationFrame']
        );
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function (callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () {
                if (typeof callback === 'function') {
                    callback(lastTime = nextTime);
                }
            }, nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }

})(window, document);

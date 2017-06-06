define([], function () {

    var exports = {};

    /**
     * 阻止冒泡
     * @param  {Event} e 事件对象
     * @return {boolean} false
     */
    exports.stopBubble = function (e) {
        e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
        return false;
    };

    exports.each = function (obj, callback) {
        if (!obj || typeof callback !== 'function') {
            return;
        }
        // local variable cache
        var hasOwn = Object.prototype.hasOwnProperty;
        for (var i in obj) {
            if (hasOwn.call(obj, i) && callback(obj[i], i) === false) {
                break;
            }
        }
    };

    exports.getUniqueId = (function () {
        var i = 1;
        return function () {
            return (i++);
        };
    })();

    exports.ucfirst = function (str) {
        if (!str) {
            return '';
        }
        return str.charAt(0).toUpperCase() + str.substr(1);
    };

    /**
     * 模拟触发事件
     *
     * @param      {HtmlElement}  elem
     * @param      {String}  eventName  The event name
     */
    exports.trigger = function (elem, eventName) {
        if (document.createEvent) {
            var e = new Event(eventName);
            return elem.dispatchEvent(e);
        } else {
            return elem.fireEvent("on" + eventName);
        }
    };

    exports.getIEVersion = function () {
        if (window.VBArray) {
            var mode = document.documentMode
            return mode ? mode : window.XMLHttpRequest ? 7 : 6;
        } else {
            return NaN;
        }
    };

    var docHead = document.head || document.getElementsByTagName('head')[0];

    /**
     * 加载css文件
     *
     * @param      {string}    href      The href
     * @param      {Function}  callback  The callback
     */
    exports.loadCSS = function (href, succ, fail) {
        var node = document.createElement('link');
        node.setAttribute('rel', 'stylesheet');
        node.setAttribute('type', 'text/css');
        node.setAttribute('href', href);
        node.onerror = callFail;
        document.body.appendChild(node);

        succ = succ || function () {};
        fail = fail || function () {};

        function callSucc() {
            if (loopTimer) {
                clearTimeout(loopTimer);
            }
            succ(node);
        }

        function callFail() {
            if (loopTimer) {
                clearTimeout(loopTimer);
            }
            fail(node);
            document.body.removeChild(node);
        }

        if (node.attachEvent) {
            node.attachEvent('onload', function () {
                if (!node.styleSheet) {
                    return callFail();
                }
                if (!node.styleSheet.rules || !node.styleSheet.rules.length) {
                    return callFail();
                }
                callSucc();
            });
            return node;
        }

        var loopTimer;
        var loopInterval = 150;

        function poll() {
            if (!node.sheet) {
                loopTimer = setTimeout(poll, 50);
                return;
            }
            try {
                var rules = node.sheet.cssRules || node.sheet.rules;
            } catch (e) {
                // console.log(e);
                var message = (e.message || '').toLowerCase();
                if (message.indexOf('security') >= 0 || message.indexOf('insecure') >= 0) {
                    callSucc();
                } else {
                    loopInterval += 100;
                    loopTimer = setTimeout(poll, loopInterval);
                }
                return;
            }

            if (!rules || rules.length ===0) {
                return callFail();
            } else {
                return callSucc();
            }
        }

        loopTimer = setTimeout(poll, 10);

        return node;
    };

    /**
     * html不允许滚动
     */
    exports.setHtmlScroll = function (b) {
        var docE = document.documentElement || document.body;
        docE.style.overflow = b ? 'visible' : 'hidden';
    };

    return exports;
});
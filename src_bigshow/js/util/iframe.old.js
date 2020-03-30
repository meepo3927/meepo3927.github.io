/**
 * @描述  Iframe通信工具
 * @用法  IframeUtil.send(event, data) event:事件名称, data:参数
 *        IframeUtil.on(event, func)  event:监听的事件名称, func:回调函数
 *        IframeUtil.off(event, func) event:取消监听的事件名称, func:回调函数
 *        IframeUtil.auto()
 */

(function (factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        factory();
    }
}(function () {
    "use strict";
    var supportPostMessage = 'postMessage' in window;
    var bind = (function () {
        var f1 = function (node, eventName, func) {
            node = typeof(node) === 'string' ? document.getElementById(node) : node;
            return node.attachEvent('on' + eventName, func);
        };
        var f2 = function (node, eventName, func) {
            node = typeof(node) === 'string' ? document.getElementById(node) : node;
            return node.addEventListener(eventName, func, false);
        };
        return document.attachEvent ? f1 : f2;
    })();
    var log = function (a) {
        if (window.console && window.console.log) {
            var len = arguments.length;
            for (var i = 0; i < len; i++) {
                window.console.log(arguments[i]);
            }
        }
    };
    var UPDATE_HEIGHT_EVENT = '__updateHeight';
    var callbackStack = {};
    var callback = function (e) {
        if (typeof e.data === 'object') {
            var json = e.data;
        } else {
            try {
                json = JSON.parse(e.data);
            } catch(e) {
                json = e.data;
            }
        }
        if (!json) {
            return false;
        }
        var event = json.event;
        var stack = callbackStack[event] || [];
        var result = [];
        for (var i = 0; i < stack.length; i++) {
            if (stack[i]) {
                result.push(stack[i](json.data, e));
            }
        }
        return result;
    };
    var getIEVersion = function () {
        var versions = {
            objectobject: 7, //IE7-8
            objectundefined: 6, //IE6
            undefinedfunction: 0, // other modern browsers
            undefinedobject: 0
        };
        return document.documentMode || versions[typeof document.all + typeof XMLHttpRequest];
    };
    var getStyle = function (elem, name) {
        if (window.getComputedStyle) {
            var style = window.getComputedStyle(elem, null);
            return style[name] || null;
        } else if (elem.currentStyle) {
            return elem.currentStyle[name] || null;
        }
    };
    var getStylePixel = function (elem, name) {
        var val = getStyle(elem, name);
        if (val) {
            return parseFloat(val) || 0;
        }
        return 0;
    };
    var getHtmlInnerPadding = function () {
        // body offsetHeight: border + padding + contentHeight
        // body scrollHeight: padding + contentHeight
        var html = document.documentElement;
        var body = document.body;
        var p = ['margin', 'padding', 'border']
        var d = ['Top', 'Bottom'];
        var total = 0;
        for (var i = 0; i < p.length; i++) {
            var property = p[i];
            for (var j = 0; j < d.length; j++) {
                var name = property + d[j];
                if (property === 'border') {
                    name += 'Width';
                }
                var val1 = getStylePixel(html, name);
                var val2 = getStylePixel(body, name);
                total += val1;
                if (property === 'padding') {
                } else {
                    total += val2;
                }
            }
        }
        return total;
    };
    // IE8-IE10，body的paddingBottom是0，
    // 内部不能准确计算，最后一个元素的marginBottom不会被计算在内
    var fixBodyBottomZero = function () {
        var val = getStylePixel(document.body, 'paddingBottom');
        if (val <= 0.1) {
            document.body.style.paddingBottom = '1px';
        }
    };
    var exports = {};
    exports.send = function (event, data, target) {
        LOG('[IframeUtilSend]' + event, data);
        return exports._send({
            event: event,
            data: data
        }, target);
    };
    exports.fire = exports.send;
    exports.on = function (event, callback) {
        if (!event || !callback) {
            return;
        }
        callbackStack[event] = callbackStack[event] || [];
        var stack = callbackStack[event];
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] === callback) {
                return;
            }
        }
        stack.push(callback);
        return stack;
    };
    exports.off = function (event, callback) {
        if (!event || !callback) {
            return;
        }
        var stack = callbackStack[event];
        if (!stack) {
            return;
        }
        if (callback === undefined) {
            stack.length = 0;
            return stack;
        }
        for (var i = stack.length - 1; i >= 0; i--) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
            }
        }
        return stack;
    };
    var docBody = document.body;
    var docElem = document.documentElement;
    exports.auto = function () {
        var id = setInterval(exports.sendMyHeight, 400);
        return function () {
            if (id) {
                clearInterval(id);
                id = null;
            }
        };
    };
    exports.getMyHeight = function () {
        var IE = getIEVersion();
        var result = {};
        if (IE === 0 || IE >= 11) {
            // 高级浏览器，使用document.documentElement.offsetHeight
            // scrollHeight Chrome和Firefox存在差异
            var htmlMarginTop = getStylePixel(docElem, 'marginTop');
            var htmlMarginBottom = getStylePixel(docElem, 'marginBottom');
            result.height = docElem.offsetHeight + htmlMarginBottom + htmlMarginTop;
            return result;
        }

        if (IE >= 8) {
            fixBodyBottomZero();
            // 这两个高度相等，说明内容高度小于当前iframe高度，需要从body中获取
            var htmlHeightEqual = docElem.offsetHeight === docElem.scrollHeight;
            var htmlBodyNear = (docElem.offsetHeight - docBody.scrollHeight) <= 2;
            if (htmlHeightEqual && htmlBodyNear) {
                result.height = (IE > 8) ? docElem.scrollHeight : (docElem.scrollHeight);
            } else {
                var innerHeight = docBody.scrollHeight;
                var htmlInnerPadding = getHtmlInnerPadding();
                result.height = innerHeight + htmlInnerPadding;
            }
        }
        return result;
    };
    exports.sendMyHeight = function (p) {
        exports.send(UPDATE_HEIGHT_EVENT, p || exports.getMyHeight());
    };
    var updateFrames = function (target, iframes, height) {
        if (!target || !iframes) {
            return false;
        }
        var IE = getIEVersion();
        for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i];
            if (IE <= 8 && iframe.getAttribute('frameborder') == '1') {
                height += 4;
            }
            if (iframe.contentWindow === target) {
                iframe.style.height = height + 'px';
                return true;
            }
        }
        return false;
    };
    var updateHeight = function (height, e) {
        var iframes = document.getElementsByTagName('iframe');
        var h = height;
        if (updateFrames(e.source, iframes, h)) {
            return true;
        }
        var frames = document.getElementsByTagName('frame');
        return updateFrames(e.source, frames, h);
    };
    exports._send = function (data, target) {
        if (!target) {
            if (window.parent !== window) {
                target = window.parent;
            } else if (window.frames.length) {
                target = window.frames[0];
            }
        }
        try {
            if (target.contentWindow && target.contentWindow.postMessage) {
                target = target.contentWindow;
            }
        } catch(e) {
        }

        // 不能给自己发送消息
        if (target === window.self) {
            return false;
        }
        if (target && target.postMessage) {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            return target.postMessage(data, '*');
        } else {
            log('[send] There is not postMessage method in target:');
            log(target);
            return false;
        }
    };
    bind(window, 'message', callback);
    exports.on(UPDATE_HEIGHT_EVENT, function (info ,e) {
        if (updateHeight(info.height, e)) {
            return true;
        }
    });
    window.IframeUtil = exports;
    return exports;
}));
/**
 * @描述  iframe通信工具
 * @用法:
 * iframeUtil.on(event, func) event:监听的事件名称, func:回调函数
 * iframeUtil.off(event, func) event:取消监听的事件名称, func:回调函数
 * iframeUtil.send(event, data, target) event:事件名称, data:参数, target:目标iframe
 * iframeUtil.fire 同 send
 */
(function (factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        factory();
    }
}(function () {
    "use strict";
    /**
     * 事件绑定
     */
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
    /**
     * 打印日志
     */
    var log = function () {
        if (window.console && window.console.log) {
            var len = arguments.length;
            for (var i = 0; i < len; i++) {
                window.console.log(arguments[i]);
            }
        }
    };
    var callbackStack = {};
    /**
     * window.onmessage 回调
     */
    var onMessage = function (e) {
        var imm = 'setImmediate';
        // 过滤掉setImmediate Message
        if (e.target === window && (typeof e.data === 'string')
            && e.data.substr(0, imm.length) === imm) {
            return;
        }
        if (typeof e.data === 'object') {
            var json = e.data;
        } else {
            try {
                json = JSON.parse(e.data);
            } catch(err) {
                log('[iframeUtil onMessage] JSON.parse error', e, err);
                return false;
            }
        }
        if (!json) {
            log('[iframeUtil onMessage] e.data null:', e);
            return false;
        }
        var event = json.event;
        var stack = callbackStack[event] || [];
        // 依次执行stack中的方法
        for (var i = 0; i < stack.length; i++) {
            if (stack[i]) {
                stack[i](json.data, e);
            }
        }
    };
    var exports = {};
    exports.send = function (event, data, target) {
        if (!target) {
            if (window.parent !== window) { // 发给父级
                target = window.parent;
            } else if (window.frames.length) { // 发给第一个子窗体
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
            var o = {
                event: event,
                data: data
            };
            return target.postMessage(JSON.stringify(o), '*');
        } else {
            log('[iframeUtil.Send] There is not postMessage method in target:', target);
            return false;
        }
    };
    exports.fire = exports.send;
    exports.on = function (event, callback) {
        if (!event || !callback) {
            return false;
        }
        if (!callbackStack[event]) {
            callbackStack[event] = [callback];
            return callbackStack[event];
        }
        var stack = callbackStack[event];
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] === callback) { // 不重复push
                return stack;
            }
        }
        stack.push(callback);
        return stack;
    };
    exports.off = function (event, callback) {
        var stack = callbackStack[event];
        if (!stack) {
            return false;
        }
        if (callback === undefined) { // 解除所有
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

    bind(window, 'message', onMessage);
    window.iframeUtil = exports;
    return exports;
}));
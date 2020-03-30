/**
 * @描述  轻量级自定义事件bus
 * @用法  var ebus = new EventBus();
 *        ebus.bind('click', func);
 *        ebus.on === ebus.bind
 *        ebus.unbind('click', func);
 *        ebus.unbind('click')
 *        ebus.off === ebus.unbind
 *        ebus.trigger('click', [args]);
 *        ebus.fire  === ebus.trigger
 */

(function (name, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        window[name] = factory();
    }
}('EventBus', function () {
    "use strict";
    var exports = function (options) {
        this.options = options || {};
        this.stack = {};
    };
    var proto = exports.prototype;
    proto.fire = proto.trigger = function (name, args, env) {
        var stack = this.stack[name];
        if (!stack) {
            return;
        }
        env = env || this.options.env || null;
        for (var i = stack.length - 1; i >= 0; i--) {
            var func = stack[i];
            if (!func) {
                continue;
            }
            func.apply(env, args);
            if (func.__eventbus_once) {
                stack.splice(i, 1);
            }
        }
    };

    proto.bind = proto.on = function (name, func) {
        if (!this.stack[name]) {
            this.stack[name] = [];
        }
        if (!func) {
            return;
        }
        var stack = this.stack[name];
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] === func) {
                return;
            }
        }
        stack.push(func);
    };
    proto.once = function (name, func) {
        func.__eventbus_once = true;
        this.on(name, func);
    };
    proto.unbind = proto.off = function (name, func) {
        if (!this.stack[name]) {
            return;
        }
        if (!func) {
            this.stack[name] = [];
            return;
        }
        var stack = this.stack[name];
        for (var i = stack.length - 1; i >= 0; i--) {
            if (stack[i] === func) {
                stack.splice(i, 1);
            }
        }
    };
    let holders = {};
    exports.get = (name) => {
        if (!holders[name]) {
            holders[name] = new exports();
        }
        return holders[name];
    };

    return exports;
}));
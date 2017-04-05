/**
 * @描述  轻量级Promise
 * @用法:
 * var p = new Promise(function (resolve, reject) {
 *     
 * });
 */

(function (name, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        window[name] = factory();
    }
}('Promise', function () {
    "use strict";
    function Promise(fn) {
        var state = 'pending';
        var value = null;
        var queue = [];

        var handle = function (deferred) {
            if (state === 'pending') {
                queue.push(deferred);
                return;
            }

            var cb = state === 'fulfilled'
                ? deferred.onFulfilled
                : deferred.onRejected;
            if (!cb) {
                cb = state === 'fulfilled'
                    ? deferred.resolve
                    : deferred.reject;
                cb(value);
                return;
            }
            deferred.resolve(cb(value));
        };

        var resolve = function (newValue) {
            if (newValue && 
                (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (typeof then === 'function') {
                    then.call(newValue, resolve, reject);
                    return;
                }
            }
            state = 'fulfilled';
            value = newValue;
            finale();
        };

        var reject = function (reason) {
            state = 'rejected';
            value = reason;
            finale();
        };

        var finale = function () {
            setTimeout(function () {
                for (var i = 0, len = queue.length; i < len; i++) {
                    if (queue[i]) {
                        handle(queue[i]);
                    }
                }
            }, 0);
        };

        this.then = function (onFulfilled, onRejected) {
            return new Promise(function (resolve, reject) {
                handle({
                    onFulfilled: onFulfilled,
                    onRejected: onRejected,
                    resolve: resolve,
                    reject: reject
                });
            });
        };

        fn(resolve, reject);
    }

    return Promise;
}));
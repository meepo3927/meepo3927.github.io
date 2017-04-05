/**
 * @描述  轻量级XXX
 * @用法  balabala
 */

(function (name, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        window[name] = factory();
    }
}('Module', function () {
    "use strict";
    var exports = {};
    console.log('module loaded');
    exports.init = function () {
        console.log('module init');
    };
    return exports;
}));
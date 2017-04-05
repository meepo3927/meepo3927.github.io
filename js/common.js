import 'polyfill';

// 基础库
import Vue from 'vue';
import $ from 'jquery';
window.LOG = function () {
    if (window.console && window.console.log) {
        var args = Array.prototype.slice.call(arguments);
        args.forEach(function (v) {
            window.console.log(v);
        });
    }
};
export {
	Vue,
	$
};
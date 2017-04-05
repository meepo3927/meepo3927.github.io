import 'polyfill';
// 基础库
import $ from 'jquery';
import Vue from 'vue';
// Vue扩展
Vue.use(require('extend/vue.eventhandler.js'));

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
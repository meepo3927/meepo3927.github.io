import 'polyfill';
import '../less/entry.scss';
// 基础库
window.LOG = function () {
    if (window.console && window.console.log) {
        var len = arguments.length;
        for (var i = 0; i < len; i++) {
            window.console.log(arguments[i]);
        }
    }
};
window.LOGJ = (a) => {
    LOG(JSON.parse(JSON.stringify(a)));
};
// Vue库
import Vuex from 'vuex';
import VueCommon from 'extend/vue.common.js';
Vue.use(Vuex);
Vue.use(VueCommon);
// 组件

export default {
    Vuex
}
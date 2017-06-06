// 基础库
import 'lib/ie8';
import config from 'global/config';
import Vue from 'vue';
import $ from 'jquery';
// jquery 扩展
import 'velocity';
// vue 扩展
import centerlayer from 'comp/center-layer.vue';
import chosen from 'comp/chosen.vue';
import Vuex from 'vuex';
import 'extend/vue.marquee.js';
import layout from 'comp/common/page-layout.vue';

Vue.use(Vuex);
// Reg Vue Component
Vue.component('center-layer', centerlayer);
Vue.component('vue-chosen', chosen);
Vue.component('page-layout', layout);
Vue.use(require('extend/vue.eventhandler.js'));
let global = window.global || {};
let basePath = global.basePath || '';
let staticPath = global.staticPath || (basePath);
let imgPath = staticPath + '/images';
let urlExt = config.dev ? 'html' : 'jsp';
let methods = {};
methods.getStaticUrl = function (path, param = '') {
    let url = this.staticPath + '/views' + path + '.' + urlExt;
    if (param) {
        url += '?' + param;
    }
    return url;
};
Vue.mixin({
    methods,
    computed: {
        vImgPath: function () {
            return imgPath;
        },
        basePath: function () {
            return basePath;
        },
        staticPath: function () {
            return staticPath;
        }
    }
});
// Hack For mlayer
window.xPath = staticPath + '/';
var mlayer = require('lib/mlayer');
// Global Injection
window.$ = $;
if (config.dev) {
    __webpack_public_path__ = './dist/';
}
// Hack IE
let IE = window.getIEVersion();
// Hack Echarts
if (IE === 10 || IE === 11) {
    window.Float32Array = undefined;
}
import request from 'util/request';
export {
    Vue,
    config,
    $,
    mlayer,
    request
};
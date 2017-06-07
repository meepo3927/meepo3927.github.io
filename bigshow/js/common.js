// 基础库
import 'lib/ie8';
import config from 'global/config';
import Vue from 'vue';
import $ from 'jquery';
// vue 扩展
import 'extend/vue.marquee.js';

// Reg Vue Component

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
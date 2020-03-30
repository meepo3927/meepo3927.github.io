var path = require('path');

var JS_DIR = path.resolve(__dirname, '../js');
var DIST_PATH = path.resolve(__dirname, '../dist');
var SERVER_DIR = path.resolve(__dirname, '..');
// var DIST_PATH = path.resolve(__dirname, '../../webapp/bigdata/dist');
// var SERVER_DIR = path.resolve(__dirname, '../../webapp/bigdata/');
var productionPublicPath = './dist/';
var SERVER_PORT = 8024;
var alias = {
    // 目录
    lib: JS_DIR + '/lib',
    util: JS_DIR + '/util',
    comp: JS_DIR + '/comp',
    extend: JS_DIR + '/extend',
    global: JS_DIR + '/global',
    pages: JS_DIR + '/pages',
    mixins: JS_DIR + '/mixins',
    // 基础库
    jquery$: 'lib/jquery-2.1.1.min.js',
    vue$: 'lib/vue.min.js',
    vuex$: 'lib/vuex-2.3.1.js',
    vuerouter$: 'lib/vue-router.js',
    lodash$: 'lib/lodash.min.js',
    // 工具,插件
    promise$: 'lib/promise.js',
    // echarts$: 'lib/echarts-3.5.3.min.js',
    echarts$: 'lib/echarts-4.0.2.min.js',
    // 通用
    polyfill$: JS_DIR + '/global/polyfill',
    request$: JS_DIR + '/util/request.js',
    config$: JS_DIR + '/global/config.js',
    tool$: JS_DIR + '/util/tool.js',
    root$: JS_DIR + '/root.js',
    vendorless$: JS_DIR + '/vendorless.js'
};

module.exports = {
    alias,
    provide: {
        '$': 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery',
        'Vue': 'vue',
        'Tool': 'tool',
        'Request': 'request',
        'Config': 'config',
        'URL': 'util/url.js',
        '_': 'lodash'
    },
    productionPublicPath,
    developmentPublicPath: '/dist/',
    JS_DIR,
    DIST_PATH,
    SERVER_PORT,
    SERVER_DIR,
    VERSION: 4
};
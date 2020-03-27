var path = require('path');

var JS_DIR = path.resolve(__dirname, '../js');
var DIST_PATH = path.resolve(__dirname, '../dist');
var SERVER_DIR = path.resolve(__dirname, '../');
var productionPublicPath = './dist/';
var SERVER_PORT = 8900;
var alias = {
    // 目录
    lib: JS_DIR + '/lib',
    util: JS_DIR + '/util',
    comp: JS_DIR + '/comp',
    extend: JS_DIR + '/extend',
    global: JS_DIR + '/global',
    pages: JS_DIR + '/pages',
    mixins: JS_DIR + '/mixins',
    store: JS_DIR + '/store',
    // 基础库
    jquery$: 'lib/jquery-2.1.1.min.js',
    vue$: 'lib/vue.min.js',
    bootstrap$: 'lib/bootstrap.min.js',
    select2$: 'lib/select2.min',
    html2canvas: 'lib/html2canvas.js',
    vuex$: 'lib/vuex-2.3.1.js',
    vuerouter$: 'lib/vue-router.js',
    ztree$: 'lib/jquery.ztree.core.min.js',
    // 扩展
    mVali$: 'extend/jquery.mvali',
    autoComplete$: 'extend/jquery.autocomplete',
    // 工具,插件
    mlayer$: 'lib/mlayer.js',
    velocity$: 'lib/velocity.min',
    ajax$: 'util/ajax',
    promise$: 'lib/promise',
    tool$: 'util/tool',
    eventBus$: 'util/event_bus',
    json$: 'util/json',
    request$: 'util/request',
    store$: 'util/store',
    iframeUtil$: 'util/iframe.js',
    slimscroll$: 'lib/jquery.slimscroll.min.js',
    //echarts$: 'lib/echarts-4.0.2.min.js',
    echarts$: 'lib/echarts-4.0.4.min.js',
    // 通用
    request$: JS_DIR + '/util/request.js',
    config$: JS_DIR + '/global/config.js',
    tool$: JS_DIR + '/util/tool.js',
    polyfill$: 'global/polyfill',
    common$: JS_DIR + '/root.js',
    dll_less$: JS_DIR + '/dll_less.js'
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
        'Config': 'config'
    },
    productionPublicPath,
    developmentPublicPath: '/dist/',
    JS_DIR,
    DIST_PATH,
    SERVER_PORT,
    SERVER_DIR,
    VERSION: 2
};
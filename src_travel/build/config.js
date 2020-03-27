var path = require('path');

var JS_DIR = path.resolve(__dirname, '../js');
var DIST_PATH = path.resolve(__dirname, '../dist');
var SERVER_PORT = 8899;
var SERVER_DIR = path.resolve(__dirname, '../');
var productionPublicPath = './';

var alias = {
    // 目录
    lib: JS_DIR + '/lib',
    util: JS_DIR + '/util',
    comp: JS_DIR + '/comp',
    extend: JS_DIR + '/extend',
    global: JS_DIR + '/global',
    store: JS_DIR + '/store',
    mixins: JS_DIR + '/mixins',
    pages: JS_DIR + '/pages',

    // 基础库
    jquery$: 'lib/jquery-2.1.1.min.js',
    vue$: 'lib/vue.min.js',
    vuex$: 'lib/vuex-2.3.1.js',
    // vue$: 'lib/vue.js',
    velocity$: 'lib/velocity.min.js',
    mVali$: 'extend/jquery.mvali.js',
    // 工具,插件
    Promise$: 'lib/promise.js',
    promise$: 'lib/promise.js',
    mlayer$: 'lib/mlayer.js',
    autoComplete$: 'extend/jquery.autocomplete.js',
    echarts$: 'lib/echarts-3.8.5.min.js',
    //echarts$: 'lib/echarts-4.0.2.min.js',
    ztree$: 'lib/jquery.ztree.all.min.js',
    slimScroll$: 'lib/jquery.slimscroll.min.js',
    html2canvas$: 'lib/html2canvas.js',
    jspdf$: 'lib/jspdf.min.js',
    jeDate$: 'lib/jquery.jedate.min.js',
    select2$: 'lib/select2.min.js',
    // 通用
    polyfill$: 'global/polyfill.js',
    request$: JS_DIR + '/util/request.js',
    tool$: JS_DIR + '/util/tool.js',
    config$: 'global/config.js',
    root$: JS_DIR + '/root.js',
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
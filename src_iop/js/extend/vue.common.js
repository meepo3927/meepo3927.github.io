var config = require('config');
var iframeUtil = require('iframeUtil');
var $ = require('jquery');
var EventBus = require('util/event_bus.js');
var request = require('util/request.js');
var tool = require('util/tool.js');

var Plugin = {};
Plugin.install = function (Vue, options) {
    let methods = {};
    methods.pageBack = function () {
        history.back();
    };
    methods.delayCall = function (fn, time = 300, args = []) {
        let self = this;
        return setTimeout(() => {
            fn.apply(self, args);
        }, time);
    };
    methods.getStaticUrl = function (path, param = '') {
        let url = config.basePath + '/views' + path + '.' + config.pageUrlExt;
        if (param) {
            url += '?' + param;
        }
        return url;
    };
    methods.innerJump = function (item) {
        if (typeof item === 'string') {
            var url = item;
        } else if (item && item.moduleUrl) {
            url = item.moduleUrl;
        } else {
            return;
        }
        location.href = url;
        Vue.$noticeAnchorClick(url);
    };
    methods.getImageUrl = function (filePath) {
        return this.vImgPath + filePath
    };
    methods.$HACK_VUE_ROUTER_IE = function () {
        const versions = {
            objectobject: 7, //IE7-8
            objectundefined: 6, //IE6
            undefinedfunction: NaN, // other modern browsers
            undefinedobject: NaN
        };
        const IE = document.documentMode || versions[typeof document.all + typeof XMLHttpRequest];
        if (IE) {
            window.addEventListener('hashchange', () => {
                if (!this.$route || !this.$router) { // NO VueRouter
                    return;
                }
                var currentPath = window.location.hash.slice(1);
                if (this.$route.path !== currentPath) {
                    this.$router.push(currentPath);
                }
            }, false);
        }
    };
    Vue.getEntryUrl = (path) => {
        const hash = path ? ('#' + path) : '';
        return './entry.html' + hash;
    };
    Vue.$noticeAnchorClick = (url) => {
        // 无效的URL
        if (!url || (url === '#')
            || (url.substr(0, 10).toLowerCase() === 'javascript')) {
            return;
        }
        iframeUtil.send('vAnchorClick', url, window.parent);
    };
    Vue.$noticeWhenAnchorClick = () => {
        $(document.body).on('click', 'a', function (e) {
            const aElem = this; // <a>元素
            // aElem.href是解析过的完整链接
            // aElem.getAttribute('href')为原始链接
            const url = aElem.getAttribute('href');
            Vue.$noticeAnchorClick(url);
        });
    };
    Vue.$newComponent = (component, data, el) => {
        const Constructor = Vue.extend(component);
        const instance = new Constructor({
            data
        });
        if (el && el !== document.body) {
            instance.$mount(el);
        } else {
            document.body.appendChild(instance.$mount().$el);
        }
        return instance;
    };
    Vue.$disposeComponent = (instance) => {
        const $el = instance.$el;
        if ($el.parentNode) {
            $el.parentNode.removeChild($el);
        }
        instance.$destroy(true);
        return instance;
    };
    let computed = {};
    computed.vImgPath = function () {
        return config.imgPath;
    };
    computed.vConfig = function () {
        return config;
    };
    let bus = new EventBus();
    computed.vEventBus = function () {
        return bus;
    };
    computed.vRequest = function () {
        return request;
    };
    computed.vTool = function () {
        return tool;
    };
    const mounted = function () {
    };
    Vue.mixin({
        mounted,
        methods,
        computed
    });
};

module.exports = Plugin;
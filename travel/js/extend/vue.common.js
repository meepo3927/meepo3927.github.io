const EventBus = require('util/event_bus.js');
const config = require('config');
const basePath = config.basePath;
const staticPath = config.staticPath;
const imgPath = config.imgPath;
const urlExt = config.dev ? '.html' : '';
const Plugin = {};
const ebus = new EventBus();
Plugin.install = function (Vue, options) {
    let methods = {};
    methods.getStaticUrl = function (path, param = '') {
        let url = staticPath + '/views' + path + urlExt;
        if (param) {
            url += '?' + param;
        }
        return url;
    };
    methods.getExternalUrl = function (path) {
        return basePath + path + urlExt;
    };
    let computed = {
        vImgPath: function () {
            return imgPath;
        },
        basePath: function () {
            return basePath;
        },
        staticPath: function () {
            return staticPath;
        },
        vConfig: function () {
            return config;
        },
        vlogoutUrl: function () {
            return basePath + '/logout';
        },
        vBus: function () {
            return ebus;
        }
    };
    
    const mounted = function () {
    };
    Vue.mixin({
        mounted,
        methods,
        computed
    });
};

// Hack For mlayer
window.xPath = staticPath + '/';

module.exports = Plugin;
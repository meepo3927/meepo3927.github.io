var config = require('config');
var request = require('util/request.js');

var Plugin = {};
var localEnv = !(location.host);
Plugin.install = function (Vue, options) {
    let methods = {};
    methods.getPageUrl = function (path, param = '') {
        if (path.charAt(0) === '/') {
            return '.' + path + '.html' + param;
        } else {
            return './' + path + '.html' + param;
        }
    };
    methods.getImageUrl = function (path) {
        return this.vImgPath + path;
    };
    methods.transferHeatMapData = function (data) {
        return data.map((v) => ({
            lng: v.jLongitude,
            lat: v.wLatitude,
            count: v.totalNum
        }));
    };
    let computed = {};
    computed.vImgPath = function () {
        return './images';
    };
    computed.vConfig = function () {
        return config;
    };
    computed.vRequest = function () {
        return request;
    };
    computed.vSpace = function () {
        return '　';
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
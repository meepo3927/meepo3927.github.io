/**
 * @描述  MAP相关工具
 * @用法  略
 */

(function (name, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        window[name] = factory();
    }
}('MapUtil', function () {
    "use strict";
    var exports = {};

    function getRandomDelta(ratio) {
        ratio = ratio || 500;
        var r = Math.floor(Math.random() * 9999999) % ratio + 10;
        r /= 10000;
        if (Math.random() > .64) {
            r *= -1;
        }
        return r;
    }

    /**
     * 生成随机经纬度
     * @param  {Point} p  中心点
     * @return {Object} lng, lat
     */
    exports.getRandPoint = function (p, options) {
        options = options || {};
        var radius = options.radius || 400;
        return {
            lng: p.lng + getRandomDelta(radius) * 2,
            lat: p.lat + getRandomDelta(radius)
        };
    };

    /**
     * 批量生成随机经纬度
     * @param  {Point}  p    经纬度
     * @param  {number} num  数量
     * @return {Array}
     */
    exports.getRandPointBatch = function (p, num, options) {
        num = num || 20;
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr.push(exports.getRandPoint(p, options));
        }
        return arr;
    };
    return exports;
}));
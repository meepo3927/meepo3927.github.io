const context = require('global/tomap/context.js');
const LR = require('global/tomap/LR.js');
const nmCenterPoint = context.pro.lngLatToPoint({
    lng: 113.365, lat: 43.463081
});
const CITY_POSITION_MAP = {
    '阿拉善':   {lng: 102.657773, lat: 40.583039},
    '巴彦淖尔': {lng: 107.551454, lat: 41.695696},
    '乌海':     {lng: 106.831229, lat: 39.679471},
    '鄂尔多斯': {lng: 108.434524, lat: 39.136903},
    '包头':     {lng: 110.200665, lat: 41.943419},
    '呼和浩特': {lng: 111.562065, lat: 40.526907},
    '乌兰察布': {lng: 113.143802, lat: 41.001969},
    '锡林郭勒': {lng: 116.0878, lat:43.943579},
    '赤峰':     {lng: 118.737011, lat: 43.005718},
    '通辽':     {lng: 122.247302, lat: 43.646958},
    '兴安盟':   {lng: 120.981481, lat: 46.542367},
    '呼伦贝尔': {lng: 121.717373, lat: 49.646924}
};
const created = function () {
    this.LR_Q1 = [];
    this.LR_Q2 = [];
    this.LR_Q3 = [];
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};


let methods = {};
methods.lrStart = function (data) {
    let i = this.lrArrowIndex;
    if (!data[i]) {
        i = this.lrArrowIndex = 0;
    }
    const delay = 2000;
    const loopInterval = 5500;
    // 大箭头
    this.lrHomeBigArrow(i);
    this.lrSmallTimer = setTimeout(() => {
        // 小箭头
        this.lrHomeSmallArrow(data[i].transData);
        // 再一次
        this.lrTimer = setTimeout(() => {
            this.lrArrowIndex++;
            this.lrStart(data);
        }, loopInterval);
    }, delay);
};
methods.lrHomeBigArrow = function (index) {
    const MAP = {
        //0: {lng: 140.372232, lat: 52.226773},
        0: {lng: 130.253718, lat: 49.742399},
        1: {lng: 130.253718, lat: 45.117217},
        2: {lng: 129.411956, lat: 40.1721}
    };
    let lnglat = MAP[index] || MAP[0];
    let eStartPoint = context.pro.lngLatToPoint(lnglat);
    let lay = new LR.jttv1(nmCenterPoint, eStartPoint, 0);
    this.map.addOverlay(lay);
    this.LR_Q1.push(lay);
};
methods.lrHomeSmallArrow = function (data) {
    const request = this.vRequest;
    let centerPoint = this.nmCenterPoint;
    data.forEach((item, i) => {
        let cityName = request.getNameCityById(item.cityId);
        let lnglat = CITY_POSITION_MAP[cityName];
        if (!lnglat) {
            return;
        }
        let cityPoint = context.pro.lngLatToPoint(lnglat);
        let num = item.percent;
        let lay = new LR.jttv3(cityPoint, centerPoint, "cc", num, 1.5, context.getColor(i));
        this.map.addOverlay(lay);
        this.LR_Q2.push(lay);
    });
};
methods.lrCleanArrow = function () {
    clearTimeout(this.lrSmallTimer);
    clearTimeout(this.lrTimer);
    this.LR_Q1.forEach((overlay) => {
        this.map.removeOverlay(overlay);
    });
    this.LR_Q1.length = 0;
    this.LR_Q2.forEach((overlay) => {
        this.map.removeOverlay(overlay);
    });
    this.LR_Q2.length = 0;
};
methods.lrDraw = function () {
    this.LR_Q1.forEach((item) => {
        item.draw();
    });
    this.LR_Q2.forEach((item) => {
        item.draw();
    });
    this.LR_Q3.forEach((item) => {
        item.draw();
    });
};
let computed = {};
computed.nmCenterPoint = function () {
    return nmCenterPoint;
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            lrArrowIndex: 0
        };
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {}
};
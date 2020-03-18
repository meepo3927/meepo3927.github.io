const Store = require('global/store.js');
const CanvasOverlay = require('global/tomap/canvas.js');
const Context = require('global/tomap/context.js');
// 海亮 111.677982,40.82096
// 万达 111.740163,40.842289

const STEP_PREV_MAP = {};
const STEP_NEXT_MAP = {};
const created = function () {
    this.canvasQ = [];
    this.poiQ = [];
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    this.stageClean();
};
const parseStep = (str) => {
    let match = str.match(/\d+/);
    if (!match) {
        return;
    }
    let num = parseInt(match[0], 10);
    let prefix = str.substr(0, match.index);
    return {
        prefix, num
    };
};

let methods = {};
// 回到首页
methods.stageBackHome = function () {
    this.setStep('home');
    this.map.setHomeView();
    this.map.drawBorders();
    setTimeout(() => {
        this.map.reset();
        this.startAnim();
    }, 100);
};
methods.stageCleanHome = function () {
    this.stopAnim();
    this.map.removeBorders();
};
methods.stageEnterCity = function () {
    this.map.setCityView();
};
// 清除stage
methods.stageClean = function () {
    this.cleanPromise();
    this.canvasQ.forEach((item) => {
        item.dispose();
        this.mapInstance.removeOverlay(item);
    });
    this.canvasQ.length = 0;
    this.poiQ.forEach((item) => {
        this.mapInstance.removeOverlay(item);
    });
    this.poiQ.length = 0;
};
// 设置step
methods.setStep = function (v) {
    //LOG('setStep:' + v);
    let leaveName = 'stageLeave' + this.step;
    if (this[leaveName]) {
        this[leaveName]();
    }
    this.step = v;
    let enterName = 'stageEnter' + v;
    if (this[enterName]) {
        this[enterName]();
    }
};
methods.prevStep = function () {
    let o = parseStep(this.step);
    if (o) {
        let n = o.num - 1;
        let newStep = o.prefix + n;
        if (STEP_PREV_MAP[newStep]) {
            this.setStep(STEP_PREV_MAP[newStep]);
        } else {
            this.setStep(newStep);
        }
    }
};
methods.nextStep = function () {
    let o = parseStep(this.step);
    if (o) {
        let n = o.num + 1;
        let newStep = o.prefix + n;
        if (STEP_NEXT_MAP[newStep]) {
            this.setStep(STEP_NEXT_MAP[newStep]);
        } else {
            this.setStep(newStep);
        }
    }
};
methods.addNewCanvas = function () {
    // 画布
    let canvas = new CanvasOverlay(this.mapInstance);
    this.mapInstance.addOverlay(canvas);
    this.canvasQ.push(canvas);
    return canvas;
};
methods.addPOI = function (poi) {
    if (!poi) {
        return 0;
    }
    if (Array.isArray(poi)) {
        poi.forEach((p) => {
            this.mapInstance.addOverlay(p);
            this.poiQ.push(p);
        });
        return poi.length;
    } else {
        this.mapInstance.addOverlay(poi);
        this.poiQ.push(poi);
        return 1;
    }
};
methods.getOdDataArr = function (arr) {
    var mercatorProjection = this.mapInstance.getMapType().getProjection();
    let max = 1;
    arr.forEach((item) => {
        max = Math.max(item.count, max);
    });
    let result = [];
    arr.forEach((item, i) => {
        var ct = (item.count / max) + 0.6;
        ct = Math.min(ct, 1);
        ct = (ct * 7 + 0.5) | 0;
        let f = mercatorProjection.lngLatToPoint(new BMap.Point(item.fromLng, item.fromLat));
        let t = mercatorProjection.lngLatToPoint(new BMap.Point(item.toLng, item.toLat));
        let fromLng = f.x;
        let fromLat = f.y;
        let toLng = t.x;
        let toLat = t.y;
        var ll = Math.sqrt(
            (fromLng - toLng) * (fromLng - toLng)
            +
            (fromLat - toLat) * (fromLat - toLat)
        );
        if (ll > 1000 * 100) { // 太远
            return;
        }
        let color = item.color || Context.getColorByDistance(ll);
        var point = {
            xx: (toLng - fromLng) / 100,
            yy: (toLat - fromLat) / 100,
            x: fromLng,
            y: fromLat,
            c: ct,
            image: Context.getCircle(color)
        };
        result.push(point);
    });
    return result;
};
methods.getStarDataArr = function (arr, index, colorParam) {
    let max = 1;
    arr.forEach((item) => {
        max = Math.max(item.userNum, max);
    });
    return arr.map((item, i) => {
        var count = Math.sqrt(item.userNum / max) * 4;
        let color;
        if (colorParam === undefined) {
            color = Context.getColor(i);
        } else if (typeof colorParam === 'string') {
            color = colorParam;
        } else if (typeof colorParam === 'function') {
            color = colorParam(i);
        }
        return {
            lnglat: {lng: item.lng, lat: item.lat},
            index: index,
            color: color,
            count: count,
            direction: index === 0 ? -1 : 1
        }
    });
};
let computed = {};
computed.cityId = function () {
    return Store.getters.cityId;
};
computed.commonParam = function () {
    return {
        cityId: this.cityId
    }
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            timelineVisible: false,
            timelinePaused: false,
            timelineValue: 0,
            step: ''
        };
        return o;
    },
    store: Store,
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [
        require('mixins/stage_monitor.js'),
        require('mixins/stage_credit.js'),
        require('mixins/stage_locate.js'),
        require('mixins/stage_publico.js'),
        require('mixins/request_mix.js')
    ],
    components: {}
};
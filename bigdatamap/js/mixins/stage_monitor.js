const Context = require('global/tomap/context.js');
const Stars = require('global/tomap/stars.js');
const LR = require('global/tomap/LR.js');

// 常驻人口和流动人口
const COLOR_DEFINE = ['#3A91DB', '#F26C60'];

const DISTANT_DEFINE = [
    {name: '1KM以内', color: '#00CEC9'},
    {name: '1-5KM', color: '#FDCB6E'},
    {name: '5-10KM', color: '#0984E3'},
    {name: '10KM以上', color: '#E17055'}
];

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};

// 监控 第一步
methods.stageEnterMonitor1 = function () {
    let canvas = this.addNewCanvas();
    const lngSortFunc = (a, b) => {
        return (a.lng > b.lng) ? -1 : 1
    };
    // 散点图
    let req = this.vRequest.fetch2('/monitor/peopleLocation', this.commonParam);
    this.setPromise('monitor1', req).then((data) => {
        let items1 = data[0].items.sort(lngSortFunc);
        let items2 = data[1].items.sort(lngSortFunc);
        this.cornerNav = data.map((item, i) => {
            return {name: item.peopleDesc, color: COLOR_DEFINE[i]}
        });
        let dataArr1 = this.getStarDataArr(items1, 0, COLOR_DEFINE[0]);
        let dataArr2 = this.getStarDataArr(items2, 1, COLOR_DEFINE[1]);
        let POI1 = items1.map((item) => {
            let point = {lng: item.lng, lat: item.lat};
            return new LR.POI(point, item)
        });
        let POI2 = items2.map((item) => {
            let point = {lng: item.lng, lat: item.lat};
            return new LR.POI(point, item, {visible: false})
        });
        let d1 = -1;
        let d2 = 1;
        const callback1 = (value, direction, self) => {
            if (d1 !== direction) {
                d1 = direction;
                if (d1 === -1) {
                    POI1.forEach(poi => poi.showHide(true));
                } else {
                    POI1.forEach(poi => poi.showHide(false));
                }
            }
        };
        const callback2 = (value, direction, self) => {
            if (d2 !== direction) {
                d2 = direction;
                if (d2 === 1) {
                    POI2.forEach(poi => poi.showHide(true));
                } else {
                    POI2.forEach(poi => poi.showHide(false));
                }
            }
        };
        let stars = [
            new Stars.star1(dataArr1, canvas, {callback: callback1}),
            new Stars.star1(dataArr2, canvas, {callback: callback2})
        ];
        this.addPOI(POI1);
        this.addPOI(POI2);
        // 散点，动画
        canvas.setData(stars).start({clear: true, interval: 150});
        // 左下enter
        this.cornerEnter = (item, i) => {
            stars.forEach((star) => {
                star.setDirection(i === 0 ? -1 : 1);
            });
        };

    }).catch((e) => {
        LOG(e);
    });
};
methods.stageLeaveMonitor1 = function () {
    this.cornerNav = undefined;
    this.cornerEnter = undefined;
    this.stageClean();
};
methods.stageEnterMonitor2 = function () {
    // 画布
    let canvas1 = this.addNewCanvas();
    let canvas2 = this.addNewCanvas();
    this.timelineStartCallback = () => {
        this.timelinePaused = false;
        canvas1.start();
        canvas2.start({clear: true});
    };
    this.timelinePauseCallback = () => {
        this.timelinePaused = true;
        canvas1.pause();
        canvas2.pause();
    };

    // 位置和路径
    let req = this.vRequest.fetch2('/monitor/commuteRouteLocation', this.commonParam);
    this.setPromise('commuteRouteLocation', req).then((data) => {
        let od = new Stars.OD(this.getOdDataArr(data.routes), canvas1, {});

        // 时间轴
        this.timelineVisible = true;
        let dataArr = this.getStarDataArr(data.locations, 0, 'rgba(150,248,239,0.7)');
        let star = new Stars.star1(dataArr, canvas2, {
            mode: 2,
            max: 111,
            bound: 100,
            callback: (val, direction) => {
                this.timelineValue = [val, direction];
            }
        });
        let pois = data.locations.map((v) => {
            let point = {lng: v.lng, lat: v.lat};
            return new LR.POI(point, v);
        });
        this.addPOI(pois);

        canvas1.setData([od]).start();
        canvas2.setData([star]).start({clear: true});

        this.cornerNav = DISTANT_DEFINE;
    }).catch((e) => {
        LOG(e);
    });
};
methods.stageLeaveMonitor2 = function () {
    this.timelineValue = 0;
    this.timelineVisible = false;
    this.timelinePaused = false;
    this.timelineStartCallback = undefined;
    this.timelinePauseCallback = undefined;
    this.cornerNav = undefined;
    this.stageClean();
};
methods.stageEnterMonitor3 = function () {
    // 画布
    let canvas1 = this.addNewCanvas();
    let canvas2 = this.addNewCanvas();
    // 路径
    let req1 = this.vRequest.fetch2('/monitor/sceneryRouteLocation', this.commonParam);
    this.setPromise('commuteRoute', req1).then((data) => {
        let routesData = this.getOdDataArr(data.routes);
        let od = new Stars.OD(routesData, canvas1, {});

        let locations = this.getStarDataArr(data.locations, 0, 'rgba(150,248,239,0.7)');
        let star = new Stars.star1(locations, canvas2, {
            mode: 2,
            max: 111,
            bound: 100,
            callback: (val, direction) => {}
        });
        let pois = data.locations.map((v) => {
            let point = {lng: v.lng, lat: v.lat};
            return new LR.POI(point, v);
        });
        this.addPOI(pois);
        // 开始动画
        canvas1.setData([od]).start();
        canvas2.setData([star]).start({clear: true});
        this.cornerNav = DISTANT_DEFINE;
    }).catch((e) => {
        LOG(e);
    });

};
methods.stageLeaveMonitor3 = function () {
    this.cornerNav = undefined;
    this.stageClean();
};
let computed = {};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
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
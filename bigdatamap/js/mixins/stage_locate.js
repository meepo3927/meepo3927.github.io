const Vue = require('vue');
const Context = require('global/tomap/context.js');
const Stars = require('global/tomap/stars.js');
const LR = require('global/tomap/LR.js');

const COLOR_DEFINE = [
    '#3A91DB', '#F26C60', '#8DC1A9'
];
const POI_COLOR_DEFINE = [
    '#3A91DB','#F26C60','#8DC1A9','#E01F54',
    '#F4E001','#23539B','#26C0C0','#27727B',
    '#E87C25','#73a333','#F3A43B','#60C0DD'
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
// 区域选址
methods.stageEnterLocate1 = function () {
    this.map.setHybrid();
    let canvas = this.addNewCanvas();
    let req = this.vRequest.fetch2('/locate/gridValue', this.commonParam);
    let gridInfoLayer = Vue.extend(require('comp/grid-info-layer.vue'));

    this.gridInfoComp = new gridInfoLayer({});
    this.setPromise('gridValue', req).then((data) => {
        let cubes = data.map((v, i) => {
            let arr = v.items.map(v => ({
                lng: v.lng,
                lat: v.lat,
                value: v.gridValue
            }));
            return new Stars.Cube(arr, canvas, {
                color: COLOR_DEFINE[i]
            });
        });
        canvas.setData(cubes).update();
        this.gridInfoComp.$mount();
        let infoComp = this.gridInfoComp;
        this.$el.appendChild(this.gridInfoComp.$el);
        // 鼠标事件
        canvas.on('mousemove', (e) => {
            let x = e.clientX;
            let y = e.clientY;
            let p;
            for (var i = 0; i < cubes.length; i++) {
                p = cubes[i].searchPoint(x, y);
                if (p) {
                    break;
                }
            }
            infoComp.render(p);
        });
        this.cornerNav = data.map((v, i) => {
            return {name: v.gridTypeDesc, color: COLOR_DEFINE[i]}
        });
        this.cornerEnter1 = (item, i) => {
            canvas.clear().setData(cubes[i]).update();
        };
    }).catch((e) => {
        LOG('Error:', e);
    });
};
methods.stageLeaveLocate1 = function () {
    this.map.setSatellite();
    this.cornerNav = undefined;
    this.cornerEnter = undefined;
    if (this.gridInfoComp) {
        this.gridInfoComp.$destroy();
        this.$el.removeChild(this.gridInfoComp.$el);
        this.gridInfoComp = null;
    }

    this.stageClean();
};

// 客流来源
methods.stageEnterLocate2 = function () {
    let req = this.vRequest.fetch2('/locate/areaSource', this.commonParam);
    let canvas1 = this.addNewCanvas();
    let canvas2 = this.addNewCanvas();
    this.setPromise('areaSource', req).then((data) => {
        // 聚集地
        let locationMap = {};
        let locationColorMap = {};
        data.forEach((item) => {
            if (!locationMap[item.name]) {
                locationMap[item.name] = {
                    name: item.name,
                    lng: item.toLng,
                    lat: item.toLat,
                    userNum: item.userNum
                };
            } else {
                locationMap[item.name].userNum += item.userNum;
            }
        });
        let locations = [];
        let cornerNav = [];
        for (let i in locationMap) {
            let locationColor = POI_COLOR_DEFINE[locations.length];
            locationColorMap[i] = locationColor;
            locations.push(locationMap[i]);
            cornerNav.push({name: i, color: locationColor});
        }
        this.cornerNav = cornerNav;
        let dataArr = this.getStarDataArr(locations, 0, (i) => {
            return POI_COLOR_DEFINE[i]
        });
        let star = new Stars.star1(dataArr, canvas1, {
            mode: 2,
            max: 111,
            bound: 100
        });
        // POI
        let pois = locations.map((v) => {
            let point = {lng: v.lng, lat: v.lat};
            return new LR.POI(point, v);
        });
        this.addPOI(pois);
        // 路线
        let dataArr2 = this.getOdDataArr(data.map((v) => {
            v.color = locationColorMap[v.name];
            return v;
        }));
        let od = new Stars.OD(dataArr2, canvas2, {});

        canvas1.setData([star]).start({clear: true});
        canvas2.setData([od]).start();
    }).catch((e) => {
        LOG(e);
    });

};
methods.stageLeaveLocate2 = function () {
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
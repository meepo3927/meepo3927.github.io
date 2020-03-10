const Context = require('global/tomap/context.js');
const Stars = require('global/tomap/stars.js');
const config = require('global/config.js');
const LR = require('global/tomap/LR.js');
const COLOR_DEFINE = config.CREDIT_DEFINE.map(v => v.color);

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.stageEnterCredit1 = function () {
    let canvas = this.addNewCanvas();

    // 散点图
    let req = this.vRequest.fetch2('/credit/location', this.commonParam);
    this.setPromise('monitor1', req).then((data) => {
        this.cornerNav = data.map((v, i) => {
            return {name: v.creditDesc, color: COLOR_DEFINE[i]}
        });
        let dataArr1 = this.getStarDataArr(data[0].items, 1, COLOR_DEFINE[0]);
        let dataArr2 = this.getStarDataArr(data[1].items, 1, COLOR_DEFINE[1]);
        let dataArr3 = this.getStarDataArr(data[2].items, 2, COLOR_DEFINE[2]);
        let POI_ARRAY = [];
        // 生成POI，显示人数
        for (let i = 0; i < data.length; i++) {
            let pois = data[i].items.map((item) => {
                let point = {lng: item.lng, lat: item.lat};
                return new LR.POI(point, {
                    name: (item.userNum + '人')
                }, {visible: i === 0});
            })
            POI_ARRAY.push(pois);
        }
        const showPOI = (j) => {
            for (var i = 0; i < POI_ARRAY.length; i++) {
                if (j === i) {
                    POI_ARRAY[i].forEach(poi => poi.showHide(true))
                } else {
                    POI_ARRAY[i].forEach(poi => poi.showHide(false))
                }
            }
        };
        let stars = [];
        stars[0] = new Stars.star1(dataArr1, canvas, {
            mode: 3, callback: (val, d, self) => {
                if (self.reachMax()) {
                    stars[1].reset();
                    canvas.setData(stars[1]);
                    showPOI(1);
                }
            }
        });
        stars[1] = new Stars.star1(dataArr2, canvas, {
            mode: 3, callback: (val, d, self) => {
                if (self.reachMax()) {
                    stars[2].reset();
                    canvas.setData(stars[2]);
                    showPOI(2);
                }
            }
        });
        stars[2] = new Stars.star1(dataArr3, canvas, {
            mode: 3, callback: (val, d, self) => {
                if (self.reachMax()) {
                    stars[0].reset();
                    canvas.setData(stars[0]);
                    showPOI(0);
                }
            }
        });
        // 散点，动画
        canvas.setData(stars[0]).start({clear: true});
        POI_ARRAY.forEach((pois) => {
            this.addPOI(pois);
        });
        // 左下enter
        this.cornerEnter = (item, i) => {
            if (canvas.data[0] === stars[i]) {
                return;
            }
            stars[i].reset();
            canvas.setData(stars[i]);
            showPOI(i);
        };
    }).catch((e) => {
        LOG(e);
    });
    //this.map.setHybrid();
};
methods.stageLeaveCredit1 = function () {
    //this.map.setSatellite();
    this.cornerNav = undefined;
    this.cornerEnter = undefined;
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
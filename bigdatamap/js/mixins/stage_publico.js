const Context = require('global/tomap/context.js');
const Stars = require('global/tomap/stars.js');

const COLOR_ARR = [
    '#69AB3D', '#FFC606', '#F57E30',
    '#FF0000', '#0070C0', '#00B0F0'
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
methods.stageEnterPublico1 = function () {
    let req = this.vRequest.fetch2('/publico/location', this.commonParam);
    this.setPromise('publico-location', req).then((arr) => {

        let lights = arr.map((v, i) => {
            let data = v.items;
            let points = data.map((v) => {
                return {lng: v.lng, lat: v.lat, value: v.userNum}
            });
            let maxValue = 0;
            points.forEach(v => {
                maxValue = Math.max(maxValue, v.value);
            });
            let color = COLOR_ARR[i];
            let canvas = this.addNewCanvas();
            let light = new Stars.light(points, canvas, {
                maxValue, color
            });
            let interval = 150 + (i * 10);
            canvas.setData(light).start({interval, clear: true});
        });
        this.cornerNav = arr.map((v, i) => {
            return {name: v.wordDesc, color: COLOR_ARR[i]}
        });
        
    }).catch((e) => {
        LOG(e);
    });
};
methods.stageLeavePublico1 = function () {
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
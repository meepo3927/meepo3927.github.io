const tool = require('util/tool.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getRequestParam = function (point, radius) {
    let p = {};
    point = point || this.point;
    if (point) {
        p.wLatitude = point.lat;
        p.jLongitude = point.lng;
    }
    if (!radius && this.$refs.map) {
        p.queryDistance = this.$refs.map.radius;
    }

    return p;
};
methods.getBannerImg = function (i) {
    let name = this.sixName[i];
    return this.getImageUrl('/six/part_banner_' + name + '.png')
};
let computed = {};
computed.clickMapTip = function () {
    return '请点击地图，选择观察区域'
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            point: null
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
    mixins: [
        require('mixins/six.js'),
        require('mixins/request_mix.js'),
        require('mixins/chart.js')
    ],
    components: {}
};
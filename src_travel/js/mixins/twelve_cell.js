const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.onSceneryClick = function () {
    let id = this.data.sceneryID || this.data.id || 7122;
    let url = this.basePath + '/scenery_in_twelve?scenery_id=' + id;
    //let url = this.getStaticUrl('/scenery_in_twelve', 'scenery_id=' + this.data.id);
    //window.open(url);
    location.href = url;
};
methods.updateNum = function (data) {
    this.rotating = true;
    clearTimeout(this.rotateTimer);
    this.rotateTimer = setTimeout(() => {
        this.userNum = data.peopleNum;
        this.rotating = false;
    }, 650);
};

methods.initMap = function (options) {
    let map = new BMap.Map(this.$refs.map);
    const DEFAULT_LNG = 111.676943;
    const DEFAULT_LAT = 40.820949;
    const DEFAULT_ZOOM = 16;
    if (options) {
        var lng = options.lng || DEFAULT_LNG;
        var lat = options.lat || DEFAULT_LAT;
        var zoom = options.zoom || DEFAULT_ZOOM;
    } else {
        lng = DEFAULT_LNG;
        lat = DEFAULT_LAT;
        zoom = DEFAULT_ZOOM;
    }
    map.enableScrollWheelZoom(true);
    // 定位
    map.centerAndZoom(new BMap.Point(lng, lat), zoom);
    // 增加大标
    var marker = new BMap.Marker(new BMap.Point(lng, lat));
    map.addOverlay(marker);
    // 点击
    map.addEventListener('click', this.onMapClick);
    this.bmap = map;
    setTimeout(() => {
        map.panBy(23, 107);
    }, 100);
};
methods.onMapClick = function (e) {
    LOG(e.point);
};
let computed = {};
computed.sceneryName = function () {
    return this.data.sceneryName;
};
let watch = {};
module.exports = {
    props: ['data'],
    data: function () {
        var o = {
            rotating: false,
            userNum: undefined
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
<template>
<div class="vue-bmap">
    <div ref="map" class="map-instance"></div>
</div>
</template>

<script>
const borderData = require('lib/geo/border_data.js');
const config = require('global/config.js');
const nameOffsetX = {
    '呼伦贝尔': 17,
    '阿拉善': -80,
    '巴彦淖尔': -30,
    '鄂尔多斯': -40,
    '乌海': -15,
    '呼和浩特': -30,
    '乌兰察布': -25,
    '锡林郭勒': -45,
    '赤峰': -20,
    '通辽': -15,
    '兴安盟': -50
};
const nameOffsetY = {
    '呼伦贝尔': -20,
    '阿拉善': -60,
    '鄂尔多斯': -15,
    '巴彦淖尔': -40,
    '包头': -50,
    '呼和浩特': 10,
    '乌兰察布': -15,
    '锡林郭勒': -10,
    '乌海': -10,
    '赤峰': -35,
    '兴安盟': -25,
    '通辽': -8
};
const defaultCenterPoint = {
    // lng: 112.813081, lat: 44.525586
    lng: 111.083735, lat: 46.134604
};
let methods = {};
methods.setHomeView = function () {
    let point = defaultCenterPoint;
    //this.map.disableDragging();
    this.hybrid = false;
    this.map.disableScrollWheelZoom();
    this.map.disableDoubleClickZoom();
    this.map.setMapType(BMAP_SATELLITE_MAP);
    this.centerAndZoom(new BMap.Point(point.lng, point.lat), 6);
};
methods.setCityView = function () {
    //this.map.setMapType(BMAP_HYBRID_MAP);
    this.map.setMapType(this.myMapType);
    this.map.enableDragging();
    this.map.enableScrollWheelZoom();
};
methods.reCenter = function () {
    let point = defaultCenterPoint;
    this.centerAndZoom(new BMap.Point(point.lng, point.lat), 6);
    this.reset();
};
methods.initMap = function (BMap) {
    var map = new BMap.Map(this.$refs.map, {
        enableMapClick: false
    });
    map.addEventListener("tilesloaded", () => {
        if (this.tilesloaded) {
            return;
        }
        this.$emit('tilesloaded');
        this.tilesloaded = true;
    });
    map.addEventListener('moving', (e) => {
        this.$emit('moving', e);
    });
    this.pointStack = [];
    map.addEventListener('click', (e) => {
        this.pointStack.push(e.point);
        LOG(e.point.lng + ',' + e.point.lat);
    });
    this.map = map;
    this.setHomeView();
};

methods.drawCityName = function (cityName, point) {
    let p = new BMap.Point(point.lng, point.lat);
    let label = new BMap.Label(cityName, {
        position: p,
        offset: new BMap.Size(nameOffsetX[cityName] || 0, nameOffsetY[cityName] || 0)
    });
    label.setStyle({
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '16px',
        color: '#ffffff',
        pointerEvents: 'none'
    });

    this.map.addOverlay(label);
    return label;
};
methods.drawBorders = function() {
    this.borderOverlays = [];
    this.nameOverlays = [];
    const citylist = this.vRequest.citylist;
    citylist.forEach((city, i) => {
        let data = borderData[city.name] || [];
        let overlay = this.drawBorder(data, i, city);
        this.borderOverlays.push(overlay);

        let point = this.vConfig.geoCoordMap[city.name];
        let layName = this.drawCityName(city.name, point);
        this.nameOverlays.push(layName);
    });
};
methods.removeBorders = function () {
    if (this.borderOverlays) {
        this.borderOverlays.forEach((lay) => {
            this.removeOverlay(lay);
        });
        this.borderOverlays.length = 0;
    }
    if (this.nameOverlays) {
        this.nameOverlays.forEach((lay) => {
            this.removeOverlay(lay);
        });
        this.nameOverlays.length = 0;
    }
};
methods.drawBorder = function (arr, i, city) {
    const colorMap = {
    };
    const defaultColor = '#ffffff';
    let strokeColor = colorMap[i] || defaultColor;
    var ply = new BMap.Polygon(arr, {
        strokeWeight: 2,
        strokeColor,
        strokeOpacity: 0.7,
        fillColor: defaultColor,
        fillOpacity: 0.01
    });
    ply.id = 'city_' + i;
    ply.addEventListener('click', () => {
        this.$emit('set-city', city);
    });
    this.map.addOverlay(ply);
    return ply;
};
methods.delegate = function (func) {
    let args = Array.prototype.slice.call(arguments, 1);
    return this.map[func].apply(this.map, args);
};
methods.centerAndZoom = function (p, zoom) {
    return this.delegate('centerAndZoom', p, zoom);
};
methods.addOverlay = function (lay) {
    return this.delegate('addOverlay', lay);
};
methods.removeOverlay = function (lay) {
    return this.delegate('removeOverlay', lay);
};
methods.setCurrentCity = function (city) {
    return this.delegate('setCurrentCity', city);
};
methods.setHybrid = function () {
    if (this.map.getMapType() === BMAP_SATELLITE_MAP) {
        this.map.setMapType(BMAP_HYBRID_MAP);
        this.hybrid = true;
    }
};
methods.setSatellite = function () {
    if (this.map.getMapType() === BMAP_HYBRID_MAP) {
        this.map.setMapType(BMAP_SATELLITE_MAP);
        this.hybrid = false;
    }
};
methods.reset = function () {
    return this.delegate('reset');
};
let computed = {};
computed.myMapType = function () {
    let ss = (this.hybrid === true) ? BMAP_HYBRID_MAP : BMAP_SATELLITE_MAP;
    return (this.maptype === 'satellite') ? ss : BMAP_NORMAL_MAP;
};
let watch = {};
watch.maptype = function () {
    this.map.setMapType(this.myMapType);
};
const created = function () {
};
const mounted = function () {
    window.VueBMap = this;
    this.loadMapScript(this.initMap);
};
const beforeDestroy = function () {

};
const dataFunc = function () {
    let o = {
        hybrid: false
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['maptype'],
    mounted,
    mixins: [
        require('mixins/bdmap.js')
    ],
    beforeDestroy,
    components: {}
};
</script>
<style lang="less">
.vue-bmap .anchorBL {
    display: none;
}
.vue-bmap > .map-instance img {
    filter: saturate(150%);
}
.vue-bmap svg path:hover {
    fill-opacity: 0.5;
}
</style>
<style scoped lang="less">
.vue-bmap {
}
.vue-bmap > .map-instance {
    height: 100%;
}
</style>
<template>
<div class="vmap-wrapper" :class="rootClass">
    <div class="v-amap" ref="map" ></div>
    <img :src="getImageUrl('/fake_map.png')" class="fake-map"
        @click="onFakeClick" />
    <radius-slider v-if="sliderVisible" v-model="radius"
        class="v-slider" />
    <div class="loading-1 loading-fixed" v-show="loading"></div>
</div>
</template>

<script>
import EventBus from 'util/event_bus.js';
import config from 'global/config.js';
import tool from 'util/tool.js';
// 默认ZOOM
var MAP_DEFAULT_LEVEL = 11;
// 呼和浩特经纬度

// 北京经纬度
var BEIJING_POINT = {
    lng: 116.331398,
    lat: 39.897445
};

// 加载JS
const loadJS = function () {
    var script = document.createElement('script');
    var key = '54fc25c73b5aa3a4d5fef63d7095f19e';
    script.type = "text/javascript";
    if (!location.host) {
        var protocal = 'http://';
    } else {
        protocal = '//';
    }
    script.src = protocal + "webapi.amap.com/maps?v=1.3&key=" + key + "&callback=amapCallback";
    script.onerror = () => {
        ebus.fire('error');
        ebus._Error = true;
    };
    document.body.appendChild(script);
};
// 事件通知
const ebus = new EventBus();

// 高德JS回调
window.amapCallback = function () {
    ebus.fire('loaded');
};

// load AMap JavaScript
if (typeof window.AMap === 'undefined') {
    loadJS();
}

let methods = {};
methods.getInitZoom = function () {
    if (this.zoom) {
        return parseInt(this.zoom, 10) || MAP_DEFAULT_LEVEL;
    }
    return MAP_DEFAULT_LEVEL;
};
methods.getInitMapOption = function () {
    return tool.extend({
        animateEnable: true,
        jogEnable: true,
        zoom: this.getInitZoom(),
        scrollWheel: false,         // 不允许滚轮缩放
        // showBuildingBlock: true,
        center: [config.HOHHOT_POINT.lng, config.HOHHOT_POINT.lat]
    }, this.initOptions);
};
methods.onComplete = function () {

    if (this.satellite === '1') {
        this.showSatellite();
    }

    if (this.traffic === '1') {
        this.showTraffic();
    }
};
// 高德地图JS加载完成后，进行初始化
methods.init = function () {
    this.loading = false;
    // 初始化
    let mapInstance = new AMap.Map(this.$refs.map, this.getInitMapOption());
    this.map = mapInstance;
    // 地图加载完成
    this.map.on('complete', () => {
        this.isCompleted = true;
        this.onComplete();
        this.$emit('complete', mapInstance);
    });
    // 增加标尺
    AMap.plugin(['AMap.Scale'], function () {
        var scale = new AMap.Scale();
        mapInstance.addControl(scale);
    });
    
    // 工具条
    AMap.plugin(['AMap.ToolBar'], function () {
        var toolbar = new AMap.ToolBar({
            position: 'LT',
            noIpLocate: true,
            liteStyle: true
        });
        mapInstance.addControl(toolbar);
    });
    
    // 事件
    mapInstance.on('click', (e) => {
        var point = e.lnglat;
        if (!this.point) {
            this.$emit('firstclick', point);
        }
        this.$emit('click', point);
        this.point = point;
    });
};
methods.clear = function () {
    if (this.map) {
        this.map.clearMap();
    }
};
methods.whileReady = function (func) {
    if (!func) {
        return;
    }
    if (this.isCompleted) {
        func(this.map);
    } else {
        this.$on('mapComplete', func);
    }
};
methods.onFakeClick = function () {
    var point = {
        lng: config.HOHHOT_POINT.lng,
        lat: config.HOHHOT_POINT.lat
    };
    if (!this.point) {
        this.$emit('firstclick', point);
    }
    this.$emit('click', point);
    this.point = point;
};
methods.showError = function () {
    this.loadError = true;
};
methods.dispose = function () {
    if (this.map) {
        this.map.destroy();
        this.map = null;
    }
};
let computed = {};
computed.sliderVisible = function () {
    return (this.isCompleted === true && this.slider === '1');
};
computed.rootClass = function () {
    let c = [];
    if (this.loadError) {
        c.push('vmap-error');
    }
    if (this.satellite) {
        c.push('with-satellite');
    }
    return c;
};
let watch = {};
watch.satellite = function (v) {
    v === '1' ? this.showSatellite() : this.hideSatellite();
};
watch.traffic = function (v) {
    v === '1' ? this.showTraffic() : this.hideTraffic();
};
watch.radius = function (v) {
    this.$emit('radius-change', v);
};
const created = function () {};
const mounted = function () {
    if (ebus._Error === true && !window.AMap) {
        return this.showError();
    }
    ebus.on('error', this.showError);
    if (!window.AMap || !window.AMap.Map) {
        this.loading = true;
        return ebus.on('loaded', () => {
            this.init();
        });
    }

    this.init();
};
const beforeDestroy = function () {
    if (this.map) {
        this.map.destroy();
    }
    this.map = null;
};
const dataFunc = function () {
    let o = {
        radius: 3000,
        isCompleted: false,
        loading: true,
        loadError: false
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [
        'zoom', 'satellite', 'traffic',
        'slider', 'initOptions', 'loading'
    ],
    mounted,
    mixins: [
        require('mixins/amap_plugin.js')
    ],
    beforeDestroy,
    components: {
        'radius-slider': require('comp/radius-slider.vue')
    }
};
</script>

<style scoped lang="less">
@slider-offset-right:  10px;
@slider-offset-bottom: 10px;
.vmap-wrapper {
    position: relative;
}
.v-amap {
    height: 100%;
}
.fake-map {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.vmap-error {
    background-color: #dedede;
    font-size: 18px;
    text-align: center;
    position: relative;
    .fake-map {
        display: block;
    }
    & > span {
        position: absolute;
        display: block;
        text-align: center;
        width: 200px;
        height: 30px;
        top: 50%;
        left: 50%;
        margin-left: -100px;
        margin-top: -15px;
    }
}
.v-slider {
    position: absolute;
    bottom: @slider-offset-bottom;
    right: @slider-offset-right;
}
.loading-1 {
    position: absolute !important;
    margin-top: 19px !important;
}
</style>

<template>
<v-amap ref="map" class="map-holder"
    satellite="1" slider="1"
    :init-options="initOptions"
    :loading="loading"
    @click="onMapClick"
    @radius-change="onRadiusChange" />
</template>

<script>
let methods = {};
methods.fetchRender = function (point) {
    this.$refs.map.drawMarkerCircle(point, {
        autoZoom: true
    });
    const req = this.vRequest.totalCust(point, this.$refs.map.radius);
    this.$refs.map.removeHeatmap();
    this.loading = true;
    this.setPromise('fetch', req).then((data) => {
        this.loading = false;
        let o = this.transferHeatMapData(data);
        this.$refs.map.renderHeatmap(point, o);
    }).catch(() => {
        this.loading = false;
    });
};
methods.onRadiusChange = function () {
    if (this.lastPoint) {
        this.fetchRender(this.lastPoint);
    }
};
methods.onMapClick = function (point) {
    this.fetchRender(point);
    this.lastPoint = point;
};

let computed = {};
computed.initOptions = function () {
    return {
    }
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.MonitorMap = this;
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        loading: false
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/request_mix.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.map-holder {
    height: 500px;
}
</style>

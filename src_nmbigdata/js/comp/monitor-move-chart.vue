<template>
<div class="move-chart">
    <my-chart :o="o" ref="c" />
</div>
</template>

<script>
let echarts = require('echarts');
require('lib/china.js');
require('lib/echarts.bmap.js');

let methods = {};
methods.processMap = function () {
    let echart = this.$refs.c.$refs.echart;
    if (!echart) {
        return LOG('No echart instance');
    }
    let model = echart.chart.getModel();
    if (!model) {
        return LOG('No echart model');
    }
    let map = model.getComponent('bmap').getBMap();
    var lNav = new BMap.NavigationControl();
    var tNav = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
    });
    map.addControl(lNav);
    map.addControl(tNav);
};
methods.init = function () {
    let point = this.vConfig.geoCoordMap['呼和浩特'];
    let p = {
        wLatitude: point[1],
        jLongitude: point[0],
        func: 'migList',
        limit: 100
    };
    this.vRequest.fetch3('/rest/migration', p).then((data) => {
        this.o = this.getMigOption({
            city: this.city,
            data
        });
        this.$nextTick(this.processMap);
    }).catch((e) => {
        LOG('[Error]', e);
    });
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
    // 百度地图API加载完成
    let mapTimer = setInterval(() => {
        if (window.BMap) {
            clearInterval(mapTimer);
            this.init();
        }
    }, 60);
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        o: null
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
        require('mixins/move.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.move-chart {
    height: 500px;
}
</style>

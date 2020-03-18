<template>
<div class="six-part six-part-3 inner-main">
    <div class="six-part-banner">
        <img :src="getBannerImg(2)" />
        <h3 v-text="sixTitle[2]"></h3>
        <h4 v-text="sixSubTitle[2]"></h4>
    </div>

    <!-- section 1 -->
    <div class="main-section mt15">
        <div class="six-intro-text" v-text="sixWholeDesc[2]"></div>

        <!-- 地图 -->
        <v-amap ref="map" slider="1" class="map-holder"
            @click="onMapClick"
            @radius-change="onRadiusChange" />

        <div class="chart-1 grey-chart mt20" v-if="point">
            
            <my-chart :o="o" />
            
        </div>
    </div>
</div>
</template>

<script>
const tool = require('util/tool.js');

let methods = {};
methods.onMapClick = function (point) {
    this.point = point;
    this.$refs.map.drawMarkerCircle(point, {
        autoZoom: true
    });

    this.fetchRender();
};
methods.onRadiusChange = function () {
    if (!this.point) {
        return;
    }
    this.$refs.map.drawMarkerCircle(this.point, {
        autoZoom: true
    });
    this.fetchRender();
};
methods.getCreditBarOption = function (data) {
    let o = tool.arrayToMap(data, 'crdtGradeName');
    let keys = ['待提升', '中等', '良好', '优秀', '极好'];
    return this.getVerticalBar({
        title: {
            text: '人群信用等级分布'
        },
        grid: {},
        xAxis: {
            data: keys
        },
        series: [{
            name: '人数',
            
            data: keys.map((v) => {
                return o[v].num
            })
        }]
    });
};
methods.fetchRender = function () {
    this.o = null;
    let p = this.getRequestParam(this.point);
    p.func = 'creditByDis';
    const req = this.vRequest.fetch3('/rest/credit', p);
    this.setPromise('creditByDis', req).then((data) => {
        this.o = this.getCreditBarOption(data);
    }).catch((e) => {
        this.o = 'empty';
        LOG(e);
    });
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {};
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
        require('mixins/six_part.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.six-part-3 {
    
}
.map-holder {
    height: 460px;
}
.chart-1 {
    height: 400px;
}
</style>

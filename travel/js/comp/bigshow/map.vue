<template>
<div class="v-map">
    <div class="v-chart" ref="instance"></div>
</div>
</template>

<script>
import 'root';
import tool from 'util/tool';
import echarts from 'echarts';
import config from 'global/config';
import EchartUtil from 'util/echart.js';
import request from 'util/request';
import URL from 'util/url';
import chartUtil from 'util/chart';
import 'lib/geo/china.js';
import 'lib/geo/neimenggu.js';

const sceneryId = URL.query().id || 7112;
const loopInterval = 6 * 1000;
var methods = {};
methods.fetchRender = function () {
    request.getAttractionSource1(sceneryId).then((data) => {
        request.getAttractionSource12(sceneryId).then((data2) => {
            this.mixData = data.concat(data2.map((v) => {
                if (v.cityDesc) {
                    v.provinceName = v.cityDesc;
                }
                return v;
            }));
            this.render();
        }).catch(() => {
            this.mixData = data;
            this.render();
        });
    });
};
methods.processUserNum = function (list) {
    let total = 0;
    list.forEach((item) => {
        total += item.userNum;
    });
    if (total <= 0) {
        return list;
    }
    let ratio = this.userNum / total;
    list.forEach((item) => {
        item.userNum = Math.round(item.userNum * ratio);
    });
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].userNum <= 0) {
            list.splice(i, 1);
        }
    }
    return list;
};
methods.loopRender = function () {
    if (this.loopTimer) {
        clearTimeout(this.loopTimer);
    }
    this.loopTimer = setTimeout(this.render, loopInterval);
};
methods.render = function () {
    if (!this.userNum) {
        return setTimeout(this.render, 500);
    }
    if (!this.mixData) {
        return this.loopRender();
    }
    
    chartUtil.mode = this.mode;
    var o = chartUtil.getBigShowMapOption(this.processUserNum(this.mixData));
    if (this.chart) {
        this.chart.dispose();
    }
    let myChart = echarts.init(this.$refs.instance);
    myChart.setOption(o);
    this.chart = myChart;
    this.loopRender();
};
var computed = {};
computed.userNum = function () {
    return this.$store.getters.realtimeUserNum;
};
var watch = {};
watch.mode = function () {
    this.render();
};
var mounted = function () {
    this.fetchRender();
};
let beforeDestroy = function () {
    if (this.chart) {
        this.chart.dispose();
        this.chart = null;
    }
};
let dataFunc = function () {
    var o = {
    };
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [
    ],
    methods,
    computed,
    props: ['mode'],
    mounted,
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.v-map {
}
</style>
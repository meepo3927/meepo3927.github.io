<template>
<div class="chart-pie-2 m-panel">
    <h2>消费占比</h2>
    <h6>Types of ARPU</h6>
    <div class="v-chart" ref="chart"></div>
</div>
</template>

<script>
import chartUtil from 'util/chart.js';
import echarts from 'echarts';
import mix from 'mixins/chart_pie_mix.js';
import Request from 'request';
var methods = {};
methods.fetchRender = function () {
    Request.getBigShowPie2().then((data) => {
        let o = chartUtil.getAnalysisConsumptionPieOption({
            data
        });
        o = chartUtil.getBigShowPieChartOption(o);

        if (this.chart) {
            this.chart.dispose();
        }
        let myChart = echarts.init(this.$refs.chart, 'bigshow');
        myChart.setOption(o);
        this.chart = myChart;
        this.loopNext();
    });
};
var computed = {};
var watch = {};
var mounted = function () {
};
let destroyed = function () {};
let dataFunc = function () {
    var o = {};
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [mix],
    methods,
    computed,
    props: [],
    mounted,
    destroyed,
    components: {}
};
</script>

<style scoped lang="less">
.v-chart {
}
</style>
<template>
<div class="chart-in-out m-panel m-right-chart">
    <h2>迁入迁出实时监控</h2>
    <h6>Move In/Out Monitor</h6>
    <div class="v-chart" ref="chart"></div>
</div>
</template>

<script>
import chartUtil from 'util/chart.js';
import Request from 'request';
import mix from 'mixins/right_chart_mix.js';
var methods = {};
methods.fetchRender = function () {
    Request.getBigShowInOut().then((data) => {
        let option = chartUtil.getBigShowInOut(data);
        option = Tool.extend(option, this.chartOption);

        let myChart = this.getChartInstance();
        myChart.setOption(option);

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
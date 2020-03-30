<template>
<div class="chart-all-type-1 m-panel m-right-chart">
    <h2>女性游客年龄、消费指数综合分析</h2>
    <h6>User Gender Age Analysis</h6>
    <div class="v-chart" ref="chart"></div>
</div>
</template>

<script>
import chartUtil from 'util/chart.js';
import Request from 'request';
import mix from 'mixins/right_chart_mix.js';
var methods = {};
methods.fetchRender = function () {
    Request.gitBigShowAllType1().then((data) => {
        let o = chartUtil.getBigShowAllType1(data);
        o = Tool.extend(o, this.chartOption);

        let myChart = this.getChartInstance();
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

</style>
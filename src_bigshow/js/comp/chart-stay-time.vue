<template>
<div class="chart-stay-time m-panel m-right-chart">
    <h2>停留时间实时监控</h2>
    <h6>Stay Time Monitor</h6>
    <div class="v-chart" ref="chart"></div>
</div>
</template>

<script>
import chartUtil from 'util/chart.js';
import mix from 'mixins/right_chart_mix.js';
import Request from 'request';
var methods = {};
methods.fetchRender = function () {
    Request.getBigShowStayTime().then((data) => {
        let option = chartUtil.getBigShowStayTime(data);
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
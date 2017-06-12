<template>
<div class="chart-all-type-1 m-panel m-right-chart">
	<h2>女性游客年龄、消费指数综合分析</h2>
	<h6>User Gender Age Analysis</h6>
	<div class="v-chart" ref="chart"></div>
</div>
</template>

<script>
import tool from 'util/tool';
import chartUtil from 'util/chart';
import echarts from 'echarts';
import request from 'util/request';
var methods = {};
methods.fetchRender = function () {
	request.gitBigShowAllType1().then((data) => {
		let o = chartUtil.getBigShowAllType1(data);
		o = tool.extend(o, this.chartOption);

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
	mixins: [
		require('./right_chart_mix.js')
	],
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
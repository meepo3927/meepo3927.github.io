<template>
<div class="chart-in-out m-panel m-right-chart">
	<h2>迁入迁出实时监控</h2>
	<h6>Move In/Out Monitor</h6>
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

	request.getBigShowInOut().then((data) => {
		let option = chartUtil.getBigShowInOut(data);
		option = tool.extend(option, this.chartOption);

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
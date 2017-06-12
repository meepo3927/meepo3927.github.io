<template>
<div class="chart-all-type m-panel m-right-chart">
	<h2>游客综合指数分析</h2>
	<h6>User Combine Analysis</h6>
	<div class="v-chart" ref="chart"></div>
</div>
</template>

<script>
import tool from 'util/tool';
import chartUtil from 'util/chart';
import echarts from 'echarts';
import request from 'util/request';
import config from 'global/config';
var methods = {};
methods.getRequestParam = function () {
	let date = config.bigShowDate;
	return [this.pId, date];
};
methods.fetchRender = function () {
	request.gitBigShowAllType(...this.getRequestParam()).then((data) => {
		let o = chartUtil.getBigShowAllType(data);
		o = tool.extend(o, this.chartOption, {
			grid: {
				right: 40
			}
		});

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
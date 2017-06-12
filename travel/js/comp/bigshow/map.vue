<template>
<div class="v-map">
	<div class="v-chart" ref="instance"></div>
</div>
</template>

<script>
import tool from 'util/tool';
import echarts from 'echarts';
import config from 'global/config';
import EchartUtil from 'util/echart.js';
import request from 'util/request';
import URL from 'util/url';
import chartUtil from 'util/chart';

import 'lib/geo/china.js';
import 'lib/geo/neimenggu.js';

var methods = {};
methods.fetchRender = function (r) {

	let o = chartUtil.getBigShowMapOption(r[0]);

	o = tool.extend(o, {
	});

	setTimeout(() => {
		if (this.chart) {
			this.chart.dispose();
		}
		let myChart = echarts.init(this.$refs.instance);
		myChart.setOption(o);
		this.chart = myChart;
	}, 200);

};
methods.init = function () {
};
var computed = {};
var watch = {};
var mounted = function () {
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
		require('./real_mix.js')
	],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.v-map {
	
}
</style>
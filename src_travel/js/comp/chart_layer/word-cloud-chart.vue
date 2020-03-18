<template>
	<my-chart :o="o"></my-chart>
</template>

<script>
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';
import tool from 'util/tool.js';
import 'lib/echarts-wordcloud.min.js';

var methods = {};

var computed = {};
computed.o = function () {
	if (!this.data) {
		return null;
	}
	let data = tool.extend([], this.data.chart);
    if (!data.length) {
		return EchartUtil.empty();
	}
	return {
		tooltip: {},
		series: [EchartUtil.getWordCloudSeries({
			data
		})]
	};
};
var watch = {};
var mounted = function () {
};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/chart_layer.js')
	],
	methods,
	computed,
	props: ['data'],
	mounted,
	beforeDestroy,
	components: {
		'my-chart': require('comp/common/my-chart.vue')
	}
};
</script>

<style scoped lang="less">
.my-chart {
	
}
</style>
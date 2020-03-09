<template>
	<my-chart :o="o" />
</template>

<script>
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';
import tool from 'util/tool.js';

var methods = {};
var computed = {};
computed.o = function () {
	let data = tool.extend([], this.data);
	if (!data.length) {
		return null;
	}
	data = data.sort((a, b) => {
		return (a.value - b.value);
	});
	return EchartUtil.getXYOption({
		title: this.dataTitle,
		xAxis: {
			type: 'value'
		},
		yAxis: {
			type: 'category',
			interval: 0,
			axisLabel: {
				interval: 0
			},
			data: data.map((v) => v.name)
		},
		series: [EchartUtil.getBarSeries({
			name: this.name || '数量',
			data: data.map((v) => v.value),
			barMaxWidth: 25
		})]
	});
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
	],
	methods,
	computed,
	props: ['data', 'name', 'dataTitle', 'subtext'],
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
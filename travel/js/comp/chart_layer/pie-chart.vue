<template>
	<my-chart :o="o" />
</template>

<script>
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';

var methods = {};
var computed = {};
computed.o = function () {
	if (!this.data || !this.data.length) {
		return null;
	}
	return chartUtil.getPieChart({
		title: this.dataTitle
	}, {
		data: this.data,
		name: this.name
	});
};
var watch = {};
var mounted = function () {
};
let beforeDestroy = function () {};
let dataFunc = function () {
	var data = {
	};
	return data;
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

</style>
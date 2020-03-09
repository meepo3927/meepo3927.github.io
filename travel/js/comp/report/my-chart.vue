<template>
<div class="my-chart">
	<vue-echarts ref="E"
		:loading="loading"
		:options="options"
		:theme="myTheme"
		:auto-report="false"
		@click="$emit('click', $event)"></vue-echarts>
	<div class="loading-bar position-offset" v-show="loading"></div>
</div>
</template>

<script>
import EChartUtil from 'util/echart.js';
var methods = {};
methods.resize = function () {
	return this.$refs.E.resize();
};
methods.dispose = function () {
	this.$refs.E.dispose();
};
methods.getWidth = function () {
	return this.$el.clientWidth;
};
methods.on = function (name, func) {
	this.$refs.E.chart.on(name, func);
};
methods.setOption = function (o) {
	this.$refs.E.hideLoading();
	this.$refs.E.mergeOptions(o);
};
methods.getWidth = function () {
	return this.$el.clientWidth;
};
var computed = {};
computed.options = function () {
	if (this.o === 'empty') {
		return EChartUtil.empty();
	}
	return this.o;
};
computed.loading = function () {
	if (this.o === null) {
		return true;
	}
	return false;
};
computed.myTheme = function () {
	return this.theme || 'shine';
};
var watch = {};
var mounted = function () {
	this.vBus.on('reportChartResize', this.resize);
};
let beforeDestroy = function () {
	this.vBus.off('reportChartResize', this.resize);
};
let dataFunc = function () {
	var o = {
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: ['o', 'theme'],
	mounted,
	beforeDestroy,
	components: {
		'vue-echarts': (r) => {
			require.ensure([], () => {
				r(require('comp/common/ECharts.vue'));
			});
		}
	}
};
</script>

<style scoped lang="less">
.my-chart {
	position: relative;
	height: 100%;
}
.loading-bar {
	position: absolute;
	left: 50%;
	top: 50%;
}
</style>
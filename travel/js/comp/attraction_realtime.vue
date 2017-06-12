<template>
<div class="realtime-monitor">
	<div class="x-wrapper">
		<h4 class="layer-top-title" v-text="title"></h4>
		<a href="javascript:;" class="layer-close-btn" @click="close"><i class="fa fa-times"></i></a>
		<a href="javascript:;" class="max-btn layer-icon-btn" @click="openBig">
			<i class="fa fa-window-maximize"></i>
		</a>
		<!-- 切换按钮 -->
		<div class="btn-group pv10 pl10">
			<button type="button" class="btn" :class="{active: active === 1}"
				@click="toggle(1)">景点流量监控</button>
			<button type="button" class="btn" :class="{active: active === 2}"
				@click="toggle(2)">迁入/迁出流量分析</button>
			<button type="button" class="btn" :class="{active: active === 3}"
				@click="toggle(3)">景区客流来源排行</button>
		</div>
		<!-- chart 1 -->
		<div class="chart-1" ref="chart_1" v-if="active === 1" key="1"></div>
		<!-- chart 2 -->
		<div class="chart-2" ref="chart_2" v-if="active === 2" key="2"></div>
		<!-- chart 3 -->
		<div class="chart-3" ref="chart_3" v-if="active === 3" key="3"></div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import tool from 'util/tool';
import chartUtil from 'util/chart';
import loading from 'util/loading';
import echarts from 'echarts';
var config = require('global/config');
var methods = {};
methods.openBig = function () {
	this.$emit('open-big');
};
methods.getTitleOption = function (title) {
	return {
		text: title,
		subtext: this.areaName,
		textStyle: {
			fontSize: 16
		}
	};
};
methods.getChartRequest = function (n) {
	if (!this.chartRequest[n]) {
		this.chartRequest[n] = request['getAttractionRealtime' + n](this.options.id);
	}
	return this.chartRequest[n];
};
methods.render_1 = function (options = {}) {
	if (options.chart) {
		var chart = options.chart;
	} else {
		this.dispose();
		chart = chartUtil.getLoadingChart(this.$refs.chart_1);
	}
	this.charts.c = chart;
	this.getChartRequest(1).then((result) => {
		chart.hideLoading();
		chart.setOption(chartUtil.getHumanTrafficOption({
			title: this.getTitleOption('景区人流量监控'),
			data: result
		}));
	});
};
methods.render_2 = function (options = {}) {
	if (options.chart) {
		var chart = options.chart;
	} else {
		this.dispose();
		chart = chartUtil.getLoadingChart(this.$refs.chart_2);
	}
	this.charts.c = chart;
	this.getChartRequest(2).then((result) => {
		chart.hideLoading();
		chart.setOption(chartUtil.getAttractionInOutOption({
			titleOption: this.getTitleOption('景区迁入/迁出人数监控'),
			data: result || []
		}));
	});
};
methods.render_3 = function (options = {}) {
	if (options.chart) {
		var chart = options.chart;
	} else {
		this.dispose();
		chart = chartUtil.getLoadingChart(this.$refs.chart_3);
	}
	this.charts.c = chart;
	require.ensure([], () => {
		require('lib/geo/china.js');
		require('lib/geo/neimenggu.js');
		request.getAttractionSource1(this.options.id).then((result) => {
			chart.hideLoading();
			let option = chartUtil.getAttractionSource1Option({
				data: result || [],
				mini: true
			});
			chart.setOption(option);
		});
	});
};
methods.dispose = function () {
	if (this.charts.c) {
		this.charts.c.dispose();
		this.charts.c = null;
	}
};
methods.render = function (options = {}) {
	this.reset();
	this.active = 1;
	this.options = options;
	this.$nextTick(() => {
		this.render_1();
	});
};
var computed = {};
computed.title = function () {
	return this.areaName + '实时客流量';
};
var mounted = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	mixins: [require('comp/realtime_mix.js')],
	props: ['areaName'],
	mounted,
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../less/global/config";
.realtime-monitor {
	@c-height: 320px;
	.chart-1 {

		height: @c-height;
	}
	.chart-2 {

		height: @c-height;
	}
	.chart-3 {

		height: @c-height;
	}
}
</style>
<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="mh5" >到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />

		<div class="btn-group ver-top ml5">
			<button type="button" class="btn" :class="{active: level === 1}"
				@click="render(1)">省外</button>
			<button type="button" class="btn" :class="{active: level === 2}"
				@click="render(2)">省内</button>
			<button type="button" class="btn" :class="{active: level === 3}"
				@click="render(3)">区县</button>
		</div>
	</div>
	<!-- chart -->
	<div class="chart-wrapper x-body">
		
		<div class="my-chart" ref="chart"></div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;
var methods = {};
methods.render = function (num) {
	if (num === this.level) {
		return false;
	}
	this.level = num;
	this.fetchRender();
};
methods.render1 = function () {
	this.disposeOne();
	this.charts.one = chartUtil.getLoadingChart(this.$refs.chart);
	request.getAttractionSource(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAttractionSourceOption({
			data: result,
			title: '景区本周客流区外来源排行',
			subtitle: this.subtitle
		});
		this.charts.one.hideLoading();
		this.charts.one.setOption(option);
	}, () => {
		this.charts.one.hideLoading();
		mlayer.msg('没有获取到数据');
	});
};
methods.render2 = function () {
	this.disposeOne();
	this.charts.one = chartUtil.getLoadingChart(this.$refs.chart, {});
	request.getAttractionSource2(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAttractionSource2Option({
			data: result,
			title: '景区本周客流区内来源排行',
			subtitle: this.subtitle
		});
		this.charts.one.hideLoading();
		this.charts.one.setOption(option);
	}, () => {
		this.charts.one.hideLoading();
		mlayer.msg('没有获取到数据');
	});
};
methods.render3 = function () {
	this.disposeOne();
	this.charts.one = chartUtil.getLoadingChart(this.$refs.chart, {});
	request.getAttractionSource3(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAttractionSource2Option({
			data: result,
			title: '景区本周客流区内来源排行(区县级)',
			subtitle: this.subtitle
		});
		this.charts.one.hideLoading();
		this.charts.one.setOption(option);
	}, () => {
		this.charts.one.hideLoading();
		mlayer.msg('没有获取到数据');
	});
};
methods.disposeOne = function () {
	if (this.charts.one) {
		this.charts.one.dispose();
		this.charts.one = null;
	}
};
methods.fetchRender = function () {
	require.ensure([], () => {
		require('lib/geo/china.js');
		require('lib/geo/neimenggu.js');
		var method = 'render' + this.level;
		this[method] && this[method]();
	});
};
var computed = {};
var mounted = function () {
	this.fetchRender();
	this.$on('onDateChange', function () {
		this.fetchRender();
	});
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		level: 1
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	mixins: [
		require('comp/chart_layer_mix.js'),
		require('comp/attraction_analysis_part_mix.js')
	],
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.analysis-part {
}
.my-chart {
	height: 100%;
}
.datepicker-box {
	padding-left: 1px;
}
.chart-wrapper {
	background-color: #404a59;
	padding: 10px 10px 10px 10px;
}
</style>
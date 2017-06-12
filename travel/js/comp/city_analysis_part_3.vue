<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="mh5">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />

		<!-- 选择景区 -->
		<a-select :id="id" @change="onAttractionChange" />
		<!-- 选择范围 -->
		<div class="btn-group ver-top">
			<button type="button" class="btn" :class="{active: level === 1}"
				@click="render(1)">省外</button>
			<button type="button" class="btn" :class="{active: level === 2}"
				@click="render(2)">省内</button>
			<button type="button" class="btn" :class="{active: level === 3}"
				@click="render(3)">区县</button>
		</div>
	</div>
	<div class="x-body">
		<!-- chart -->
		<div class="my-chart p10" ref="one"></div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;
var methods = {};
methods.onAttractionChange = function (sid, name) {
	this.sid = sid;
	this.attractionName = name;
	this.fetchRender();
};
methods.render = function (num) {
	if (num === this.level) {
		return false;
	}
	this.level = num;
	this.fetchRender();
};
methods.render1 = function () {
	this.disposeOne();
	this.charts.one = chartUtil.getLoadingChart(this.$refs.one);
	request.getAttractionSource(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAttractionSourceOption({
			data: result,
			title: '景区客流区外来源排行',
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
	this.charts.one = chartUtil.getLoadingChart(this.$refs.one, {});
	request.getAttractionSource2(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAttractionSource2Option({
			data: result,
			title: '景区客流区内来源排行',
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
	this.charts.one = chartUtil.getLoadingChart(this.$refs.one, {});
	request.getAttractionSource3(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAttractionSource2Option({
			data: result,
			title: '景区客流区内来源排行(区县级)',
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
methods.getRequestParam = function () {
    return [this.sid, this.startDatetime, this.endDatetime];
};
var computed = {};
computed.areaName = function () {
	var city = this.area ? this.area.city : '';
	return city + this.attractionName;
};
var mounted = function () {
	this.$on('onDateChange', function () {
		this.fetchRender();
	});
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		level: 1,
		sid: 0,
		attractionName: ''
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
	components: {
		'a-select': require('comp/attraction-select.vue')
	}
};
</script>

<style scoped lang="less">
.analysis-part {
}
.datepicker-box {
	padding-left: 1px;
}
.my-chart {
	height: 100%;
}
</style>
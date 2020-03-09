<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span" >到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />

		<div class="btn-group ver-top ml25">
			<button type="button" class="btn-big" :class="{active: level === 1}"
				@click="render(1)">省外</button>
			<button type="button" class="btn-big" :class="{active: level === 2}"
				@click="render(2)">省内</button>
			<button type="button" class="btn-big" :class="{active: level === 3}"
				@click="render(3)">区县</button>
			<button type="button" class="btn-big" :class="{active: level === 4}"
				@click="render(4)">境外</button>
		</div>
	</div>
	<!-- chart -->
	<div class="chart-wrapper x-body">
		<my-chart :o="o" />
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
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
	this.o = null;
	request.getAttractionSource(...this.getRequestParam()).then((result) => {
		this.o = chartUtil.getAttractionSourceOption({
			data: result,
			title: '景区本周客流区外来源排行',
			subtitle: this.subtitle
		});
	}).catch((r) => {
		this.o = 'empty';
	});
};
methods.render2 = function () {
	this.o = null;
	request.getAttractionSource2(...this.getRequestParam()).then((result) => {
		this.o = chartUtil.getAttractionSource2Option({
			data: result,
			title: '景区本周客流区内来源排行',
			subtitle: this.subtitle
		});
	}).catch((r) => {
		this.o = 'empty';
	});
};
methods.render3 = function () {
	this.o = null;
	request.getAttractionSource3(...this.getRequestParam()).then((result) => {
		this.o = chartUtil.getAttractionSource3Option({
			data: result,
			title: '景区本周客流区内来源排行(区县级)',
			subtitle: this.subtitle
		});
	}).catch((r) => {
		this.o = 'empty';
	});
};
methods.render4 = function () {
	this.o = null;
	// 境外
	request.getAttractionSourceCountry(...this.getRequestParam()).then((result) => {
		let defaults = {
			title: {
				text: '景区本周客流区内来源排行(境外)',
				subtext: this.subtitle
			}
		};
		this.o = chartUtil.vwRPTOuterUserDaily1(defaults, {
			data: result
		});
	}).catch((r) => {
		this.o = 'empty';
	});
};
methods.fetchRender = function () {
	require.ensure([], () => {
		require('lib/geo/china.js');
		require('lib/geo/neimenggu.js');
		require('lib/geo/world.js');
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
const beforeDestroy = function () {};
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
		require('mixins/analysis_part.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.analysis-part {
}
.my-chart {
}


</style>
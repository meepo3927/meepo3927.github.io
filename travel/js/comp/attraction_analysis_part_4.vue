<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="mh5" >到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />
	</div>
	<!-- chart -->
	<div class="chart-wrapper x-body">
		<div class="my-chart chart-1" ref="stayTime"></div>
		<div class="my-chart chart-2" ref="chart"></div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;
var methods = {};
methods.onStartDateInput = function (val) {
    this.startDatetime = val;
    let date = DateUtil.parseDate(val);
    let date2 = DateUtil.getDateOffset(date, 7);
    this.endDatetime = DateUtil.getYMDStr(date2);
    this.$emit('onDateChange');
};
methods.onEndDateInput = function (val) {
    this.endDatetime = val;
    let date = DateUtil.parseDate(val);
    let date2 = DateUtil.getDateOffset(date, -7);
    this.startDatetime = DateUtil.getYMDStr(date2);
    this.$emit('onDateChange');
};
methods.renderStayTime = function (data) {
	var option = chartUtil.getAttractionStayTimeOption({
		data: data,
		title: {
			text: '景区游客逗留时间统计',
			subtext: this.subtitle
		}
	});
	this.charts.stayTime.hideLoading();
	this.charts.stayTime.setOption(option);
};
methods.fetchRender = function () {
	// 逗留时间
	this.charts.stayTime = chartUtil.getLoadingChart(this.$refs.stayTime, {
	});
	request.getAttractionAnalysisStaytime(...this.getRequestParam()).then((result) => {
		this.renderStayTime(result);
	}, () => {
		this.renderStayTime([]);
	});
	this.charts.one = chartUtil.getLoadingChart(this.$refs.chart, {
		
	}, 'vintate');
	request.getAttractionPeopleVisitDate(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAttractionPeopleVisitDate({
			data: result,
			title: {
				text: '景区本周游客驻留时间分布图',
				subtext: this.subtitle
			}
		});
		this.charts.one.hideLoading();
		this.charts.one.setOption(option);
	}, () => {
		this.charts.one.hideLoading();
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
	height: 50%;
}
.chart-1 {
	border-bottom: 1px solid #bbb;
}
.chart-2 {
	border-top: 1px solid #fff;
}
</style>
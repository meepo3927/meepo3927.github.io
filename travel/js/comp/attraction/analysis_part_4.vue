<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span" >到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />
	</div>
	<!-- chart -->
	<div class="chart-wrapper x-body">
		<my-chart :o="o1" class="chart-1" />
		<my-chart :o="o2" class="chart-2" theme="vintage" />
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
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
methods.getStayTimeOption = function (data) {
	return chartUtil.getAttractionStayTimeOption({
		data: data,
		title: {
			text: '景区游客逗留时间统计',
			subtext: this.subtitle
		}
	});
};
methods.fetchRender = function () {
	// 图1
	this.o1 = null;
	request.getAttractionAnalysisStaytime(...this.getRequestParam()).then((result) => {
		this.o1 = this.getStayTimeOption(result);
	}).catch(() => {
		this.o1 = 'empty';
	});
	// 图2
	this.o2 = null;
	request.getAttractionPeopleVisitDate(...this.getRequestParam()).then((result) => {
		this.o2 = chartUtil.getAttractionPeopleVisitDate({
			data: result,
			title: {
				text: '景区本周游客驻留时间分布图',
				subtext: this.subtitle
			}
		});
	}).catch(() => {
		this.o2 = 'empty';
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
		o1: null,
		o2: null
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

.my-chart {
	height: 49% !important;
}
.chart-1 {
}
.chart-2 {

	margin-top: 10px;
}
</style>
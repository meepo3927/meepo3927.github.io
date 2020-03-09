<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />
	</div>
	<!-- chart -->
	<div class="x-body">
		<my-chart :o="o"/>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
var DateUtil = MDate.Util;
var methods = {};
methods.getMyOption = function (data) {
	return chartUtil.getAttractionCountOption({
		data: data,
		title: {
			text: '景区人流量统计',
			subtext: this.subtitle
		}
	});
};
methods.fetchRender = function () {
	// 流量统计
	this.o = null;
	request.getAttractionAnalysisCount(...this.getRequestParam()).then((result) => {
		this.o = this.getMyOption(result);
	}).catch((r) => {
		this.o = 'empty';
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
	var endDate = DateUtil.getDateOffset(new Date(), -1);
	var startDate = DateUtil.getDateOffset(endDate, -2, 'month');
	var o = {
		startDatetime:  DateUtil.getYMD(startDate),
		endDatetime: DateUtil.getYMD(endDate)
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

</style>
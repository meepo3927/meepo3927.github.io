<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="mh5">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />
	</div>
	<!-- chart -->
	<div class="x-body">
		<div class="my-chart " ref="count"></div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;
var methods = {};
methods.renderCount = function (data) {
	var option = chartUtil.getAttractionCountOption({
		data: data,
		title: {
			text: '景区人流量统计',
			subtext: this.subtitle
		}
	});
	this.charts.count.hideLoading();
	this.charts.count.setOption(option);
};
methods.fetchRender = function () {
	// 流量统计
	this.charts.count = chartUtil.getLoadingChart(this.$refs.count, {});
	request.getAttractionAnalysisCount(...this.getRequestParam()).then((result) => {
		this.renderCount(result);
	}, () => {
		this.renderCount([]);
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
</style>
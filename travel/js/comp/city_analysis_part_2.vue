<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="mh5">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />
	</div>
	<div class="x-body">
		<!-- chart -->
		<div class="my-chart " ref="one"></div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;
var methods = {};
methods.renderOne = function (data) {
	var option = chartUtil.getCityAnalysisUserCommon({
		data: data,
		title: {
			text: '景区全年人流量',
			subtext: this.subtitle
		}
	});
	this.charts.one.hideLoading();
	this.charts.one.setOption(option);
};
methods.fetchRender = function () {
	// 逗留时间
	this.charts.one = chartUtil.getLoadingChart(this.$refs.one, {});
	request.getCityAnalysisUserCommon(...this.getRequestParam()).then((result) => {
		this.renderOne(result);
	}, () => {
		this.renderOne([]);
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
		theads: [],
		rows: []
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
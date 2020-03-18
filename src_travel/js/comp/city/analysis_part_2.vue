<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />
	</div>
	<div class="x-body ">
		<!-- chart -->
		<my-chart :o="o"></my-chart>
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
	return chartUtil.getCityAnalysisUserCommon({
		data: data,
		title: {
			text: '景区全年人流量',
			subtext: this.subtitle
		}
	});
};
methods.fetchRender = function () {
	// 逗留时间
	this.o = null;
	request.getCityAnalysisUserCommon(...this.getRequestParam()).then((result) => {
		this.o = this.getMyOption(result);
	}).catch(() => {
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
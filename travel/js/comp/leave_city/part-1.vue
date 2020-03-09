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
	<div class="x-body" >
		<my-chart :o="o" />
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';
import MDate from 'lib/mdate.js';

var methods = {};
methods.render = function () {
};
methods.fetchRender = function () {
	this.o = null;
	request.vwRptNmOutProvDaily(...this.getRequestParam()).then((r) => {

		this.o = chartUtil.vwRptNmOutProvDaily({
			title: {
				text: '本市出省游客量统计',
				subtext: this.subtext
			}
		}, {
			data: r.bars
		});
	}).catch((e) => {
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
		require('./part-mix.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.analysis-part {
}
</style>
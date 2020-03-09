<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<datepicker-2 @change="onDateChange" ref="datePicker2" />
	</div>
	<!-- chart -->
	<div class="x-body" >
		<my-chart :o="o"></my-chart>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';
import MDate from 'lib/mdate.js';

var methods = {};
methods.fetchRender = function (options = {}) {

	this.o = null;
	this.autoTryWrapper3(() => {
		let p = this.$refs.datePicker2.getParam();
		p.scenery_city = this.id;
		p.dim = 'outside';
		return request.r1('/v2/touristStayTimeAnalyze', p, p.dim).then((data) => {
			let option = chartUtil.rptNmOutSiteLongPie({
				title: {
					text: '游客逗留天数分布',
					subtext: this.getCycleSubtext()
				}
			}, {data});
			this.o = option;
		});
	}, () => {
		this.o = 'empty';
	});
};
methods.onDateChange = function () {
	if (this.dateChangeDisabled) {
		return;
	}
	this.fetchRender();
};
var computed = {};

var mounted = function () {
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
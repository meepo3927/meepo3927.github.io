<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />

		<div class="btn-group ver-top ml30">
			<button type="button" class="btn-big" :class="{active: type === 1}"
				@click="render(1)">图表</button>
			<button type="button" class="btn-big" :class="{active: type === 2}"
				@click="render(2)">数据</button>
		</div>
	</div>
	<!-- chart -->
	<div class="x-body" :class="['type-' + type]">
		<my-chart v-if="type === 1" :o="o"></my-chart>
		<table class="table-2" v-if="type === 2">
			<thead>
				<tr>
					<th></th>
					<th v-for="v in theads" v-text="v"></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in rows">
					<th v-text="row.name"></th>
					<td v-text="row.num0"></td>
					<td v-text="row.num1"></td>
					<td v-text="row.num3"></td>
					<td v-text="row.num5"></td>
					<td v-text="row.num7"></td>
					<td v-text="row.num9"></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
var DateUtil = MDate.Util;
var methods = {};
methods.getStayTimeOption = function (data) {
	return chartUtil.getCityStayTimeOption({
		data: data,
		title: {
			text: '游客驻留时间分布图',
			subtext: this.subtitle
		}
	});
};
methods.render = function (num) {
	if (num === this.type) {
		return false;
	}
	this.type = num;
	this.fetchRender();
};
methods.render1 = function () {
	// 逗留时间
	this.o = null;
	this.request.then((result) => {
		this.o = this.getStayTimeOption(result);
	}).catch(() => {
		this.o = 'empty';
	});
};
methods.render2 = function () {
};
methods.fetchRender = function () {
	this.request = request.getCityAnalysisStayTime(...this.getRequestParam());
	this.request.then((result) => {
		this.rows = result;
	});
	var m = 'render' + this.type;
	this[m] && this.$nextTick(this[m]);
};
var computed = {};
computed.tableVisible = function () {
	return (this.rows && this.rows.length > 0);
};
var mounted = function () {
	this.fetchRender();
	this.$on('onDateChange', function () {
		this.fetchRender();
	});
};
let dataFunc = function () {
	var o = {
		type: 1,
		theads: [
			'1小时内', '1-3小时', '3-5小时', '5-7小时',
			'7-9小时', '9小时以上'
		],
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
	components: {}
};
</script>

<style scoped lang="less">
.analysis-part {
}
.my-chart {

}
.x-body.type-2 {
	overflow-y: auto;
}
</style>
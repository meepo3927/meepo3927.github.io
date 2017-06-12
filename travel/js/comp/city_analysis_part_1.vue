<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="mh5">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />

		<div class="btn-group ver-top ml5">
			<button type="button" class="btn" :class="{active: type === 1}"
				@click="render(1)">图表</button>
			<button type="button" class="btn" :class="{active: type === 2}"
				@click="render(2)">数据</button>
		</div>
	</div>
	<!-- chart -->
	<div class="x-body" :class="['type-' + type]">
		<div class="my-chart " ref="stayTime" v-if="type === 1"></div>
		<table class="table-2" v-if="type === 2">
			<thead>
				<tr>
					<th></th>
					<th v-for="v in theads" v-text="v"></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in rows">
					<th v-text="row.sceneryName"></th>
					<td v-for="item in row.rptStayAnalyDayList" v-text="item.userNum"></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;
var methods = {};
methods.renderTable = function (data) {
	this.theads = [];
	var first = data[0] || {};
	first.rptStayAnalyDayList && first.rptStayAnalyDayList.forEach((item) => {
		this.theads.push(item['stayDateTime']);
	});

	this.rows = data;
};
methods.renderStayTime = function (data) {
	var option = chartUtil.getCityStayTimeOption({
		data: data,
		title: {
			text: '游客驻留时间分布图',
			subtext: this.subtitle
		}
	});

	this.charts.stayTime.hideLoading();
	this.charts.stayTime.setOption(option);
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
	this.charts.stayTime = chartUtil.getLoadingChart(this.$refs.stayTime, {});
	this.request.then((result) => {
		this.renderStayTime(result);
	}, () => {
		this.renderStayTime([]);
	});
};
methods.render2 = function () {
};
methods.fetchRender = function () {
	this.request = request.getCityAnalysisStayTime(...this.getRequestParam());
	this.request.then((result) => {
		this.renderTable(result);
	});
	var m = 'render' + this.type;
	this[m] && this.$nextTick(this[m]);
};
var computed = {};
computed.tableVisible = function () {
	return (this.theads.length > 0);
};
var mounted = function () {
	this.fetchRender();
	this.$on('onDateChange', function () {
		this.fetchRender();
	});
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		type: 1,
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
.x-body.type-2 {
	overflow-y: auto;
}
</style>
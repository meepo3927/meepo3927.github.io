<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />

		<!--
		<span class="mh5" >到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />
		-->

		<div class="btn-group ver-top">
			<button class="btn" :class="{active: type === 1}" @click="render(1)">综合分析</button>
			<button class="btn" :class="{active: type === 2}" @click="render(2)">单项分析</button>
		</div>
	</div>
	<!-- chart -->
	<div class="chart-wrapper x-body">
		<div class="my-chart" ref="chart" v-if="type === 1"></div>
		<ul class="chart-box three-pie-list" v-if="type === 2">
			<li>
				<div class="my-chart " ref="one"></div>
			</li>
			<li>
				<div class="my-chart" ref="two"></div>
			</li>
			<li>
				<div class="my-chart" ref="three"></div>
			</li>
		</ul>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;
var methods = {};
methods.getRequestParam = function () {
	// 只有一个日期
    return [this.id, this.startDatetime];
};
methods.render = function (num) {
	if (num === this.type) {
		return;
	}
	this.type = num;
	this.$nextTick(this.fetchRender);
};
methods.render1 = function () {
	this.charts.chart = chartUtil.getLoadingChart(this.$refs.chart, {
	});
	request.getAttractionCountAllType(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAttractionCountAllType({
			data: result,
			title: {
				text: '景区当日游客性别、年龄、ARPU 综合分析',
				subtext: this.subtitle
			}
		});
		this.charts.chart.hideLoading();
		this.charts.chart.setOption(option);
	}, () => {
		this.charts.chart.hideLoading();
	});
};
methods.render2 = function () {
	this.charts.one = chartUtil.getLoadingChart(this.$refs.one, {
		title: {
			text: '景区当日游客终端品牌占比',
			subtext: this.subtitle
		}
	});
	request.getAttractionCountPhoneBrand(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAnalysisTerminalPieOption({
			data: result
		});
		this.charts.one.hideLoading();
		this.charts.one.setOption(option);
	}, () => {
		this.charts.one.hideLoading();
	});

	this.charts.two = chartUtil.getLoadingChart(this.$refs.two, {
		title: {
			text: '景区当日游客 ARPU 分档占比',
			subtext: this.subtitle
		}
	});
	request.getAttractionCountArpuType(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAnalysisConsumptionPieOption({
			data: result
		});
		this.charts.two.hideLoading();
		this.charts.two.setOption(option);
	}, () => {
		this.charts.two.hideLoading();
	});

	this.charts.three = chartUtil.getLoadingChart(this.$refs.three, {
		title: {
			text: '景区当日游客年龄构成分析',
			subtext: this.subtitle
		}
	});
	request.getAttractionCountAgeType(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAnalysisAgePieOption({
			data: result
		});
		this.charts.three.hideLoading();
		this.charts.three.setOption(option);
	}, () => {
		this.charts.three.hideLoading();
	});
};
methods.fetchRender = function () {
	var m = 'render' + this.type;
	this[m] && this[m]();
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
	var date = new Date();
	var startDate = DateUtil.getDateOffset(date, -1);
	var o = {
		type: 1,
		startDatetime:  DateUtil.getYMD(startDate),
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
.three-pie-list {
	height: 100%;
	.my-chart {
		padding: 8px;
		height: 100%;
	}
}
.chart-wrapper {
}
</style>
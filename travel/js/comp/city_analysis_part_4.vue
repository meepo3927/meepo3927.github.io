<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />

		<div class="btn-group ver-top ml5">
			<button type="button" class="btn" :class="{active: type === 1}"
				@click="render(1)">综合分析</button>
			<button type="button" class="btn" :class="{active: type === 2}"
				@click="render(2)">单项分析</button>
		</div>
	</div>
	<div class="x-body">
		<!-- chart -->
		<div class="my-chart " ref="alltype" v-if="type === 1"></div>
		<ul class="chart-box three-pie-list" v-if="type === 2">
			<li><div class="my-chart " ref="one"></div></li>
			<li><div class="my-chart" ref="two"></div></li>
			<li><div class="my-chart" ref="three"></div></li>
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
methods.render = function (type) {
	if (type === this.type) {
		return;
	}
	this.type = type;
	this.fetchRender();
};
methods.renderAllType = function (data) {
	var option = chartUtil.getCityAnalysisUserAllType({
		data: data,
		title: {
			text: '景区当日游客性别、年龄、ARPU 综合分析',
			subtext: this.subtitle
		}
	});
	this.charts.alltype.hideLoading();
	this.charts.alltype.setOption(option);
};
methods.getRequestParam = function () {
	// 只有一个日期
    return [this.id, this.startDatetime];
};
methods.render1 = function () {
	// 逗留时间
	this.charts.alltype = chartUtil.getLoadingChart(this.$refs.alltype);
	request.getCityAnalysisUserAllType(...this.getRequestParam()).then((result) => {
		this.renderAllType(result);
	}, () => {
		this.renderAllType([]);
	});
};
methods.render2 = function () {
	this.renderOne();
	this.renderTwo();
	this.renderThree();
};
methods.renderOne = function () {
	this.charts.one = chartUtil.getLoadingChart(this.$refs.one, {});
	request.getCityAnalysisUserBrandType(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAnalysisTerminalPieOption({
			data: result,
			title: {
				text: '景区当日游客手机终端品牌构成',
				subtext: this.subtitle
			}
		});
		this.charts.one.hideLoading();
		this.charts.one.setOption(option);
	}, () => {
		this.charts.one.hideLoading();
	});
};
methods.renderTwo = function () {
	this.charts.two = chartUtil.getLoadingChart(this.$refs.two, {});
	request.getCityAnalysisUserArpuType(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAnalysisConsumptionPieOption({
			data: result,
			title: {
				text: '景区当日游客 ARPU 值占比',
				subtext: this.subtitle
			}
		});
		this.charts.two.hideLoading();
		this.charts.two.setOption(option);
	}, () => {
		this.charts.two.hideLoading();
	});
};
methods.renderThree = function () {
	this.charts.three = chartUtil.getLoadingChart(this.$refs.three, {});
	request.getCityAnalysisUserAgeType(...this.getRequestParam()).then((result) => {
		let option = chartUtil.getAnalysisAgePieOption({
			data: result,
			title: {
				text: '景区当日游客年龄分析',
				subtext: this.subtitle
			}
		});
		this.charts.three.hideLoading();
		this.charts.three.setOption(option);
	}, () => {
		this.charts.three.hideLoading();
	});
};
methods.fetchRender = function () {
	var m = 'render' + this.type;
	this[m] && this.$nextTick(this[m]);
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
</style>
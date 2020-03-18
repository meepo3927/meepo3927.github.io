<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客终端分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-1">
			<p v-html="combinedTip1"></p>
		</div>

		<!-- 图表1和2 -->
		<div class="m-row">
			<div class="m-col col-1">
				<div class="chart-box height-13">
					<my-chart :o="o1" />
				</div>
			</div>
			<!-- 
			<div class="m-col col-2">
				<div class="chart-box height-13">
					<my-chart :o="o2" />
				</div>
			</div>
			-->
		</div>
	</div>
</div>
</template>

<script>
import request from 'util/request.js';
import EChartUtil from 'util/echart.js';
import tool from 'util/tool.js';

let methods = {};
methods.makePPTSlide = function (pptx) {
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxCommonChartSlideProcess(slide, pptx);
	return slide;
};
methods.getOption1 = function (data) {
	data.sort(this.valueSortFuncDec);
	return this.getDefaultOption({
		title: {
			text: '游客使用最多的手机品牌TOP10',
			top: 50
		},
		tooltip: this.getBarTooltip(),
		grid: {
			top: 120,
			right: '10%',
			bottom: 80
		},
		color: ['#FF7F4F'],
		xAxis: {
			type: 'value'
		},
		yAxis: {
			type: 'category',
			axisTick: {show: false},
			data: data.map(v => v.name)
		},
		series: [this.getBarSeries({
			name: '数量',
			data: data.map(v => v.value),
			label: {
				normal: {
					position: 'right'
				}
			}
		})]
	});
};
methods.getOption2 = function () {
	let x = ['4G', '3G', '2G'];
	return this.getDefaultOption({
		title: {text: '游客手机制式构成'},
		tooltip: this.getPieTooltip(),
		legend: this.getCommonLegend({
			data: x
		}),
		series: [this.getPieSeries({
			radius: [35, 60],
			data: [
				{name: x[0], value: 190},
				{name: x[1], value: 290},
				{name: x[2], value: 90}
			]
		})]
	});
};
methods.fetchRender = function () {
	let onOver = () => {
		this.slideSubmitOver();
	};
	this.fetchIndex(1, 'sceneryUserTermTop10').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1_1 = function () {
	let copy = this.getSortPercentData(this.data1);
	if (!copy) {
		return '';
	}
	let a1 = [];
	let a2 = [];
	copy.forEach((v, i) => {
		if (i > 2) {
			return;
		}
		a1.push(v.name);
		a2.push(v._percent);
	});
	return a1.join('、') + '是游客使用最多的手机，分别占比' + a2.join('、');
};
computed.tip1_2 = function () {
	// return '4G终端占比达90.0%';
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('./slide_mix.js')
	],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../ref.less";
.chart-slide {}
.col-1 {
	width: 100%;
	// padding-right: @report-chart-pad;
}
.col-2 {
	width: 35%;
	padding-left: @report-chart-pad;
}
</style>
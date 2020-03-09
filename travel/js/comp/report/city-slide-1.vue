<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>客流量分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-2">
			<p v-html="tip1"></p>
		</div>

		<div class="chart-box height-table ">
			<my-chart :o="o1" />
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
	let o = this.getDefaultOption({
		title: {
			text: this.dimText + '日客流量发展趋势图'
		},
		tooltip: {
			trigger: 'axis'
		},
		grid: this.lineGrid(),
		xAxis: EChartUtil.getCategoryAxis({
			data: data.map((v) => v.name)
		}),
		yAxis: {
			type: 'value'
		},
		series: [this.getLineSeries({
			data: data.map((v) => v.value),
			markPoint: this.getLineMarkPoint()
		})]
	});
	return o;
};
methods.fetchRender = function () {
	const onOver = () => {
		this.slideSubmitOver();
	};
	this.fetchIndex(1, 'userNumTrendDay').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1 = function () {
	if (!this.data1) {
		return '';
	}
	let result = this.getAverageAndMax(this.data1);
	let average = Math.round(result.average);
	if (!result.maxItem) {
		return '';
	}
	let arr = [
		'统计期间，城市总体客流量为' + result.total + '人',
		'日均客流量达' + Math.round(result.average) + '人'
	];
	if (result.maxItem) {
		let maxDate = result.maxItem.name;
		let maxUserNum = result.maxItem.value;
		arr.push(maxDate + '达到客流量高峰，接待游客达' + maxUserNum + '人');
	}
	return arr.join('，') + '。';
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('./slide_mix.js'),
		require('./heatmap_chart_mix.js')
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
.chart-box {
	margin-top: @report-box-pad;
}
</style>
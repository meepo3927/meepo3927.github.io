<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>游客进入景区时间分布</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-2">
			<p v-html="heatMapTip"></p>
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
	let title2 = this.getHeatMapTitle2();
	let tData = this.transformHeatMapData(data);
	let o = this.getDefaultOption({
		title: [
			{text: '景区游客进入时间分布'},
			title2
		],
		grid: this.getHeatMapGrid(),
		tooltip: this.getHeatMapTooltip(),
		xAxis: EChartUtil.getHeatMapXAxis({
			data: tData.x,
			axisLabel: this.getHeatMapXAxisLabel()
		}),
		yAxis: EChartUtil.getHeatMapYAxis({
			data: tData.y
		}),
		visualMap: EChartUtil.getHeatMapVisualMap({
			min: tData.min,
			max: tData.max,
			color: this.getVisualMapColor()
		}),
		series: [EChartUtil.getHeatMapSeries({
			// 列, 行 , 值
			data: tData.s,
			label: this.getHeatMapLabel()
		})]
	});
	return o;
};
methods.fetchRender = function () {
	const onOver = () => {
		this.slideSubmitOver();
	};
	this.fetchIndex(1, 'sceneryUserAccTimeDistribute').then(onOver).catch(onOver);
};
let computed = {};

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
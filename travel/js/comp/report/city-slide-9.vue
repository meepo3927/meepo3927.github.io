<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>游客热门搜索关键词分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>
		<div class="chart-box">
			<my-chart :o="o1" />
		</div>
	</div>
</div>
</template>

<script>
import request from 'util/request.js';
import EChartUtil from 'util/echart.js';
import tool from 'util/tool.js';
import 'lib/echarts-wordcloud.min.js';

let methods = {};
methods.makePPTSlide = function (pptx) {
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxCommonChartSlideProcess(slide, pptx);
	return slide;
};
methods.getOption = function (data) {
	return {
		tooltip: {},
		series: [EChartUtil.getWordCloudSeries({
			data
		})]
	};
};
methods.fetchRender = function () {
	this.o1 = null;
	const r = this.commonRequest('sceneryUserInterFoundAna');
	r.then((r) => {
		let data = r[12];
		this.o1 = this.getOption(data);
		this.data1 = data;
		this.slideSubmitOver();
	}).catch(() => {
		this.o1 = 'empty';
		this.slideSubmitOver();
	});
};
let computed = {};
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
.chart-box {
	height: @report-slide-height - 100px;
}
</style>
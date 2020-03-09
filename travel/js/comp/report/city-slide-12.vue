<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>游客年龄分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-1">
			<p v-html="tip1"></p>
		</div>

		<!-- 图表1 -->
		<div class="chart-box height-13">
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
	return this.getSinglePieOption({
		legend: {
			data: data.map(v => v.name)
		},
		title: {
			text: '游客年龄构成'
		},
		series:{
			data
		}
	});
};

methods.fetchRender = function () {
	let onOver = () => {
		this.slideSubmitOver();
	};
	this.fetchIndex(1, 'sceneryUserAgeAna').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1 = function () {
	let copy = this.getSortPercentData(this.data1);
	if (!copy) {
		return '';
	}
	let arr = copy.slice(0, 2);
	return arr.map((item) => {
		return item.name + '的游客占比' + item._percent;
	}).join('，') + '。';
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
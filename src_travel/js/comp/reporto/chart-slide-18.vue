<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客年龄分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-3">
			<p v-html="combinedTip1"></p>
		</div>

		<!-- 图表1和2 -->
		<div class="m-row">
			<div class="m-col col-1">
				<div class="chart-box my-height">
					<my-chart :o="o1" />
				</div>
			</div>

			<div class="m-col col-2">
				<div class="chart-box my-height">
					<my-chart :o="o2" ref="c2" />
				</div>
			</div>

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
	// let x = ['20岁以下', '20岁以上'];
	return this.getDefaultOption({
		title: {text: '景区游客年龄构成'},
		tooltip: this.getPieTooltip(),

		series: [this.getPieSeries({
			radius: [35, 60],
			data
		})]
	});
};
methods.getOption2 = function (data) {
	return this.getBarOption1(data, {
		title: '各景区游客年龄构成'
	});
};
methods.fetchRender = function () {
	let count = 0;
	let onOver = () => {
		count++;
		if (count === 2) {
			this.slideSubmitOver();
		}
	};
	this.fetchIndex(1, 'sceneryUserAgeAna').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserAgeAnaCompare').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1_1 = function () {
	let copy = this.getSortPercentData(this.data1);
	if (!copy) {
		return '';
	}
	return [
		copy[0].name + '的游客占比' + copy[0]._percent,
		copy[1].name + '的游客占比' + copy[1]._percent
	].join('，');
};
computed.tip1_2 = function () {
	if (!this.data2) {
		return '';
	}
	let copy = tool.copy(this.data2);
	let totalArr = tool.calDataMapTotal(copy);
	let a1 = [
		'20岁及以下', '(20岁,25岁]', '(25岁,35岁]', '(35岁,50岁]'
	];
	let a2 = [
		'(50岁,60岁]', '60岁以上'
	];
	let m1 = tool.getPercentMaxIndex(copy, a1, totalArr);
	let m2 = tool.getPercentMaxIndex(copy, a2, totalArr);
	let str1 = '50岁及以下游客占比最高的景区是' + m1.theName + '，占比' + m1.theStr;
	let str2 = '50岁以上游客占比最高的景区是' + m2.theName + '，占比' + m2.theStr;
	return [str1, str2].join('；');
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
	width: 35%;
	padding-right: @report-chart-pad;
}
.col-2 {
	width: 65%;
	padding-left: @report-chart-pad;
}
.my-height {
	height: 528px;
}
</style>
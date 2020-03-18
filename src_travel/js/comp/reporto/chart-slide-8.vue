<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客出行方式分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="m-row">
			<div class="m-col col-1">
				<div class="mid-tip line-4">
					<p v-html="tip1"></p>
				</div>

				<div class="chart-box height-3">
					<my-chart :o="o1" />
				</div>
			</div>
			<div class="m-col col-2">
				<div class="mid-tip line-4">
					<p v-html="tip2"></p>
				</div>

				<div class="chart-box height-3">
					<my-chart :o="o2" />
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
	return this.getDefaultOption({
		title: {text: '游客出行方式分布'},
		tooltip: this.getPieTooltip(),
		series: [this.getPieSeries({
			radius: [35, 60],
			data
		})]
	});
};

methods.getOption2 = function (data) {
	return this.getBarCommonOption(data, {
		title: '各景区游客出行方式对比'
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
	this.fetchIndex(1, 'sceneryUserTripModeDistribute').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserTripModeCompare').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1 = function () {
	let copy = this.getSortPercentData(this.data1);
	if (!copy) {
		return '';
	}
	return [
		'游客出行交通方式以' + copy[0].name + '为主，占比' + copy[0]._percent,
		'其次为' + copy[1].name + '，占比' + copy[1]._percent
	].join('；') + '。';
};
computed.tip2 = function () {
	if (!this.data2) {
		return '';
	}
	let copy = tool.copy(this.data2);
	let totalArr = tool.calDataMapTotal(copy);
	let m1 = tool.getPercentMaxIndex(copy, ['飞机'], totalArr);
	let m2 = tool.getPercentMaxIndex(copy, ['火车'], totalArr);
	let m3 = tool.getPercentMaxIndex(copy, ['汽车'], totalArr);
	let str1 = '游客选择飞机出行占比最高的景区是' + m1.theName + '，占比' + m1.theStr;
	let str2 = '选择火车出行占比最高的景区是' + m2.theName + '，占比' + m2.theStr;
	let str3 = '选择汽车出行占比最高的景区是' + m3.theName + '，占比' + m3.theStr;
	return this.combineString(str1, str2, str3);
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
</style>
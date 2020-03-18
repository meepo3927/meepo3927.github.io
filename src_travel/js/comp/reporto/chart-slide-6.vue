<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客驻留时长分析</h6>
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
		title: {text: '游客驻留时长分布'},
		tooltip: this.getPieTooltip(),
		// legend: this.getCommonLegend({
		// 	data: data.map(v => v.name)
		// }),
		series: [this.getPieSeries({
			radius: [35, 60],
			data
		})]
	});
};

methods.getOption2 = function (data) {
	return this.getBarCommonOption(data, {
		title: '各景区游客驻留时长对比'
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
	this.fetchIndex(1, 'sceneryUserStayHourDistribute').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserStayHourCompare').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1 = function () {
	let copy = this.getSortPercentData(this.data1);
	if (!copy) {
		return '';
	}
	let most = '游客在景区的驻留时长大多在' + copy[0].name +
		'，占比' + copy[0]._percent;
	return most + '。';
};
computed.tip2 = function () {
	if (!this.data2) {
		return '';
	}
	let copy = tool.copy(this.data2);
	let totalArr = tool.calDataMapTotal(copy);
	let m1 = tool.getPercentMaxIndex(copy, ['1小时及以内'], totalArr);
	let m2 = tool.getPercentMaxIndex(copy, ['(1小时,3小时]'], totalArr);
	let m3 = tool.getPercentMaxIndex(copy, ['(3小时,5小时]'], totalArr);
	let m4 = tool.getPercentMaxIndex(copy, ['(5小时,7小时]', '(7小时,9小时]', '9小时以上'], totalArr);
	let str1 = '游客驻留1小时及以内占比最高的景区是' + m1.theName + '，占比' + m1.theStr;
	let str2 = '驻留(1小时,3小时]占比最高的景区是' + m2.theName + '，占比' + m2.theStr;
	let str3 = '驻留(3小时,5小时]占比最高的景区是' + m3.theName + '，占比' + m3.theStr;
	let str4 = '驻留5小时以上占比最高的景区是' + m4.theName + '，占比' + m4.theStr;
	let a = [
		str1, str2, str3, str4
	];
	return a.join('；') + '。';
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
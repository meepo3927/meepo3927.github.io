<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客驻留天数分析</h6>
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
		title: {text: '游客驻留天数分布'},
		tooltip: this.getPieTooltip(),
		
		series: [this.getPieSeries({
			radius: [35, 60],
			data
		})]
	});
};

methods.getOption2 = function (data) {
	return this.getBarCommonOption(data, {
		title: '各景区游客驻留天数对比'
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
	this.fetchIndex(1, 'sceneryUserStayDaysDistribute').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserStayDaysCompare').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1 = function () {
	if (!this.data1) {
		return '';
	}
	let copy = tool.copy(this.data1);
	copy.forEach((v) => {
		v.value = v.value * 1;
	});
	let p1 = tool.calPercentByKey(copy, ['1天']);
	let p2 = tool.calPercentByKey(copy, ['2天']);
	let p3 = tool.calPercentByKey(copy, ['3天','4天','5天','6天','7天']);
	let p4 = tool.calPercentByKey(copy, ['7天以上']);
	let str1 = '在景区驻留1天的游客占比' + p1;
	let str2 = '驻留2天的游客占比' + p2;
	let str3 = '驻留3-7天的游客占比' + p3;
	let str4 = '';
	if (parseFloat(p4) > 0) {
		str4 = '驻留7天以上的游客占比' + p4;
	}
	return this.combineString(str1, str2, str3, str4);
};
computed.tip2 = function () {
	if (!this.data2) {
		return '';
	}
	let copy = tool.copy(this.data2);
	let totalArr = tool.calDataMapTotal(copy);
	let m1 = tool.getPercentMaxIndex(copy, ['1天'], totalArr);
	let m2 = tool.getPercentMaxIndex(copy, ['2天'], totalArr);
	let m3 = tool.getPercentMaxIndex(copy, ['3天','4天','5天','6天','7天'], totalArr);
	let m4 = tool.getPercentMaxIndex(copy, ['7天以上'], totalArr);
	let str1 = '游客驻留1天占比最高的景区是' + m1.theName + '，占比' + m1.theStr;
	let str2 = '驻留2天占比最高的景区是' + m2.theName + '，占比' + m2.theStr;
	let str3 = '驻留3-7天占比最高的景区是' + m3.theName + '，占比' + m3.theStr;
	let str4 = '';
	if (m4.theName) {
		str4 = '驻留7天以上占比最高的景区是' + m4.theName + '，占比' + m4.theStr;
	}
	return this.combineString(str1, str2, str3, str4);
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
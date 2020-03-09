<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客性别分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-2">
			<p v-html="combinedTip1"></p>
		</div>

		<!-- 图表1和2 -->
		<div class="m-row">
			<div class="m-col col-1">
				<div class="chart-box height-14">
					<my-chart :o="o1" />
				</div>
			</div>

			<div class="m-col col-2">
				<div class="chart-box height-14">
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
const tmpAdapt = (arr) => {
	let map = {};
	arr.forEach((item) => {
		let key = item.Sex_type || item.name;
		let value = (item.value * 1) || 0;
		if (map[key]) {
			map[key] += value;
		} else {
			map[key] = value;
		}
	});
	let result = [];
	for (let v in map) {
		result.push({
			name: v,
			value: map[v]
		});
	}
	return result;
};
let methods = {};
methods.makePPTSlide = function (pptx) {
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxCommonChartSlideProcess(slide, pptx);
	return slide;
};
methods.getOption1 = function (data) {
	// let x = ['男', '女'];
	return this.getDefaultOption({
		title: {text: '景区游客性别构成'},
		tooltip: this.getPieTooltip(),
		series: [this.getPieSeries({
			radius: [35, 60],
			data: tmpAdapt(data)
		})]
	});
};
methods.getOption2 = function (data) {
	return this.getBarOption1(data, {
		title: '各景区游客性别构成'
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
	this.fetchIndex(1, 'sceneryUserGenderAna').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserGenderAnaCompare').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1_1 = function () {
	if (!this.data1) {
		return '';
	}
	let copy = tool.extend([], this.data1)
	copy = tmpAdapt(copy);
	copy = this.getSortPercentData(copy);

	let map = {};
	copy.forEach((v) => {
		map[v.name] = v;
	});
	return [
		'男性游客占比' + map['男']._percent,
		'女性游客占比' + map['女']._percent
	].join('，');
};
computed.tip1_2 = function () {
	if (!this.data2) {
		return '';
	}
	let copy = tool.copy(this.data2);
	let totalArr = tool.calDataMapTotal(copy);
	let m1 = tool.getPercentMaxIndex(copy, ['男'], totalArr);
	let m2 = tool.getPercentMaxIndex(copy, ['女'], totalArr);
	let str1 = '男性游客占比最高的景区是' + m1.theName + '，占比' + m1.theStr;
	let str2 = '女性游客占比最高的景区是' + m2.theName + '，占比' + m2.theStr;
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
</style>
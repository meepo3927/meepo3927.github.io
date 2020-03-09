<template>
<div class="chart-slide report-slide-box">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区客流量分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-1" >
			<p v-html="tip1"></p>
		</div>

		<div class="chart-box height-1">
			<my-chart :o="o1" ref="c1"></my-chart>
		</div>

		<div class="mid-tip line-1">
			<p v-html="tip2"></p>
		</div>
		<div class="chart-box height-1">
			<my-chart :o="o2" ref="c2"></my-chart>
		</div>
	</div>
</div>
</template>

<script>
import request from 'util/request.js';
import EChartUtil from 'util/echart.js';

const getAverageAndMax = (data) => {
	var maxItem = null;
	var total = 0;
	for (let i = 0; i < data.length; i++) {
		let item = data[i];
		if (!maxItem || maxItem.value < item.value) {
			maxItem = item;
		}
		total += item.value;
	}
	var average = 0;
	if (data.length > 0) {
		average = total / data.length;
	}
	return {
		maxItem,
		average
	};
};

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
			text: '景区日客流量发展趋势图'
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
methods.getOption2 = function (data) {
	let x = data.map(v => v.name);
	let axisParam = EChartUtil.calAxisRotateParam(x, {
		chartWidth: this.$refs.c2.getWidth()
	});
	let grid = this.lineGrid();
	if (axisParam.pad) {
		grid.bottom += axisParam.pad - 15;
	}
	return this.getDefaultOption({
		title: {text: '各景区客流量分析'},
		tooltip: this.getBarTooltip(),
		grid,
		xAxis: EChartUtil.getBarCategoryAxis({
			data: x,
			axisLabel: axisParam.label
		}),
		yAxis: {
			type: 'value'
		},
		series: [this.getBarSeries1({
			name: '人数',
			data: data.map(v => v.value)
		})]
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
	this.fetchIndex(1, 'userNumTrendDay').then(onOver).catch(onOver);
	this.fetchIndex(2, 'userNumAnaByScenery').then(onOver).catch(onOver);
};

let computed = {};
computed.tip1 = function () {
	if (!this.data1) {
		return '';
	}
	let arg = getAverageAndMax(this.data1);
	let average = Math.round(arg.average);
	if (!arg.maxItem) {
		return '';
	}
	let maxDate = arg.maxItem.name;
	let maxUserNum = arg.maxItem.value;
	return [
		'统计期间，景区日均客流量达' + average + '人，',
		maxDate + '达到客流量高峰，接待游客达' + maxUserNum + '人。'
	].join('');
};
computed.tip2 = function () {
	if (!this.data2) {
		return '';
	}
	let list = this.getDataPercent(this.data2);
	let first = list[0];
	let second = list[1];
	let secondStr = '';
	if (second) {
		secondStr = [
			'，排在第二位的' + this.shortName(second.name) + '游客占',
			second.percent + '，达到' + second.value + '人次'
		].join('');
	}
	return [
		first.percent + '的游客游览了' + this.shortName(first.name),
		,'，达到' + first.value + '人次',
		secondStr
	].join('') + '。';
};
let watch = {};
const mounted = function () {
	
};
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
</style>
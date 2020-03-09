<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>各时段客流量分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="m-row">
			<div class="m-col col-1">
				<div class="mid-tip line-3">
					<p v-html="tip1"></p>
				</div>
				<div class="chart-box height-2">
					<my-chart :o="o1"></my-chart>
				</div>
			</div>
			<div class="m-col col-2">
				<div class="mid-tip line-3">
					<p v-html="tip2"></p>
				</div>

				<div class="chart-box height-2">
					<my-chart :o="o2"></my-chart>
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
methods.getMyGrid = function () {
	let g = this.lineGrid();
	g.top = 100;
	g.bottom = 120;
	return g;
};
methods.getOption1 = function (data) {
	return this.getDefaultOption({
		title: {
			text:  this.dimText + '日均客流量分析'
		},
		tooltip: this.getBarTooltip(),
		grid: this.getMyGrid(),
		xAxis: EChartUtil.getBarCategoryAxis({
			data: data.map(v => v.name)
		}),
		yAxis: {
			type: 'value',
			name: '万人'
		},
		series: [this.getBarSeries({
			name: '人数',
			data: data.map(v => v.value)
		})]
	});
};
methods.getOption2 = function (data) {
	// LOG(data);
	let series = [];
	let label = {};
	tool.eacho(data.dataMap, (val, key) => {
		series.push(this.getLineSeries({
			name: key,
			data: val,
			areaStyle: {normal: {}},
			label
		}));
	});
	
	let option = this.getDefaultOption({
		title: {text: this.dimText + '时均客流量分析'},
		grid: this.getMyGrid(),
		tooltip: {
			trigger: 'axis'
		},
		legend: this.getCommonLegend({
			bottom: 40,
			data: data.legend
		}),
		xAxis: EChartUtil.getCategoryAxis({
			data: data.names.map((v) => {
				return v + '点';
			})
		}),
		yAxis: {
			type: 'value'
		},
		series
	});
	return option;
};
methods.fetchRender = function () {
	let count = 0;
	let onOver = () => {
		count++;
		if (count === 2) {
			this.slideSubmitOver();
		}
	};
	this.fetchIndex(1, 'sceneryUserNumAvgDay').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserNumAvgHour').then(onOver).catch(onOver);
};

let computed = {};
computed.tip1 = function () {
	if (!this.data1) {
		return '';
	}
	let t = [];
	this.data1.forEach((v) => {
		t.push(v.name + '日均客流量' + v.value + '万人');
	});
	return [
		this.dimText + t.join('，') + '。'
	].join('');
};
computed.tip2 = function () {
	if (!this.data2) {
		return;
	}
	let data = this.data2;
	let arr = [];
	tool.eacho(data.dataMap, (v, key) => {
		let {max, index} = tool.getMaxInArray(v);
		let hour = data.names[index];
		if (max === 0 || !hour) {
			return;
		}
		arr.push({
			name: key, 
			time: hour + '点',
			value: max
		});
	});
	return this.dimText + arr.map((v) => {
		return v.name + '客流量高峰出现在' + v.time
			+ '，时均客流量达' + v.value + '人'
	}).join('，') + '。';
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
.m-col {
	width: 50%;
}
.col-1 {
	padding-right: @report-chart-pad;
}
.col-2 {
	padding-left: @report-chart-pad;
}
.chart-box.height-2 {
	padding-top: 10px;
}
</style>
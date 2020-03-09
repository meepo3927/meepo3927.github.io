<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>客流来源分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		
		<!-- 饼图 -->
		<div class="mid-tip line-1" >
			<p v-html="tip1"></p>
		</div>
		<div class="chart-box height-3-1">
			<my-chart :o="o1" ref="c1"></my-chart>
		</div>

		<div class="mid-tip line-2">
			<p v-html="tip2"></p>
		</div>
		<!-- 4个chart -->
		<div class="m-row">
			<div class="m-col col-1">
				<div class="chart-box height-3-2">
					<my-chart :o="o2"></my-chart>
				</div>
			</div>
			<div class="m-col col-2">
				<div class="chart-box height-3-2">
					<my-chart :o="o3"></my-chart>
				</div>
			</div>
			<div class="m-col col-3">
				<div class="chart-box height-3-2">
					<my-chart :o="o4"></my-chart>
				</div>
			</div>
			<div class="m-col col-4">
				<div class="chart-box height-3-2">
					<my-chart :o="o5"></my-chart>
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
		title: {text: '客流来源分布'},
		tooltip: this.getPieTooltip(),
		
		series: [this.getPieSeries({
			radius: [35, 60],
			data
		})]
	});
};
const barLabel = {
	normal: {
		position: 'right',
		formatter: (p) => {
			let v = p.value || p.data;
			return tool.padDecimal(v) + '%';
		}
	}
};
const barGrid = {
	right: 50,
	bottom: 10,
	containLabel: true
};
methods.getOption2 = function (data) {
	data.sort((a, b) => {
		return (a.value - b.value)
	});
	return this.getDefaultOption({
		title: {text: '省外游客来源省TOP5'},
		tooltip: this.getBarTooltip(),
		grid: barGrid,
		xAxis: {
			type: 'value',
			show: false,
		},
		yAxis: {
			type: 'category',
			axisTick: {show: false},
			data: data.map(v => v.name)
		},
		series: [this.getBarSeries({
			name: '人数占比',
			data: data.map(v => v.value),
			label: barLabel
		})]
	});
};
methods.getOption3 = function (data) {
	data.sort((a, b) => {
		return (a.value - b.value)
	});
	return this.getDefaultOption({
		title: {text: '省外游客来源市TOP5'},
		tooltip: this.getBarTooltip(),
		grid: barGrid,
		color: ['#FF0000'],
		xAxis: {
			type: 'value',
			show: false
		},
		yAxis: {
			type: 'category',
			axisTick: {show: false},
			data: data.map(v => v.name)
		},
		series: [this.getBarSeries({
			name: '人数占比',
			data: data.map(v => v.value),
			label: barLabel
		})]
	});
};
methods.getOption4 = function (data) {
	data.sort((a, b) => {
		return (a.value - b.value)
	});
	return this.getDefaultOption({
		title: {text: '省内游客来源盟市TOP5'},
		tooltip: this.getBarTooltip(),
		grid: barGrid,
		color: ['#2E75B6'],
		xAxis: {
			type: 'value',
			show: false,
		},
		yAxis: {
			type: 'category',
			axisTick: {show: false},
			data: data.map(v => v.name)
		},
		series: [this.getBarSeries({
			name: '人数占比',
			data: data.map(v => v.value),
			label: barLabel
		})]
	});
};
methods.getOption5 = function (data) {
	data.sort((a, b) => {
		return (a.value - b.value)
	});
	return this.getDefaultOption({
		title: {text: '境外游客来源TOP5'},
		tooltip: this.getBarTooltip(),
		grid: barGrid,
		color: ['#FF0000'],
		xAxis: {
			type: 'value',
			show: false
		},
		yAxis: {
			type: 'category',
			axisTick: {show: false},
			data: data.map(v => v.name)
		},
		series: [this.getBarSeries({
			name: '人数占比',
			data: data.map(v => v.value),
			label: barLabel
		})]
	});
};
methods.fetchRender = function () {
	let count = 0;
	let onOver = () => {
		count++;
		if (count === 5) {
			this.slideSubmitOver();
		}
	};
	this.fetchIndex(1, 'sceneryUserSourceDistribute').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserSourceProvTop5').then(onOver).catch(onOver);
	this.fetchIndex(3, 'sceneryUserSourceCityTop5').then(onOver).catch(onOver);
	this.fetchIndex(4, 'sceneryUserSourceProvTop5').then(onOver).catch(onOver);
	this.fetchIndex(5, 'sceneryUserSourceCityTop5').then(onOver).catch(onOver);
};

let computed = {};
computed.tip1 = function () {
	if (!this.data1) {
		return '';
	}
	let list = this.getDataPercent(this.data1);
	return list.map((item) => {
		return item.name + '游客为' + item.value + '人，'
			+ '占比' + item.percent
	}).join('；') + '。';
};

computed.tip2_1 = function () {
	if (!this.data2) {
		return '';
	}
	let copy = tool.extend([], this.data2).sort(this.valueSortFunc);
	let arr = copy.slice(0, 3).map(v => v.name);
	return '省外游客以' + arr.join('、')  + '游客居多';
};
computed.tip2_2 = function () {
	if (!this.data3) {
		return '';
	}
	let copy = tool.extend([], this.data3).sort(this.valueSortFunc);
	let arr = copy.slice(0, 3).map(v => v.name);
	return '其中游客多来自' + arr.join('、');
};
computed.tip2_3 = function () {
	if (!this.data4) {
		return '';
	}
	let copy = tool.extend([], this.data4).sort(this.valueSortFunc);
	let arr = copy.slice(0, 3).map(v => v.name);
	return '省内游客以' + arr.join('、') + '游客居多';
};
computed.tip2_4 = function () {
	if (!this.data5) {
		return '';
	}
	let copy = tool.extend([], this.data5).sort(this.valueSortFunc);
	let arr = copy.slice(0, 3).map(v => v.name);
	return '境外游客多来自' + arr.join('、');
};

computed.tip2 = function () {
	let t1 = this.tip2_1;
	let t2 = this.tip2_2;
	let t3 = this.tip2_3;
	let t4 = this.tip2_4;
	let a = [];
	t1 && a.push(t1);
	t2 && a.push(t2);
	t3 && a.push(t3);
	t4 && a.push(t4);
	if (!a.length) {
		return '';
	}
	return a.join('；') + '。';
};
let watch = {};
const mounted = function () {
	
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		o5: null,
		data5: null
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
	width: 25%;
}
.col-1 {
	padding-right: 9px;
}
.col-2 {
	padding-left: 3px;
	padding-right: 6px;
}
.col-3 {
	padding-left: 6px;
	padding-right: 3px;
}
.col-4 {
	padding-left: 9px;
}
</style>
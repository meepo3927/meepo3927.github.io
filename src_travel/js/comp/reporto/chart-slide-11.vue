<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客通话需求分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-1">
			<p v-html="combinedTip1"></p>
		</div>

		<!-- 图表1和2 -->
		<div class="m-row">
			<div class="m-col col-1">
				<div class="chart-box my-height-1">
					<my-chart :o="o1" />
				</div>
			</div>
			<div class="m-col col-2">
				<div class="chart-box my-height-1">
					<my-chart :o="o2" />
				</div>
			</div>
		</div>

		<div class="mid-tip line-1">
			<p v-html="tip2"></p>
		</div>

		<!-- 图表3 -->
		
		<div class="chart-box my-height-3">
			<my-chart :o="o3" ref="c3" />
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
	// let x = ['0-1分钟', '1-10分钟', '10-60分钟'];
	return this.getDefaultOption({
		title: {text: '景区游客日户均手机通话需求分档'},
		tooltip: this.getPieTooltip(),
		
		series: [this.getPieSeries({
			radius: [35, 60],
			center: ['50%', '60%'],
			data
		})]
	});
};
methods.getOption2 = function (data) {

	let o = this.getDefaultOption({
		title: {
			text: '景区游客日均通话需求分布'
		},
		tooltip: this.getBarTooltip(),
		grid: this.barGrid2(),
		xAxis: EChartUtil.getBarCategoryAxis({
			data: data.map(v => v.name),
			axisLabel: {
				interval: 0,
				formatter: '{value}点'
			}
		}),
		yAxis: {
			type: 'value',
			name: '人'
		},
		series: [this.getBarSeries({
			name: '通话游客数量',
			data: data.map(v => v.value),
			label: {
				normal: {show: false}
			}
		})]
	});
	return o;
};
methods.getOption3 = function (data) {
	let x = data.map(v => v.name);
	let axisParam = EChartUtil.calAxisRotateParam(x, {
		chartWidth: this.$refs.c3.getWidth()
	});
	let grid = this.barGrid3();
	if (axisParam.pad) {
		grid.bottom += axisParam.pad - 15;
	}
	let o = this.getDefaultOption({
		title: {text: '各景区游客通话需求对比'},
		grid,
		tooltip: this.getBarTooltip(),
		xAxis: EChartUtil.getBarCategoryAxis({
			data: x,
			axisLabel: axisParam.label
		}),
		yAxis: {
			type: 'value',
			name: '万人'
		},
		series: [this.getBarSeries({
			name: '通话游客数量',
			data: data.map(v => v.value),
			label: {
				normal: {
					position: 'top'
				}
			}
		})]
	});
	return o;
};
methods.fetchRender = function () {
	let count = 0;
	let onOver = () => {
		count++;
		if (count === 3) {
			this.slideSubmitOver();
		}
	};
	this.fetchIndex(1, 'sceneryUserCallAvgDay').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserCallDistribute').then(onOver).catch(onOver);
	this.fetchIndex(3, 'sceneryUserCallCompare').then(onOver).catch(onOver);
};
let computed = {};
computed.tip1_1 = function () {
	let copy = this.getSortPercentData(this.data1);
	if (!copy) {
		return '';
	}
	return '景区内日户均' + copy[0].name + '的通话游客占比最多，达' + copy[0]._percent;
};
computed.tip1_2 = function () {
	if (!this.data2) {
		return '';
	}
	let copy = tool.copy(this.data2).sort(this.valueSortFunc).slice(0, 3);
	// copy = tool.calPercent(copy);
	let a1 = copy.map((v) => {
		return v.name + '点';
	});
	let a2 = copy.map(v => v.value);
	return a1.join('、') + '是景区游客通话高峰期，'
	 + '人数分别为' + a2.join('、');
};
computed.tip2 = function () {
	let copy = this.getSortPercentData(this.data3);
	if (!copy) {
		return '';
	}
	let first = copy[0].name + '通话需求量最大，达到'
		+ copy[0].value + '万人，占比' + copy[0]._percent;
	let second = '';
	if (copy[1]) {
		second = '排在第二的是' + copy[1].name
		+ '，达到' + copy[1].value + '万人，占比' + copy[1]._percent; 
	}
	return this.combineString(first, second);
};
let watch = {};
const created = function () {};
const mounted = function () {
	
};
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
.my-height-1 {
	height: 273px;
}
.my-height-3 {
	height: 233px
}
</style>
<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区客流来源分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<div class="mid-tip line-2">
			<p v-html="combinedTip1"></p>
		</div>
		<!-- 两个图表 -->
		<div class="m-row">
			<div class="m-col col-1">
				<div class="chart-box height-3-1">
					<my-chart :o="o1"></my-chart>
				</div>
			</div>
			<div class="m-col col-2">
				<div class="chart-box height-3-1">
					<my-chart :o="o2" ref="c2"></my-chart>
				</div>
			</div>
		</div>
		<div class="mid-tip line-1">
			<p v-html="tip2"></p>
		</div>
		<!-- 两个chart -->
		<div class="m-row">
			<div class="m-col col-3">
				<div class="chart-box height-3-2">
					<my-chart :o="o3"></my-chart>
				</div>
			</div>
			<div class="m-col col-4">
				<div class="chart-box height-3-2">
					<my-chart :o="o4"></my-chart>
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
const transformData = (data) => {
	let r = {
		data: [],
		pdata: []
	};
	let totalArray = [];
	for (let i in data) {
		if (i === 'names') {
			r.x = data[i];
		} else {
			r.data.push({
				name: i,
				data: data[i]
			});
			data[i].forEach((v, j) => {
				if (!totalArray[j]) {
					totalArray[j] = 0;
				}
				totalArray[j] += v;
			});
		}
	}

	for (let i = 0; i < r.data.length; i++) {
		let o = r.data[i];
		let item = {
			name: o.name,
			data: []
		};
		o.data.forEach((v, j) => {
			let percent = Math.round((v * 100 * 10) / totalArray[j]) / 10;
			item.data[j] = percent;
		});
		r.pdata.push(item);
	}
	return r;
};
methods.getOption2 = function (data) {
	let r = transformData(data);
	let axisParam = EChartUtil.calAxisRotateParam(r.x, {
		chartWidth: this.$refs.c2.getWidth()
	});
	let grid = {
		left: 15, right: 18,
		bottom: 40,
		containLabel: true
	};
	if (axisParam.pad) {
		grid.bottom += axisParam.pad;
	}
	let label = {
		normal: {
			show: true,
			formatter: (p) => {
				let x = p.seriesIndex;
				let y = p.dataIndex;
				if (p.value < 10) {
					return '';
				}
				return r.data[x].data[y];
			},
			textStyle: {
				fontSize: this.getLabelFontSize(r.x.length)
			}
		}
	};
	return this.getDefaultOption({
		title: {text: '各景区客流来源对比'},
		tooltip: this.getBarTooltip(),
		grid,
		xAxis: EChartUtil.getBarCategoryAxis({
			data: r.x,
			axisLabel: axisParam.label
		}),
		legend: this.getCommonLegend({
			data: r.data.map(v => v.name)
		}),
		yAxis: this.get100PercentYAxis(),
		series: r.pdata.map((v) => {
			return this.getBarSeries2({
				stack: 'main',
				name: v.name,
				data: v.data,
				label
			});
		})
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
	bottom: 10,
	containLabel: true
};
methods.getOption3 = function (data) {
	data.sort((a, b) => {
		return (a.value - b.value)
	});
	return this.getDefaultOption({
		title: {text: '省外游客来源省TOP5'},
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
methods.fetchRender = function () {
	let count = 0;
	let onOver = () => {
		count++;
		if (count === 4) {
			this.slideSubmitOver();
		}
	};
	this.fetchIndex(1, 'sceneryUserSourceDistribute').then(onOver).catch(onOver);
	this.fetchIndex(2, 'sceneryUserSourceCompare').then(onOver).catch(onOver);
	this.fetchIndex(3, 'sceneryUserSourceProvTop5').then(onOver).catch(onOver);
	this.fetchIndex(4, 'sceneryUserSourceCityTop5').then(onOver).catch(onOver);
};

let computed = {};
computed.tip1_1 = function () {
	if (!this.data1) {
		return '';
	}
	let outTotal = 0;
	let allTotal = 0;
	this.data1.forEach((v) => {
		if (v.name.indexOf('外') >= 0) {
			outTotal += v.value;
		}
		allTotal += v.value;
	});
	let outPercent = tool.getPercent(outTotal, allTotal);
	let outStr = [];
	this.data1.forEach((v) => {
		if (v.name.indexOf('外') >= 0) {
			let percent = tool.getPercent(v.value, allTotal);

			// 排除掉0%的
			if (percent !== '0%') {
				outStr.push(v.name + '游客占比' + percent);
			}
			
		}
	});
	outStr = outStr.join('，');
	return `景区接待外地游客占比${outPercent}，其中${outStr}`;
};
computed.tip1_2 = function () {
	let copy2 = tool.extend({}, this.data2);
	let names = copy2.names;
	if (!names || names.length <= 1) {
		return '';
	}
	let a = [];
	for (let i = 0; i < names.length; i++) {
		let name = names[i];
		let v = 0;
		for (let key in copy2) {
			if (key.indexOf('外') >= 0) {
				v += copy2[key][i];
			}
		}
		a.push({name, value: v});
	}

	a.sort(this.valueSortFunc);
	let msg = '外地游客更喜欢游览' + a[0].name;
	if (a[1]) {
		msg += '和' + a[1].name;
	}

	return msg;
};

computed.tip2_1 = function () {
	if (!this.data3) {
		return '';
	}
	let copy = tool.extend([], this.data3).sort(this.valueSortFunc);

	return [
		'省外游客以' + copy[0].name + '、' + copy[1].name + '游客居多'
	].join('');
};
computed.tip2_2 = function () {
	if (!this.data4) {
		return '';
	}
	let copy = tool.extend([], this.data4).sort(this.valueSortFunc);

	return [
		'省内游客以' + copy[0].name + '、' + copy[1].name + '游客居多'
	].join('');
};

computed.tip2 = function () {
	let t1 = this.tip2_1;
	let t2 = this.tip2_2;
	let a = [];
	if (t1) {
		a.push(t1);
	}
	if (t2) {
		a.push(t2);
	}
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
	width: 40%;
}
.col-2 {
	padding-left: @report-chart-pad;
	width: 60%;
}
.col-3 .chart-box,
.col-4 .chart-box {
}
.col-3 {
	padding-right: @report-chart-pad;
	width: 50%;
}
.col-4 {
	padding-left: @report-chart-pad;
	width: 50%;
}
</style>
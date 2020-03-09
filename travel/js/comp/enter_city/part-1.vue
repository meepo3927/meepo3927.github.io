<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box fl x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />

		<div class="btn-group ml30">
			<button class="btn-big" v-for="(v, key) in vConfig.homeMap"
				:class="{active: userType === key}"
				@click="switchUserType(key)"
				v-text="v"></button>
		</div>
	</div>
	<!-- chart -->
	<div class="x-body" >
		<div class="chart-1">
			<my-chart :o="o1" />
		</div>

		<div class="chart-2">
			<my-chart :o="o2" />
		</div>

		<div class="chart-3">
			<my-chart :o="o3" />
		</div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';
import MDate from 'lib/mdate.js';

var methods = {};
methods.getOption2 = function (data) {
	let defaults = {
		title: {
			text: '日均客流量分析',
			subtext: this.subtext
		},
		xAxis: {
			type: 'category',
			data: data.map((v) => v.name)
		},
		yAxis: {
			type: 'value'
		},
		series: [EchartUtil.getBarSeries({
			name: '客流量',
			data: data.map((v) => v.value),
			barMaxWidth: 80
		})]
	};
	return EchartUtil.getXYOption(defaults);
};
methods.getOption3 = function (data = []) {
	let areaStyle = {
		normal: {}
	};
	let seriesArray = data.map((v) => {
		return {
			type: 'line',
			name: v.name,
			data: v.data,
			areaStyle
		};
	});
	let defaults = {
		title: {
			text: '各时段客流量分析',
			subtext: this.subtext
		},
		legend: {
			data: data.map((v) => v.name),
			left: 'center',
			top: 16
		},
		xAxis: {
			type: 'category',
			data: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((v) => {
				return v + '点';
			}),
			boundaryGap: false,
			axisLabel: {
			}
		},
		yAxis: {
			type: 'value'
		},
		series: seriesArray
	};

	return EchartUtil.getXYOption(defaults);
};
methods.render = function (i) {
};
methods.fetchRender = function () {
	let p = {
	    start_date: this.startDatetime,
	    end_date: this.endDatetime,
	    userType: this.getUserTypeParam(),
	    scenery_city: this.id
	};

	this.o1 = null;
	this.o2 = null;
	this.o3 = null;
	request.vwRptNmTravelerDaily(p).then((r) => {
		let data0 = r[0];

		// 图1
		this.o1 = chartUtil.vwRptNmOutProvDaily({
			title: {
				text: '各日客流量发展分析',
				subtext: this.subtext
			}
		}, {data: data0});

		// 图2
		let data1 = r[1];
		this.o2 = this.getOption2(data1);

		// 图3
		let data2 = r[2];
		this.o3 = this.getOption3(data2);
	}).catch((e) => {
		this.o1 = 'empty';
		this.o2 = 'empty';
		this.o3 = 'empty';
	});
};
var computed = {};

var mounted = function () {
	this.fetchRender();
	this.$on('onDateChange', () => {
		this.fetchRender();
	});
};
const beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		o1: null,
		o2: null,
		o3: null
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	mixins: [
		require('./part-mix.js'),
		require('comp/chart_layer/the_common_mix.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@import "../../ref.less";
.analysis-part {
}
.chart-1 {
	height: 50%;
	padding-bottom: @chart-layer-gap;
}
.chart-2,
.chart-3 {
	height: 50%;
	width: 50%;
	padding-top: @chart-layer-gap;
	float: left;
}
.chart-2 {
	padding-right: @chart-layer-gap;
}
.chart-3 {
	padding-left: @chart-layer-gap;
}
</style>
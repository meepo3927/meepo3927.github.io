<template>
<div class="realtime-monitor">
	<div class="x-wrapper">
		<h4 class="layer-top-title" v-text="title"></h4>
		<a href="javascript:;" class="max-btn layer-icon-btn" @click="openBig">
			<i class="fa fa-window-maximize"></i>
		</a>
		<a href="javascript:;" class="layer-close-btn" @click="close"><i class="fa fa-times"></i></a>
		<!-- 切换按钮 -->
		<div class="btn-group pv10 pl10">
			<button type="button" class="btn" :class="{active: active === 1}"
				@click="toggle(1)">景点流量监控</button>
			<button type="button" class="btn" :class="{active: active === 2}"
				@click="toggle(2)">迁入/迁出流量分析</button>
		</div>
		<!-- charts -->
		<my-chart :o="o" class="chart-1 chart-holder" 
			v-if="active === 1" key="c1" />
		<my-chart :o="o" class="chart-2 chart-holder" 
			v-if="active === 2" key="c2" />
	</div>
</div>
</template>

<script>
import request from 'util/request';
import tool from 'util/tool';
import chartUtil from 'util/chart';
import config from 'global/config';
import echarts from 'echarts';
import loading from 'util/loading';
var methods = {};
methods.openBig = function () {
	this.$emit('open-big');
};
methods.getChartRequest = function (n) {
	if (!this.chartRequest[n]) {
		// 图表2，指定了某景区
		if (n === 2 && this.param2 && this.param2.placeID) {
			this.chartRequest[n] = request.getAttractionRealtime2(this.param2.placeID);
		} else {
			this.chartRequest[n] = request['getCityRealtime' + n](this.options.id);
		}
	}
	return this.chartRequest[n];
};
methods.getOption1 = function (data) {
	let list = [];
	if (this.param1.length === 0) {
		list = data;
	} else {
		data.forEach((v) => {
			if (this.param1.indexOf(v.sceneryId) >= 0) {
				list.push(v);
			}
		});
	}
	return chartUtil.getDynamicLineCityOption(list);
};
methods.render_1 = function (options = {}) {
	if (options.mode !== 'refresh') {
		this.o = null;
	}
	this.getChartRequest(1).then((result) => {
		this.o = this.getOption1(result);
	}).catch((r) => {
		this.o = 'empty';
	});
};
methods.render_2 = function (options = {}) {
	if (options.mode !== 'refresh') {
		this.o = null;
	}
	this.getChartRequest(2).then((result) => {
		// var option = chartUtil.getMonitorCityInoutParallelOption({data: result});
		let first = result[0];
		this.o = chartUtil.getAttractionInOutOption({
		    titleOption: chartUtil.getTitleOption(first.sceneryName, '迁入/迁出流量分析'),
		    data: result
		});
	}).catch((r) => {
		this.o = 'empty';
	});
};
methods.render = function (options = {}) {
	this.reset();
	this.active = 1;
	this.options = options;
	this.$nextTick(() => {
		this.render_1();
	});
};
var computed = {};
computed.title = function () {
	return this.areaName + '实时客流量';
};
const created = function () {
	this.$on('big-render-option', (index, param) => {
		if (index === 1) {
			this.param1 = param.map((v) => {
				return v.sceneryId;
			});
			if (this.active === 1) {
				this.render_1();
			}
		} else if (index === 2) {
			this.param2 = param;
			this.chartRequest[2] = null;
			if (this.active === 2) {
				this.render_2();
			}
		}
	});
};
var mounted = function () {};
let dataFunc = function () {
	var o = {
		param1: [],
		active: 0
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	mixins: [require('mixins/realtime.js')],
	props: ['areaName'],
	created,
	mounted,
	components: {
	}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
.realtime-monitor {
	.chart-1 {
		padding-top: 1px;
		height: 320px;
	}
	.chart-2 {
		padding-top: 1px;
		height: 320px;
	}
}
</style>
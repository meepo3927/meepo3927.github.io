<template>
<div class="realtime-monitor">
	<div class="x-wrapper">
		<h4 class="layer-top-title" v-text="title"></h4>
		<a href="javascript:;" class="layer-close-btn" @click="close"><i class="fa fa-times"></i></a>
		<a href="javascript:;" class="max-btn layer-icon-btn" @click="openBig">
			<i class="fa fa-window-maximize"></i>
		</a>
		<!-- 切换按钮 -->
		<div class="btn-group pv10 pl10">
			<button type="button" class="btn" :class="{active: active === 1}"
				@click="toggle(1)">景区流量监控</button>
			<button type="button" class="btn" :class="{active: active === 2}"
				@click="toggle(2)">迁入/迁出流量分析</button>
			<button type="button" class="btn" :class="{active: active === 3}"
				@click="toggle(3)">景区客流来源排行</button>
		</div>
		<!-- charts -->
		<my-chart class="chart-1" :o="o" v-if="active === 1" key="c1" />
		<my-chart class="chart-2" :o="o" v-if="active === 2" key="c2" />
		<my-chart class="chart-3" :o="o" v-if="active === 3" key="c3" />
		
	</div>
</div>
</template>

<script>
import request from 'util/request';
import tool from 'util/tool';
import chartUtil from 'util/chart';
import loading from 'util/loading';
import echarts from 'echarts';
var config = require('global/config');
var methods = {};
methods.openBig = function () {
	this.$emit('open-big');
};
methods.getTitleOption = function (title) {
	return {
		text: title,
		subtext: this.areaName,
		textStyle: {
			fontSize: 16
		}
	};
};
methods.getChartRequest = function (n) {
	if (!this.chartRequest[n]) {
		this.chartRequest[n] = request['getAttractionRealtime' + n](this.options.id);
	}
	return this.chartRequest[n];
};
methods.render_1 = function (options = {}) {
	if (options.mode !== 'refresh') {
		this.o = null;
	}
	this.getChartRequest(1).then((result) => {
		this.o = chartUtil.getHumanTrafficOption({
			title: this.getTitleOption('景区实时客流量'),
			data: result
		});
	}).catch((r) => {
		this.o = 'empty';
	});
};
methods.render_2 = function (options = {}) {
	if (options.mode !== 'refresh') {
		this.o = null;
	}
	this.getChartRequest(2).then((result) => {
		this.o = chartUtil.getAttractionInOutOption({
			titleOption: this.getTitleOption('迁入/迁出实时人数'),
			data: result || []
		});
	}).catch((r) => {
		this.o = 'empty';
	});
};
methods.render_3 = function (options = {}) {
	if (options.mode !== 'refresh') {
		this.o = null;
	}
	require.ensure([], () => {
		require('lib/geo/china.js');
		require('lib/geo/neimenggu.js');
		request.getAttractionSource1(this.options.id).then((result) => {
			this.o = chartUtil.getAttractionSource1Option({
				data: result || [],
				mini: true
			});
		}).catch((r) => {
			this.o = 'empty';
		});
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
var mounted = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	mixins: [require('mixins/realtime.js')],
	props: ['areaName'],
	mounted,
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
.realtime-monitor {
	@c-height: 320px;
	.chart-1 {
		height: @c-height;
	}
	.chart-2 {

		height: @c-height;
	}
	.chart-3 {

		height: @c-height;
	}
}
</style>
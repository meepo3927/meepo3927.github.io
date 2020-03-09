<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label v-if="type !== 3">选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)"
			v-if="type !== 3" />
		<!-- 往前日期 -->
		<datepicker-2 v-if="type === 3" class="style-inline" 
			ref="datePicker2"
			@change="onDate2Change" />

		<span class="mh10" v-if="type === 3">的</span>
		<select class="select-big ver-top" v-model="sumType" v-if="type === 3"
			@change="render3">
			<option value="0">使用人数</option>
			<option value="1">使用流量</option>
		</select>

		<!-- 切换type -->
		<div class="btn-group ml25">
			<button type="button" class="btn-big" :class="{active: type === 1}"
				@click="render(1)">综合分析</button>
			<button type="button" class="btn-big" :class="{active: type === 2}"
				@click="render(2)">特征分析</button>
			<button type="button" class="btn-big" :class="{active: type === 3}" 
				@click="render(3)">互联网偏好分析</button>
		</div>

		<!-- 维度 -->
		<div class="btn-group ml25" v-if="type === 2 || type === 3">
			<button class="btn-big" v-for="(v, k) in vConfig.homeMap"
				:class="{active: userType === k}"
				@click="switchUserType(k)" 
				v-text="v"></button>
		</div>
	</div>
	<div class="x-body oy-auto">
		<!-- 综合分析 -->
		<div class="my-chart" ref="c1" v-if="chartOneVisible" 
			key="c1"></div>

		<!-- 饼图列表 -->
		<ul class="pie-chart-list" v-if="type === 2 && pieListData">
			<li v-for="(v, i) in pieListData">
				<pie-chart :data="v" :name="getPieName(i)" 
					:data-title="getPieTitle(i)"></pie-chart>
			</li>
		</ul>
		<my-chart v-if="view.loading":o="loadingOptions" />
		<!-- 互联网偏好分析 词云 -->
		<div class="word-cloud-box" v-if="type === 3" key="wordCloud">
			<word-cloud-chart :data="wordCloudData"></word-cloud-chart>
		</div>

		<!-- 互联网偏好分析 柱图 -->
		<ul class="bar-chart-list" v-if="type === 3 && barListData">
			<li v-for="(v, i) in barListData">
				<horz-bar-chart :data="v.chart" :name="getBarName(i)"
					:data-title="getTitle(v)"></horz-bar-chart>
			</li>
		</ul>
		

		<!-- 单项分析 -->
		<ul class="chart-box three-pie-list" v-if="type === 222">
			<li><div class="my-chart " ref="one"></div></li>
			<li><div class="my-chart" ref="two"></div></li>
			<li><div class="my-chart" ref="three"></div></li>
		</ul>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
import config from 'global/config';
import Promise from 'Promise';

var DateUtil = MDate.Util;
var methods = {};
methods.render = function (type) {
	if (type === this.type) {
		return;
	}
	this.type = type;
	this.userType = '0';
	if (this.type !== 3) {
		this.$nextTick(this.fetchRender);
	}
};
// 综合分析
methods.delayRender1 = function (data) {
	this.$nextTick(() => {
		this.renderAllType(data);
	});
};
methods.renderAllType = function (data) {
	var option = chartUtil.getCityAnalysisUserAllType({
		data: data,
		visualMap: true,
		title: {
			text: '景区当日游客性别、年龄、ARPU 综合分析',
			subtext: this.subtitle
		}
	});
	chartUtil.initChart(this.$refs.c1, option);
};
methods.getRequestParam = function () {
	// 只有一个日期
    return [this.id, this.startDatetime, null, config.user.id];
};

methods.render1 = function () {
	this.view.loading = true;
	this.loadingOptions = null;
	return this.autoTryWrapper(() => {
		let param = this.getRequestParam();
		return request.getCityAnalysisUserAllType(...param).then((result) => {
			this.view.loading = false;
			this.delayRender1(result);
		});
	}, (e) => {
		this.loadingOptions = 'empty';
	});
};
// 特征分析
methods.render2 = function (options = {}) {
	this.view.loading = true;
	this.loadingOptions = null;
	this.pieListData = null;

	return this.autoTryWrapper(() => {
		let p = this.getUserLevRequestParam();
		return request.vwRptSceneryUserLevDay(p).then((r) => {
			if (r[0] && r[0].length) {
				this.view.loading = false;
				this.pieListData = r;
			} else {
				return Promise.reject(r);
			}
		})
	}, () => {
		this.loadingOptions = 'empty';
	});
};

// 互联网偏好分析
methods.render3 = function (options = {}) {
	this.loadingOptions = null;
	this.view.loading = true;
	this.barListData = null;
	this.wordCloudData = null;
	this.autoTryWrapper2(() => {
		let p = this.getNetPreferRequestParam();
		return request.vwRptSceneryNetPreferDay(p).then((r) => {
			this.view.loading = false;
			this.barListData = r.slice(0,12);
			this.wordCloudData = r.slice(12,13)[0] || [];
		});
	}, () => {
		this.loadingOptions = 'empty';
		this.wordCloudData = [];
	});
};

methods.fetchRender = function () {
	var m = 'render' + this.type;
	this[m] && this.$nextTick(this[m]);
};
methods.onDate2Change = function (p, startEnd) {
	this.startEndDate = startEnd;
	if (this.dateChangeDisabled) {
		return;
	}
	this.render3();
};
var computed = {};
computed.chartOneVisible = function () {
	return (this.type === 1 && !this.view.loading);
};
var mounted = function () {
	this.fetchRender();
	this.$on('onDateChange', function () {
		this.fetchRender();
	});
};
const beforeDestroy = function () {};
let dataFunc = function () {
	var date = new Date();
	var startDate = DateUtil.getDateOffset(date, -1);
	var o = {
		loadingOptions: null,
		type: 1,
		startDatetime:  DateUtil.getYMD(startDate)
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
		require('mixins/analysis_part.js'),
		require('comp/chart_layer/user_lev_mix.js'),
		require('comp/chart_layer/net_prefer_mix.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.analysis-part {
}

.three-pie-list {
	height: 100%;
}

</style>
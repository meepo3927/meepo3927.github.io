<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<!-- 特征分析 -->
		<datepicker-2 class="style-inline" @change="onDate2Change"
			ref="datePicker2"></datepicker-2>
		<!-- 互联网偏好分析 -->
		<span class="mh10" v-if="type === 2">的</span>
		<select class="select-big ver-top" v-model="sumType" v-if="type === 2"
			@change="render2">
			<option value="0">使用人数</option>
			<option value="1">使用流量</option>
		</select>

		<!-- 切换type -->
		<div class="btn-group ml25" >
			<button type="button" class="btn-big" :class="{active: type === 1}"
				@click="render(1)">特征分析</button>
			<button type="button" class="btn-big" :class="{active: type === 2}" 
				@click="render(2)">互联网偏好分析</button>
		</div>
	</div>
	<!-- chart -->
	<div class="x-body oy-auto" >
		<my-chart v-if="view.loading":o="loadingOptions" />
		<!-- 特征分析 -->
		<ul class="pie-chart-list" v-if="type === 1 && pieListData">
			<li v-for="(v, i) in pieListData">
				<pie-chart :data="v" :name="getPieName(i)" 
					:data-title="getPieTitle(i)"></pie-chart>
			</li>
		</ul>

		<!-- 互联网偏好分析 词云 -->
		<div class="word-cloud-box" v-if="type === 2" key="wordCloud">
			<word-cloud-chart :data="wordCloudData"></word-cloud-chart>
		</div>
		<!-- 互联网偏好分析 柱图 -->
		<ul class="bar-chart-list" v-if="type === 2 && barListData">
			<li v-for="(v, i) in barListData">
				<horz-bar-chart :data="v.chart" :name="getBarName(i)"
					:data-title="getTitle(v)"></horz-bar-chart>
			</li>
		</ul>
		
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
import Promise from 'Promise';

var DateUtil = MDate.Util;
var methods = {};
methods.render = function (type) {
	if (type === this.type) {
		return;
	}
	this.type = type;
	this.userType = '0';
	this.$nextTick(this.fetchRender);
};
methods.getParam1 = function () {
	let p = {
	    user_id: this.vConfig.user.id,
	    scenery_city: this.id,
	    userType: this.getUserTypeParam(),
	    deal_date: this.dateParam.deal_date,
	    cycle: this.dateParam.cycle,
	    // start_date: this.startEndDate.start_date,
	    // end_date: this.startEndDate.end_date,
		dim: 'outside'
	};

	return p;
};
methods.render1 = function (options = {}) {
	this.loadingOptions = null;
	this.view.loading = true;
	this.pieListData = null;

	this.autoTryWrapper3(() => {
		let p = this.getParam1();
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
methods.render2 = function (options = {}) {
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
		})
	}, () => {
		this.loadingOptions = 'empty';
		this.wordCloudData = [];
	});
};
methods.fetchRender = function () {
	this.callTypeRender();
};
methods.onDate2Change = function (p, startEnd) {
	this.dateParam = p;
	this.startEndDate = startEnd;
	if (this.dateChangeDisabled) {
		return;
	}
	this.fetchRender();
};
var computed = {};
computed.userLevPieTitlePrefix = function () {
	return '';
};
computed.userLevPieSubTitle = function () {
	return this.subtext;
};
computed.netPreferBarTitlePrefix = function () {
	return '游客'
};
var mounted = function () {

};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		type: 1,
		dateParam: {},
		loadingOptions: null
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
</style>
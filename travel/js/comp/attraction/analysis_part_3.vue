<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<!-- 选择单日期 -->
		<label v-if="isType1_2">选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" 
			v-if="isType1_2" />
		<!-- 往前日期 -->
		<datepicker-2 v-if="isType3" class="style-inline" 
			ref="datePicker2"
			@change="onDate2Change" />
		<span class="mh10" v-if="isType3">的</span>
		<select class="select-big ver-top" v-model="sumType" v-if="isType3"
			@change="render3">
			<option value="0">使用人数</option>
			<option value="1">使用流量</option>
		</select>

		<div class="btn-group ml25" >
			<button class="btn-big" :class="{active: isType1}" 
				@click="render(1)">综合分析</button>
			<button class="btn-big" :class="{active: isType2}" 
				@click="render(2)">特征分析</button>
			<button class="btn-big" :class="{active: isType3}" 
				@click="render(3)">互联网偏好分析</button>
		</div>

		<!-- 维度 -->
		<div class="btn-group ml25" v-if="isType2_3">
			<button class="btn-big" v-for="(v, k) in vConfig.homeMap"
				:class="{active: userType === k}"
				@click="switchUserType(k)" 
				v-text="v"></button>
		</div>

	</div>
	<!-- chart -->
	<div class="chart-wrapper x-body oy-auto">

		<!-- 图1 -->
		<my-chart :o="o" v-if="isType1" />

		<!-- 图2 -->
		<ul class="pie-chart-list" v-if="isType2 && pieListData">
			<li v-for="(v, i) in pieListData">
				<pie-chart :data="v" :name="getPieName(i)" 
					:data-title="getPieTitle(i)"></pie-chart>
			</li>
		</ul>
		<my-chart v-if="view.loading":o="loadingOptions" />

		<!-- 互联网偏好分析 词云 -->
		<div class="word-cloud-box" v-if="isType3 && wordCloudData" key="wordCloud">
			<word-cloud-chart :data="wordCloudData"></word-cloud-chart>
		</div>
		<!-- 图3 -->
		<ul class="bar-chart-list" v-if="isType3 && barListData">
			<li v-for="(v, i) in barListData">
				<horz-bar-chart :data="v.chart" :name="getBarName(i)"
					:data-title="getTitle(v)"></horz-bar-chart>
			</li>
		</ul>

		<!-- 图2 (暂时没有) -->
		<ul class="chart-box three-pie-list" v-if="type === 4">
			<li>
				<div class="my-chart " ref="one"></div>
			</li>
			<li>
				<div class="my-chart" ref="two"></div>
			</li>
			<li>
				<div class="my-chart" ref="three"></div>
			</li>
		</ul>
		
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
import Promise from 'lib/promise.js';
import EchartUtil from 'util/echart.js';
import config from 'global/config';

var DateUtil = MDate.Util;
var methods = {};

methods.getRequestParam = function () {
	// 只有一个日期
    return [this.id, this.startDatetime, null, config.user.id];
};
methods.render = function (num) {
	if (num === this.type) {
		return;
	}
	this.type = num;
	this.userType = '0';
	if (this.type !== 3) {
		this.$nextTick(this.fetchRender);
	}
};
// 综合分析
methods.render1 = function (options = {}) {
	this.o = null;
	return this.autoTryWrapper(() => {
		let param = this.getRequestParam();
		return request.getAttractionCountAllType(...param).then((result) => {
			this.o = chartUtil.getAttractionCountAllType({
				data: result,
				visualMap: true,
				title: {
					text: '景区当日游客性别、年龄、ARPU 综合分析',
					subtext: this.subtitle
				}
			});
		});
	}, () => {
		this.o = 'empty';
	});
};

methods.render2 = function (options = {}) {
	this.loadingOptions = null;
	this.view.loading = true;
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
	this.disposeCharts();
	this[m] && this[m]();
};
methods.onDate2Change = function (p, startEnd) {
	this.startEndDate = startEnd;
	if (this.dateChangeDisabled) {
		return;
	}
	this.render3();
};
var computed = {};
computed.isType1 = function () {
	return (this.type === 1);
};
computed.isType2 = function () {
	return (this.type === 2);
};
computed.isType3 = function () {
	return (this.type === 3);
};
computed.isType1_2 = function () {
	return (this.isType1 || this.isType2);
};
computed.isType2_3 = function () {
	return (this.isType2 || this.isType3);
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
		type: 1,
		loadingOptions: null,
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
@pie-chart-height: 300px;
.three-pie-list {
	height: 100%;
}

</style>
<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box fl x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<!--<span class="d-span">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />-->
		<select class="select-big ml15" v-model="cycle">
			<option value="1">近一周</option>
			<option value="2">半个月</option>
			<option value="3">一个月</option>
		</select>
		<div class="btn-group ml30">
			<button class="btn-big" v-for="(v, key) in vConfig.homeMap"
				:class="{active: userType === key}"
				@click="switchUserType(key)"
				v-text="v"></button>
		</div>
		<button class="btn-big ml15" @click="render" >查询</button>
	</div>
	<!-- chart -->
	<div class="x-body" v-if="o !== undefined">
		<my-chart :o="o" />
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
import Promise from 'lib/promise.js';
import EchartUtil from 'util/echart.js';

var DateUtil = MDate.Util;
var methods = {};
methods.getSankeyOption = function (data) {
	let links = data.links;
	for (let i = links.length - 1; i >= 0; i--) {
		let item = links[i];
		if (item.source === item.target) {
			links.splice(i, 1);
		}
	}
	return chartUtil.getAttractionPathOption({
		title: chartUtil.getTitleOption('景区来源去向分析', this.subtitle),
	    series: [{
	    	top: 60,
	    	left: 35,
			right: 150,
            data: data.nodes,
            links: data.links
        }]
	});
};
methods.render = function () {
	let p = {
		start_date: this.startDatetime,
		userType: this.getUserTypeParam(),
		cycle: this.cycle,
		scenery_ids: this.id
	};
	this.o = null;
	let pm = request.getActionJSON('/v2/scenerySourceLeaveAnalyze', p);
	request.U(pm).then((result) => {
		// LOG(result);
		this.o = this.getSankeyOption(result);
	}).catch((e) => {
		this.o = EchartUtil.empty();
		LOG(e);
	});
};
methods.fetchRender = function () {
};
var computed = {};

var mounted = function () {
	this.render();
};
const beforeDestroy = function () {};
let dataFunc = function () {
    var date = new Date();
    var startDate = DateUtil.getDateOffset(date, -2);
	var o = {
		type: 1,
		cycle: 1,
		o: undefined,
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
		require('comp/chart_layer/the_common_mix.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.analysis-part {
}
.btn-big {
	vertical-align: top;
}
.select-big {
	vertical-align: top;
}
</style>
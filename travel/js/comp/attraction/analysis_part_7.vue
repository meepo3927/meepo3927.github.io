<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span">近3天</span>
		<!--
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />
		-->
		<div class="btn-group ml30">
			<button class="btn-big" v-for="(v, key) in vConfig.homeMap"
				:class="{active: userType === key}"
				@click="switchUserType(key)"
				v-text="v"></button>
		</div>

		<button class="btn-big ml15" @click="render" >查询</button>
	</div>
	<div class="x-body" v-if="o !== undefined">
		<my-chart :o="o" theme="dark" />
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
import config from 'global/config';
var DateUtil = MDate.Util;

var methods = {};
methods.fetchRender = function () {
	let p = {
		start_date: this.startDatetime.replace(/-/g, ''),
		// end_date: this.endDatetime.replace(/-/g, ''),
		userType: this.getUserTypeParam(),
		scenery_ids: this.id
	};
	this.o = null;
	let req = request.sceneryRelationAnalyze(p);
	request.U(req).then((r) => {
		// LOG('data:', r);
		this.o = chartUtil.getGraphOption({
			title: chartUtil.getTitle('景区关联分析', this.subtitle),
			legend: {
				data: r.categories.map((a) => a.name)
			},
			series: [{
				name: '景区关联',
				categories: r.categories,
			}]
		}, r);
	}).catch((e) => {
		this.o = 'empty';
		LOG(e);
	});
};
methods.render = function () {
	this.$nextTick(this.fetchRender);
};

var computed = {};
var mounted = function () {
	this.fetchRender();
};
const beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		o: undefined
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
.btn-big {
	vertical-align: top;
}
</style>
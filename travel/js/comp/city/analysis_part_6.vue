<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box x-head">
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
	<div class="x-body ">
		<my-chart :o="o" />
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
	let data = request.getGraphData();
	var categories = [];
	for (var i = 0; i < 9; i++) {
		categories[i] = {
			name: '类目' + i
		};
	}
	this.o = chartUtil.getGraphOption({
		title: chartUtil.getTitle('景区关联分析', this.subtitle),
		legend: {
			data: categories.map((a) => a.name)
		},
		series: [{
			name: '景区关联',
			categories: categories,
		}]
	}, data);
};

var computed = {};

var mounted = function () {
	this.fetchRender();
	this.$on('onDateChange', function () {
		this.fetchRender();
	});
};
const beforeDestroy = function () {};
let dataFunc = function () {

	var o = {
		o: null
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

</style>
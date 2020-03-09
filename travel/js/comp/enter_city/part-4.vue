<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box fl x-head">
		<datepicker-2 @change="onDateChange" ref="datePicker2" />
	</div>
	<!-- chart -->
	<div class="x-body" >
		<div v-for="i in 4" class="chart-box" :class="['box-' + i]">
			<my-chart :o="o[i - 1]"></my-chart>
		</div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';
import MDate from 'lib/mdate.js';
import Promise from 'Promise';

var methods = {};
methods.getParam = function () {
	// deal_date, cycle
	let p = this.$refs.datePicker2.getParam();
	p.scenery_city = this.id;
	p.dim = 'roma';
	return p;
};

const titleArray = [
	'全部', '境外', '省外', '省内'
];
methods.fetchRender = function () {
	const reject = (e) => {
		LOG(e);
		this.o = [
			EchartUtil.empty(), EchartUtil.empty(),
			EchartUtil.empty(), EchartUtil.empty()
		];
	};
	const resolve = (r) => {
		r.forEach((data, i) => {
			if (data && data.length) {
				var option = chartUtil.rptSiteLongDailyPie({
					title: {
						text: titleArray[i] + '游客逗留天数分布',
						subtext: this.getCycleSubtext()
					}
				}, {data});
			} else {
				option = EchartUtil.empty();
			}
			this.o.splice(i, 1, option);
		});
	};
	this.o = [null, null, null, null];
	this.autoTryWrapper3(() => {
		let param = this.getParam();
		let req = request.r1('/v2/touristStayTimeAnalyze', param);
		return request.U(req).then((r) => {
			if (r[0] && r[0].length) {
				resolve(r);
			} else {
				return Promise.reject(r);
			}
		})
	}, reject);
};
methods.onDateChange = function () {
	if (this.dateChangeDisabled) {
		return;
	}
	this.fetchRender();
};
var computed = {};

var mounted = function () {
};
const beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		o: [
			null, null, null, null
		]
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
		require('./part-mix.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@import "../../ref.less";
.analysis-part {
}
.chart-box {
	width: 50%;
	height: 50%;
	float: left;
}
.box-1 {
	padding-right: @chart-layer-gap;
	padding-bottom: @chart-layer-gap;
}
.box-2 {
	padding-left: @chart-layer-gap;
	padding-bottom: @chart-layer-gap;
}
.box-3 {
	padding-right: @chart-layer-gap;
	padding-top: @chart-layer-gap;
}
.box-4 {
	padding-left: @chart-layer-gap;
	padding-top: @chart-layer-gap;
}
</style>
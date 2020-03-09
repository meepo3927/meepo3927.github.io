<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客互联网偏好分析 (1)</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>

		<ul class="bar-list clearfix">
			<li>
				<my-chart :o="o1" />
			</li>
			<li>
				<my-chart :o="o2" />
			</li>
			<li>
				<my-chart :o="o3" />
			</li>
		</ul>

		<ul class="bar-list clearfix">
			<li>
				<my-chart :o="o4" />
			</li>
			<li>
				<my-chart :o="o5" />
			</li>
			<li>
				<my-chart :o="o6" />
			</li>
		</ul>
	</div>
</div>
</template>

<script>
import request from 'util/request.js';
import EChartUtil from 'util/echart.js';
import tool from 'util/tool.js';

let methods = {};
const titlePrefix = '景区游客热门';
const titleArr = [
	titlePrefix + '网站',
	titlePrefix + 'APP',
	titlePrefix + '旅游类APP',
	titlePrefix + '网购APP',
	titlePrefix + '支付偏好',
	titlePrefix + '美食团购APP'
];
methods.makePPTSlide = function (pptx) {
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxCommonChartSlideProcess(slide, pptx);
	return slide;
};
methods.getMyOption = function (data, i) {
	data.sort(this.valueSortFuncDec);
	return this.getPreferBarOption({
		title: {text: titleArr[i]},
		xAxis: {
			axisLabel: {
				formatter: (v) => {
					if (v >= 10000) {
						return (Math.round(v / 1000) / 10) + '万'
					}
					return v;
				}
			}
		},
		yAxis: {
			data: data.map(v => v.name)
		},
		series: [this.getBarSeries({
			data: data.map(v => v.value)
		})]
	});
};
methods.fetchRender = function () {
	let R = this.$parent.requests;
	R['13'].then((r) => {
		r.slice(0, 6).forEach((data, i) => {
			let n = i + 1;
			this['o' + n] = this.getMyOption(data, i);
		});
		this.slideSubmitOver();
	}).catch((e) => {
		for (let i = 1; i <= 6; i++) {
			this['o' + i] = 'empty';
		}
		this.slideSubmitOver();
	});
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		o5: null,
		o6: null
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('./slide_mix.js'),
		require('./prefer_mix.js')
	],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../ref.less";
.chart-slide {}
</style>
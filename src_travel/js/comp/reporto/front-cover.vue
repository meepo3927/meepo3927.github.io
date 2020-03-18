<template>
<div class="chart-slide report-slide-box front-cover">
	<h1 class="slide-h1" v-text="h1Text"></h1>
	<p>
		内蒙古移动旅游大数据平台<br />
		{{dateStr}}
	</p>
	<img :src="logoSrc1" class="only-style-1 v-logo" />
	<img :src="logoSrc2" class="only-style-2 b-logo" />
	<img :src="logoSrc2" class="only-style-3 b-logo" />
</div>
</template>

<script>
var methods = {};
methods.makePPTSlide = function (pptx) {
	let $el = $(this.$el);
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxAddTextElem(slide, $el.find('.slide-h1'));
	this.pptxAddTextElem(slide, $el.find('p'));
	return slide;
};
var computed = {};
computed.h1Text = function () {
	return '旅游大数据分析报告';
};
computed.dateStr = function () {
	let date = new Date();
	let m = date.getMonth() + 1;
	return [
		date.getFullYear() + '年',
		m + '月'
	].join('');
};
computed.logoSrc1 = function () {
	return this.vImgPath + '/report_1/front_logo.png'
};
computed.logoSrc2 = function () {
	return this.vImgPath + '/logo_b.png'
};
var watch = {};
var mounted = function () {};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('./slide_mix.js')
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
@import "../../ref.less";
.chart-slide {
	padding-top: 80px;
	text-align: center;
}
h1 {
	margin-top: 150px;
}
p {
	margin-top: 160px;
	font-size: 24px;
	line-height: 36px;
}
h1, p {
	color: @report-title-color;
}
</style>
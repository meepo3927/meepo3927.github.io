<template>
<div class="chart-slide report-slide-box mid-intro" :class="[indexClassName]">
	<h2 class="slide-h2">本省游客特征分析</h2>
	<div class="h2-line only-style-default">
		<div class="x-1"></div>
		<div class="x-2"></div>
	</div>
	<img :src="src1" class="only-style-1 src-1" />
	<img :src="src2" class="only-style-2 img-2" />
	<div class="only-style-3 l-block">CONTENTS</div>
</div>
</template>

<script>
import request from 'util/request.js';
import EChartUtil from 'util/echart.js';
import tool from 'util/tool.js';

let methods = {};
methods.makePPTSlide = function (pptx) {
	let $el = $(this.$el);
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxAddTextElem(slide, $el.find('h2.slide-h2'));
	this.pptxRenderTopLine(slide, pptx, $el.find('.h2-line > .x-1'), $el);
	this.pptxRenderTopLine(slide, pptx, $el.find('.h2-line > .x-2'), $el);
	return slide;
};
methods.fetchRender = function () {
	this.$nextTick(this.slideSubmitOver);
};
let computed = {};
computed.src1 = function () {
	return this.vImgPath + '/report_1/mid_intro_2.png';
};
computed.src2 = function () {
	return this.vImgPath + '/report_2/intro_2.png';
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {};
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
@import (reference) "../../ref.less";
.chart-slide {
	padding-top: 10px;
}
@left-pad:  96px;
h2 {
	margin-top: 360px;
	margin-left: @left-pad;
}
.h2-line {
	width: 540px;
	margin-top: 20px;
	margin-left: @left-pad + 4px;
}
</style>
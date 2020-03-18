<template>
<div class="chart-slide report-slide-box back-cover">
	<h2 class="slide-h2 only-style-default">
		内蒙古移动大数据分析<br />
		供您参考！
	</h2>
	<div class="h2-line only-style-default">
		<div class="x-1"></div>
		<div class="x-2"></div>
	</div>
	<img :src="logoSrc2" class="only-style-2 b-logo" />
	<img :src="logoSrc2" class="only-style-3 b-logo" />
	<h4 class="only-style-3 slide-h2">内蒙古移动大数据分析</h4>
	<h3 class="only-style-3 slide-h2">供您参考！</h3>
</div>
</template>

<script>
var methods = {};
methods.makePPTSlide = function (pptx) {
	let $el = $(this.$el);
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxAddTextElem(slide, $el.find('h2.slide-h2'));
	this.pptxRenderTopLine(slide, pptx, $el.find('.h2-line > .x-1'), $el);
	this.pptxRenderTopLine(slide, pptx, $el.find('.h2-line > .x-2'), $el);
	return slide;
};
var computed = {};
computed.dateStr = function () {
	let a = this.mCondition.start_date_arr;
	if (!a) {
		return '';
	}

	return [
		a[0] + '年',
		a[1] + '月'
	].join('');
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
}
@left-pad:  110px;
h2 {
	margin-top: 290px;
	margin-left: @left-pad;
}
.h2-line {
	margin-left: @left-pad + 4px;
	margin-top: 20px;
	width: 574px;
}

</style>
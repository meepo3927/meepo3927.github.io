<template>
<div class="intro report-slide-box">
	<h1>说明</h1>
	<ul>
		<li>
			<i class="fa fa-square-o"></i>
			<span>本分析报告主要针对景区的游客到访情况进行分析。</span>
		</li>
		<li>
			<i class="fa fa-square-o"></i>
			<span><strong>景区</strong>：{{sceneryNames}}</span>
		</li>
		<li>
			<i class="fa fa-square-o"></i>
			<span><strong>报告统计时间</strong>：{{dateStr}}</span>
		</li>
		<li>
			<i class="fa fa-square-o"></i>
			<span>本报告由内蒙古移动旅游大数据平台自动生成，仅反映监控区域内的游客客流、行为等整体变化情况。</span>
		</li>
		<li>
			<i class="fa fa-square-o"></i>
			<span>用户特征基于内蒙古移动用户数据统计，已做匿名和聚合处理，不会泄露用户资料。</span>
		</li>
	</ul>
	<img :src="imgSrc1" class="only-style-1 src-1" />
	<img :src="imgSrc2" class="only-style-2 src-2" />
</div>
</template>

<script>
const buildDateStr = (str) => {
	if (!str) {
		return '';
	}
	let a = str.split('-');
	return [
		a[0] + '年',
		a[1] + '月',
		a[2] + '日'
	].join('');
};
var methods = {};
methods.fetchRender = function () {
	this.$nextTick(this.slideSubmitOver);
};
methods.makePPTSlide = function (pptx) {
	let $el = $(this.$el);
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxAddTextElem(slide, $el.find('h1'));
	let self = this;
	$el.find('li').each(function () {
		self.pptxAddTextElem(slide, $(this));
	});
	return slide;
};
var computed = {};
computed.sceneryNames = function () {
	let a = this.mCondition.scenery_names || [];
	if (!a.length) {
		return '';
	}
	return a.join('、') + '。';
};
computed.imgSrc1 = function () {
	return this.vImgPath + '/report_1/intro_2.png';
};
computed.imgSrc2 = function () {
	return this.vImgPath + '/report_2/intro_2.png';
};
computed.dateStr = function () {
	let start = buildDateStr(this.mCondition.start_date);
	let end = buildDateStr(this.mCondition.end_date);
	return start + '—' + end;
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
@import (reference) "../../ref.less";

.intro {
	color: #7F7F7F;
	padding: 75px 30px 30px 95px;
}
h1 {
	font-size: 48px;
	margin-left: -5px;
}
ul {
	margin-top: 60px;
}
ul > li {
	margin-top: 40px;
	font-size: 22px;
	line-height: 36px;
	.fa-square-o {
		vertical-align: -1px;
	}
}
</style>
<template>
<div class="page-report" :class="rootClass">
	<v-condition ref="cond" :searched="submited" :skin="skinStyle"
		@submit="onSubmit"
		@pdf="genPDF"
		@pptx="genPPT" />

	<div class="slide-box">
		<front-cover ref="frontCover"></front-cover>
	</div>

	<div class="slide-list" v-if="submited">
		<div v-for="i in compArr" ref="slides"  class="mt20"
			@remove-slide="removeSlide"
			:index="i" :key="getCompName(i)"
			:is="getCompName(i)" ></div>
	</div>
	<!-- 尾页 -->
	<div class="slide-box">
		<back-cover ref="backCover"></back-cover>
	</div>
	<!-- loading蒙版 -->
	<div class="loading-cover" v-show="loading">
		<div class="loading-bar"></div>
	</div>
	<!-- 切换主题 -->
	<div class="style-box">
		<ul>
			<li v-for="v in styles" :class="getStyleClass(v)" title="切换主题"
				@click="changeSkin(v)"></li>
		</ul>
	</div>
</div>
</template>

<script>
import {mlayer, request, $} from 'root';
import Promise from 'Promise';
import URL from 'util/url.js';
import tool from 'util/tool.js';
import jsPDF from 'jspdf';
import store from 'store/report.js';

var methods = {};
methods.removeSlide = function (index) {
	for (var i = 0; i < this.compArr.length; i++) {
		if (this.compArr[i] === index) {
			this.compArr.splice(i, 1);
		}
	}
};
methods.getCompName = function (i) {
	// let n = i - 1;
	return 'chart-slide-' + i;
};
methods.getStyleClass = function (str) {
	let arr = ['s-' + str];
	if (str === this.skinStyle) {
		arr.push('active');
	}
	return arr;
};
methods.onSubmit = function () {
	if (!this.mCondition.scenery_ids) {
		return mlayer.msg('请选择至少一个景区');
	}
	this.onQueryStart();
	const r = this.commonRequest('sceneryUserInterFoundAna');
	this.requests = {
		13: r, 14: r, 15: r
	};
	if (this.submited) {
		this.$emit('search');
	} else {
		this.submited = true;
	}
};
methods.onQueryStart = function () {
	this.requests = {};
	store.commit('submitCountReset');
	mlayer.msg('开始查询');
};
// 所有slide查询数据完毕
methods.onQueryOver = function () {
	mlayer.msg('查询完毕');
};
methods.hideOtherSlides = function (except) {
	this.$refs.slides.forEach((slide) => {
		if (except && slide === except) {
			slide.show && slide.show();
		} else {
			slide.hide && slide.hide();
		}
	});
};
methods.showAllSlides = function () {
	this.$refs.slides.forEach((slide) => {
		slide.show && slide.show();
	});
};
methods.makeFrontCover = function () {
	this.hideOtherSlides(null);
	return this.$refs.frontCover.getSlideImage().then((data) => {
		this.pages.push({
			name: 'front_cover',
			data: data
		});
		return this.pages;
	});
};
methods.makeBackCover = function () {
	this.hideOtherSlides(null);
	return this.$refs.backCover.getSlideImage().then((data) => {
		this.pages.push({
			name: 'back_cover',
			data: data
		});
		return this.pages;
	});
};
methods.makeSlides = function (i) {
	let slide = this.$refs.slides[i];
	if (slide) {
		this.hideOtherSlides(slide);
		if (!slide.getSlideImage) {
			return this.makeSlides(i + 1);
		}
		return slide.getSlideImage().then((data) => {
			this.pages.push({
				name: 'slide_' + i, data
			});
			return this.makeSlides(i + 1);
		});
	} else {
		return Promise.resolve(this.pages);
	}
};
methods.genPDF = function () {
	if (!this.$refs.slides) {
		return mlayer.msg('请先查询，等待报表渲染完成，再点击生成报告', {
			time: 4500
		});
	}
	store.commit('loadStart');
	this.pages = [];
	// 封面
	this.makeFrontCover().then((pages) => {
		return this.makeSlides(0);
	}).then(() => {
		return this.makeBackCover();
	}).then(() => {
		this.makePDF();
	}).catch((e) => {
		var msg = '';
		if (e && e.msg) {
			msg = '，' + e.msg;
		}
		mlayer.msg('发生错误' + msg);
		this.genReportDone();
		LOG(e);
	});
};
methods.genReportDone = function () {
	store.commit('loadEnd');
	this.showAllSlides();
};
// same as slide_mix.js
methods.commonRequest = function (url, o = {}, m) {
    let p = tool.extend({
        start_date: this.mCondition.start_date,
        end_date: this.mCondition.end_date,
        scenery_ids: this.mCondition.scenery_ids
    }, o);

    if (url.charAt(0) === '/') {
        return request.r1(url, p, m);
    }
    return request.r1('/ana/' + url, p, m);
};
// pt
const PDF_PAGE_WIDTH = 957;  // 1280 / 1.3375
const PDF_PAGE_HEIGHT = 538; // 720 / 1.3375

// px
// const PDF_PAGE_WIDTH = 723;  // 1280 / 1.77
// const PDF_PAGE_HEIGHT = 406; // 720 / 1.77


/**
 * 生成PDF文件
 */
methods.makePDF = function () {
	let doc = new jsPDF({
		orientation: 'landscape',
		unit: 'pt',
		format: [PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT]
	});
	// 逐页生成
	this.pages.forEach((page, i) => {
		if (i > 0) {
			doc.addPage();
		}
		doc.addImage(
			page.data, 'JPEG',
			0, 0, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT
		);
	});

	doc.save('report.pdf');
	this.genReportDone();
};
methods.genPPT = function () {
	if (!window.PptxGenJS) {
		return mlayer.msg('PPT插件加载失败');
	}
	if (this.skinStyle !== 'default') {
		return mlayer.msg('请切换到默认主题');
	}
	store.commit('loadStart');
	this.$nextTick(() => {
		setTimeout(this.makePPT, 150)
	});
};
methods.makePPT = function () {
	let pptx = new window.PptxGenJS();
	pptx.setLayout('LAYOUT_WIDE'); // 1280 x 720
	// 封面
	this.$refs.frontCover.makePPTSlide(pptx);
	// 循环
	this.$refs.slides.forEach((slide, i) => {
		if (slide.makePPTSlide) {
			// LOG('make ppt slide-' + i);
			slide.makePPTSlide(pptx);
		}
	});
	// 尾页
	this.$refs.backCover.makePPTSlide(pptx);
	pptx.save('travel_report');
	store.commit('loadEnd');
};
methods.changeSkin = function (payload) {
	this.skinStyle = payload;
	this.$nextTick(() => {
		setTimeout(this.fireResize, 50);
	});
};
methods.fireResize = function () {
	this.vBus.fire('reportChartResize');
};
var computed = {};
computed.rootClass = function () {
	let arr = [];
	if (this.skinStyle) {
		arr.push('style-' + this.skinStyle);
	}
	return arr;
};
computed.styles = function () {
	return ['default', '1', '2', '3'];
};
computed.loading = function () {
	return store.state.loading;
};
computed.submitCount = function () {
	return store.state.submitCount;
};
computed.mCondition = function () {
	return store.getters.mCondition;
};
var watch = {};
watch.submitCount = function (val) {
	if (val === this.compArr.length) {
		this.onQueryOver();
	}
};
const created = function () {
};
var mounted = function () {
	window.Report = this;
	window.jsPDF = jsPDF;
};
const beforeDestroy = function () {};
let dataFunc = function () {
	let compArr = [];
	for (var i = 0; i <= 21; i++) {
		compArr.push(i);
	}
	var o = {
		compArr,
		submited: false,
		skinStyle: 'default'
	};
	return o;
};
export default {
	data: dataFunc,
	store,
	watch,
	mixins: [],
	methods,
	computed,
	props: [],
	created,
	mounted,
	beforeDestroy,
	components: {
		'v-condition': require('comp/reporto/condition.vue'),
		'front-cover': require('comp/reporto/front-cover.vue'),
		'chart-slide-0': require('comp/reporto/chart-slide-0.vue'),
		'chart-slide-1': require('comp/reporto/chart-slide-1.vue'),
		'chart-slide-2': require('comp/reporto/chart-slide-2.vue'),
		'chart-slide-3': require('comp/reporto/chart-slide-3.vue'),
		'chart-slide-4': require('comp/reporto/chart-slide-4.vue'),
		'chart-slide-5': require('comp/reporto/chart-slide-5.vue'),
		'chart-slide-6': require('comp/reporto/chart-slide-6.vue'),
		'chart-slide-7': require('comp/reporto/chart-slide-7.vue'),
		'chart-slide-8': require('comp/reporto/chart-slide-8.vue'),
		'chart-slide-9': require('comp/reporto/chart-slide-9.vue'),
		'chart-slide-10': require('comp/reporto/chart-slide-10.vue'),
		'chart-slide-11': require('comp/reporto/chart-slide-11.vue'),
		'chart-slide-12': require('comp/reporto/chart-slide-12.vue'),
		'chart-slide-13': require('comp/reporto/chart-slide-13.vue'),
		'chart-slide-14': require('comp/reporto/chart-slide-14.vue'),
		'chart-slide-15': require('comp/reporto/chart-slide-15.vue'),
		'chart-slide-16': require('comp/reporto/chart-slide-16.vue'),
		'chart-slide-17': require('comp/reporto/chart-slide-17.vue'),
		'chart-slide-18': require('comp/reporto/chart-slide-18.vue'),
		'chart-slide-19': require('comp/reporto/chart-slide-19.vue'),
		'chart-slide-20': require('comp/reporto/chart-slide-20.vue'),
		'chart-slide-21': require('comp/reporto/chart-slide-21.vue'),
		'back-cover': require('comp/reporto/back-cover.vue')
	}
};
</script>

<style scoped lang="less">
@import "../ref";

.page-report {
	padding: 15px 20px;
}
.slide-box {
	margin-top: 20px;
}
.style-box {
	position: fixed;
	right: 10px;
	bottom: 54px;
	z-index: 4;
	@my-cube-size:  28px;
	ul > li {
		display: block;
		width: @my-cube-size;
		height: @my-cube-size;
		margin-top: @my-cube-size / 2;
		cursor: pointer;
		opacity: .6;
		&.active {
			border: 1px solid #fff;
			box-shadow: 0 0 6px #333;
			opacity: 1;
		}
		&.s-default {
			background-color: #7F7F7F;
		}
		&.s-1 {
			background-color: #00B050;
		}
		&.s-2 {
			background-color: #C12A31;
		}
		&.s-3 {
			background-color: #0070C0;
		}
	}
}
.loading-cover {
	position: fixed;
	top: 0;
	left: @side-nav-width;
	right: 0;
	bottom: 0;
	z-index: 99999;
	background-color: rgba(255, 255, 255, .8);
	text-align: center;
	padding-top: 1px;
	.loading-bar {
		margin-top: 47vh;
	}
}
.progress-cover {
	position: fixed;
	top: 0;
	left: @side-nav-width;
	right: 0;
	bottom: 0;
	z-index: 99999;
	background-color: rgba(255, 255, 255, .8);
	& > .i-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		text-align: center;
		.current-status {
			margin-top: 44vh;
			color: #000;
			font-size: 28px;
		}
		.loading-bar {
			margin-top: 20px;
		}
	}
}
</style>
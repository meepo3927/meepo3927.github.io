<template>
<div class="page-report" :class="rootClass">
	<v-condition ref="cond" :searched="submited" :skin="skinStyle"
		@submit="onSubmit"
		@report="genReport"
		@pptx="genPPT"
		@async-city="asyncCity"
		@async-scenery="asyncScenery"
		@reset="onReset" />

	<div class="slide-box">
		<front-cover ref="frontCover"></front-cover>
	</div>

	<!-- 城市 slides -->
	<div class="slide-list" v-if="citySlideVisible" key="citySlides">
		<div v-for="i in cityComps" ref="slides" class="mt20"
			@remove-slide="removeCitySlide(i)"
			:index="i" :key="getCityCompName(i)"
			:is="getCityCompName(i)" ></div>
	</div>

	<!-- 景区 slides -->
	<div class="slide-list" v-if="scenerySlideVisible" key="scenerySlides">
		<div v-for="i in sceneryComps" ref="slides" class="mt20"
			@remove-slide="removeScenerySlide(i)"
			:index="i" :key="getSceneryCompName(i)"
			:is="getSceneryCompName(i)" ></div>
	</div>
	<!-- 尾页 -->
	<div class="slide-box">
		<back-cover ref="backCover"></back-cover>
	</div>
	<!-- loading蒙版 -->
	<div class="loading-cover" v-show="loading">
		<div class="loading-bar"></div>
	</div>
	<!-- 进度蒙版 -->
	<v-progress ref="prog" />
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
methods.removeCitySlide = function (index) {
	let pos = this.cityComps.indexOf(index);
	if (pos >= 0) {
		this.cityComps.splice(i, 1);
	}
};
methods.removeScenerySlide = function (index) {
	let pos = this.sceneryComps.indexOf(index);
	if (pos >= 0) {
		this.sceneryComps.splice(i, 1);
	}
};
methods.getCityCompName = function (i) {
	// let n = i - 1;
	return 'city-slide-' + i;
};
methods.getSceneryCompName = function (i) {
	// let n = i - 1;
	return 'scenery-slide-' + i;
};
methods.getStyleClass = function (str) {
	let arr = ['s-' + str];
	if (str === this.skinStyle) {
		arr.push('active');
	}
	return arr;
};
methods.queryCity = function () {
	this.onQueryStart();
	if (this.submited) {
		this.$emit('search');
	} else {
		this.submited = true;
	}
};
methods.queryScenery = function () {
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
methods.onReset = function () {
	this.submited = false;
};
methods.onSubmit = function () {
	if (this.isDimScenery) {
		this.queryScenery();
	} else {
		this.queryCity();
	}
};
// 城市异步查询
methods.asyncCity = function (o) {
	let url = '/async/report/start/cityReportServiceImpl';
	request.getJSON3(url, o).then((data) => {
		store.commit('setStatus', 'progress');
		mlayer.msg('提交成功');
		// 显示progress
		setTimeout(() => {
			this.$refs.prog.start();
		}, 500);
	}).catch((e) => {
		mlayer.msg('查询失败');
	});
};
// 景区异步查询
methods.asyncScenery = function (o) {
	if (!o.scenery_ids || o.scenery_ids.length === 0) {
		return mlayer.msg('请选择至少一个景区');
	}
	let url = '/async/report/start/sceneryReportServiceImpl';
	request.getJSON3(url, o).then((data) => {
		store.commit('setStatus', 'progress');
		mlayer.msg('提交成功');
		// 显示progress
		setTimeout(() => {
			this.$refs.prog.start();
		}, 500);
	}).catch((e) => {
		mlayer.msg('查询失败');
	});
};
methods.onQueryStart = function () {
	this.requests = {};
	store.commit('submitCountReset');
	mlayer.msg('开始查询');
};
// 所有slide查询数据完毕
methods.onQueryOver = function () {
	mlayer.msg('查询完毕');
	//store.commit('loadEnd');
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
methods.genReport = function () {
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
    let p = tool.extend({}, o);

    if (url.charAt(0) === '/') {
        return request.r1(url, p, m);
    }
    return request.r1('/async/' + url, p, m);
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
computed.dimType = function () {
	return store.state.dimType;
};
computed.condition = function () {
	return store.state.condition;
};
computed.mCondition = function () {
	return store.getters.mCondition;
};
computed.citySlideVisible = function () {
	return (this.submited) && (this.isDimCity);
};
computed.scenerySlideVisible = function () {
	return (this.submited) && (this.isDimScenery);
};
computed.isDimCity = function () {
    return store.getters.isDimCity;
};
computed.isDimScenery = function () {
    return store.getters.isDimScenery;
};

var watch = {};
watch.submitCount = function (val) {
	if (this.isDimScenery && (val === this.sceneryComps.length)) {
		this.onQueryOver();
	}
	if (this.isDimCity && (val === this.cityComps.length)) {
		this.onQueryOver();
	}
};
watch.dimType = function () {
	this.submited = false;
};
const created = function () {
};
var mounted = function () {
	window.VM = this;
};
const beforeDestroy = function () {};
let dataFunc = function () {
	let sceneryComps = [];
	let cityComps = [];
	for (let i = 0; i <= 21; i++) {
		sceneryComps.push(i);
	}
	for (let j = 0; j <= 15; j++) {
		cityComps.push(j);
	}
	var o = {
		sceneryComps,
		cityComps,
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
		'v-condition': require('comp/report/condition.vue'),
		'front-cover': require('comp/report/front-cover.vue'),
		'city-slide-0': require('comp/report/chart-slide-0.vue'),
		'city-slide-1': require('comp/report/city-slide-1.vue'),
		'city-slide-2': require('comp/report/city-slide-2.vue'),
		'city-slide-3': require('comp/report/city-slide-3.vue'),
		'city-slide-4': require('comp/report/city-slide-4.vue'),
		'city-slide-5': require('comp/report/city-slide-5.vue'),
		'city-slide-6': require('comp/report/city-slide-6.vue'),
		'city-slide-7': require('comp/report/city-slide-7.vue'),
		'city-slide-8': require('comp/report/city-slide-8.vue'),
		'city-slide-9': require('comp/report/city-slide-9.vue'),
		'city-slide-10': require('comp/report/chart-slide-16.vue'),
		'city-slide-11': require('comp/report/city-slide-11.vue'),
		'city-slide-12': require('comp/report/city-slide-12.vue'),
		'city-slide-13': require('comp/report/city-slide-13.vue'),
		'city-slide-14': require('comp/report/city-slide-14.vue'),
		'city-slide-15': require('comp/report/city-slide-15.vue'),
		'scenery-slide-0': require('comp/report/chart-slide-0.vue'),
		'scenery-slide-1': require('comp/report/chart-slide-1.vue'),
		'scenery-slide-2': require('comp/report/chart-slide-2.vue'),
		'scenery-slide-3': require('comp/report/chart-slide-3.vue'),
		'scenery-slide-4': require('comp/report/chart-slide-4.vue'),
		'scenery-slide-5': require('comp/report/chart-slide-5.vue'),
		'scenery-slide-6': require('comp/report/chart-slide-6.vue'),
		'scenery-slide-7': require('comp/report/chart-slide-7.vue'),
		'scenery-slide-8': require('comp/report/chart-slide-8.vue'),
		'scenery-slide-9': require('comp/report/chart-slide-9.vue'),
		'scenery-slide-10': require('comp/report/chart-slide-10.vue'),
		'scenery-slide-11': require('comp/report/chart-slide-11.vue'),
		'scenery-slide-12': require('comp/report/chart-slide-12.vue'),
		'scenery-slide-13': require('comp/report/chart-slide-13.vue'),
		'scenery-slide-14': require('comp/report/chart-slide-14.vue'),
		'scenery-slide-15': require('comp/report/chart-slide-15.vue'),
		'scenery-slide-16': require('comp/report/chart-slide-16.vue'),
		'scenery-slide-17': require('comp/report/chart-slide-17.vue'),
		'scenery-slide-18': require('comp/report/chart-slide-18.vue'),
		'scenery-slide-19': require('comp/report/chart-slide-19.vue'),
		'scenery-slide-20': require('comp/report/chart-slide-20.vue'),
		'scenery-slide-21': require('comp/report/chart-slide-21.vue'),
		'back-cover': require('comp/report/back-cover.vue'),
		'v-progress': require('comp/report/progress.vue')
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

</style>
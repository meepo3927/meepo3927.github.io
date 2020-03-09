<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>游客热门景点分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>
		<div class="mid-tip line-3">
			<p v-html="tip1"></p>
		</div>
		<div class="m-row mt10">
			<div class="m-col col-1">
				<h4>最受本市游客欢迎景点TOP10</h4>
				<v-table :list="list1" />
			</div>
			<div class="m-col col-2">
				<h4>最受省外游客欢迎景点TOP10</h4>
				<v-table :list="list2" />
			</div>
			<div class="m-col col-3">
				<h4>最受外盟市游客欢迎景点TOP10</h4>
				<v-table :list="list3" />
			</div>
			<div class="m-col col-4">
				<h4>最受境外游客欢迎景点TOP10</h4>
				<v-table :list="list4" />
			</div>
		</div>
	</div>
</div>
</template>

<script>
import $ from 'jquery';
import request from 'util/request.js';
import EChartUtil from 'util/echart.js';
import tool from 'util/tool.js';

let methods = {};
methods.makePPTSlide = function (pptx) {
	let self = this;
	let $el = $(this.$el);
	var slide = pptx.addNewSlide();
	this.pptxCommonProcess(slide);
	this.pptxCommonChartSlideProcess(slide, pptx);

	// 白色背景
	let $tableBox = $el.find('div.m-row');
	let $cols = $tableBox.children('.m-col');
	$cols.each(function () {
		let $col = $(this);
		let $title = $col.children('h4');
		let $table = $col.children('table');
		// 背景
		self.pptxRenderBox(slide, pptx, $col, $el);
		// 标题
		self.pptxAddTextElem(slide, $title);
		// 表格
		self.pptxRenderTable(slide, pptx, $table, $el);
	});
	return slide;
};
methods.fetchRender = function () {
	this.list1 = undefined;
	this.commonRequest3('cityTopScenerys').then((r) => {
		if (r && r.length) {
			this.list1 = r.slice(0, 10);
		} else {
			this.list1 = null;
		}
		this.slideSubmitOver();
	}).catch((e) => {
		this.list1 = null;
		this.slideSubmitOver();
	});
	this.list2 = undefined;
	this.commonRequest3('cityTopScenerys').then((r) => {
		if (r && r.length) {
			this.list2 = r.slice(0, 10);
		} else {
			this.list2 = null;
		}
		this.slideSubmitOver();
	}).catch((e) => {
		this.list2 = null;
		this.slideSubmitOver();
	});
	this.list3 = undefined;
	this.commonRequest3('cityTopScenerys').then((r) => {
		if (r && r.length) {
			this.list3 = r.slice(0, 10);
		} else {
			this.list3 = null;
		}
		this.slideSubmitOver();
	}).catch((e) => {
		this.list3 = null;
		this.slideSubmitOver();
	});

	this.list4 = undefined;
	this.commonRequest3('cityTopScenerys').then((r) => {
		if (r && r.length) {
			this.list4 = r.slice(0, 10);
		} else {
			this.list4 = null;
		}
		this.slideSubmitOver();
	}).catch((e) => {
		this.list4 = null;
		this.slideSubmitOver();
	});
	
};
let computed = {};
computed.tip1 = function () {
	let g = (l) => {
		return l.slice(0, 3).map(v => v.routeDESC).join('、');
	};
	let str1 = '';
	if (this.list1) {
		str1 = '本市游客最喜欢的旅游景点为' + g(this.list1);
	}
	let str2 = '';
	if (this.list2) {
		str2 = '省外游客最喜欢的旅游景点为' + g(this.list2);
	}
	let str3 = '';
	if (this.list3) {
		str3 = '最受外盟市游客欢迎的景点为' + g(this.list3);
	}
	let str4 = '';
	if (this.list4) {
		str4 = '境外游客最喜欢的旅游景点为' + g(this.list4);
	}

	return this.combineString(str1, str2, str3, str4);
};

let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		list1: undefined,
		list2: undefined,
		list3: undefined,
		list4: undefined
	};
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
	components: {
		'v-table': require('comp/report/scenery-list-table.vue')
	}
};
</script>

<style scoped lang="less">
@import (reference) "../../ref.less";
.m-col {
	width: 25%;
	background-color: #fff;
	padding-top: 1px;
	height: 528px;
	overflow: hidden;
	& > h4 {
		text-align: center;
		margin: 15px 0 15px;
	}
}
.col-1 {
	padding-left: 8px;
	padding-right: 2px;
}
.col-2 {
	padding-left: 4px;
	padding-right: 4px;
}
.col-3 {
	padding-left: 4px;
	padding-right: 4px;
}
.col-4 {
	padding-left: 2px;
	padding-right: 8px;
}
</style>
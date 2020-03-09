<template>
<div class="chart-slide report-slide-box" :class="[indexClassName]">
	<div class="left-block"></div>
	<div class="right-wrapper">
		<div class="x-head">
			<h6>景区游客热门路线分析</h6>
			<a href="javascript:;" class="v-hide-btn" @click="removeMe">
				<i class="fa fa-times"></i>
			</a>
		</div>
		<div class="table-box">
			<h4>游客热门旅游线路TOP10</h4>
			<table class="table route-table" >
				<thead>
					<tr>
						<th class="col-1">TOP</th>
						<th class="col-2 tal">旅游线路</th>
						<th class="col-3">游客数</th>
					</tr>
				</thead>
				<tbody v-if="list">
					<tr v-for="(v, i) in list">
						<td v-text="i + 1" class="tac"></td>
						<td v-text="v.routeDESC" ></td>
						<td v-text="v.number" class="tac"></td>
					</tr>
				</tbody>
				<tbody v-if="list === null">
					<tr>
						<td colspan="3" class="tac">暂无数据</td>
					</tr>
				</tbody>
				<tbody v-if="list === undefined">
					<tr>
						<td colspan="3" class="tac">
							<div class="loading-1 "></div>
						</td>
					</tr>
				</tbody>
			</table>
			
		</div>
	</div>
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
	this.pptxCommonChartSlideProcess(slide, pptx);

	// 白色背景
	let $tableBox = $el.find('div.table-box');
	this.pptxRenderBox(slide, pptx, $tableBox, $el);
	// 小标题
	let $title = $tableBox.children('h4');
	this.pptxAddTextElem(slide, $title);
	// 表格
	this.pptxRenderTable(slide, pptx, $tableBox.children('table'), $el);
	return slide;
};
methods.fetchRender = function () {
	this.list = undefined;
	this.commonRequest3('sceneryUserTravelRoute').then((r) => {
		if (r && r.length) {
			this.list = r.slice(0, 10);
		} else {
			this.list = null;
		}
		this.slideSubmitOver();
	}).catch((e) => {
		this.list = null;
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
		list: null
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
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../ref.less";
.chart-slide {}
.table-box {
	height: 611px;
	background-color: #fff;
	padding: 40px 50px;
	margin-top: 20px;
	& > h4 {
		text-align: center;
	}
	.route-table {
		margin-top: 40px;
	}
}
.col-1 {
	width: 160px;
}
.col-3 {
	width: 215px;
}
.loading-1 {
	margin-left: auto;
	margin-right: auto;
}
</style>
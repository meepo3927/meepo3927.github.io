<template>
<div class="enter-city">

	<side-navbar active-name="来市游客分析" />
	<!-- Gis -->
	<iframe :src="arcgisUrl" frameborder="0" class="gis-iframe" scrolling="no"
		ref="gisIframe"></iframe>
	<!--
	<img :src="gisFakeImage" class="gis-fake-iframe" v-show="view.gisFakeVisible" />
	-->
	<!-- Gis End -->

	<!-- 维度选择 -->
	<ul class="dim-list">
		<li v-for="(v, key) in vConfig.homeMap" 
			:class="{active: key === home}">
			<a href="javascript:;" v-text="v" @click="switchHome(key)"></a>
		</li>
	</ul>
	<!-- table -->
	<table-layer v-show="!view.loadingTable">
		<rank-list ref="rank" @request-start="onRankRequestStart"
			@request-over="onRankRequestOver"
			:user-type="userType" 
			:date-key="dateKey" />
	</table-layer>
	<!-- loading -->
	<div class="table-loading " v-show="view.loadingTable">
        <div class="loading-bar"></div>
    </div>

	<!-- Right NavBar -->
	<navbar @click="onNavClick" />

	<!-- 时间轴 -->
	<time-bar ref="timeBar" @change="onTimeChange" />
	<!-- 选择地市 -->
	<city-select v-show="view.citySelectVisible"
	     @close="closeCitySelect"
	     @select="onCitySelect($event)"></city-select>
	<!-- 数据分析 -->
	<analysis-layer v-if="view.analysisVisible" @close="closeAnalysis" />
</div>
</template>

<script>
import 'root';
import config from 'global/config';
import request from 'util/request';
import barStore from 'store/rightbar.js';
import GisUtil from 'util/arcgis.js';
import IframeUtil from 'util/iframe.js';

var methods = {};

methods.getHeatMapParam = function () {
	let item = this.timeVar;
	if (!item) {
		return null;
	}
	return {
		scenery_city: this.cityId,
		userType: this.userType,
		deal_date: item.dateStr,
		dataHour: item.hour
	};
};
methods.renderHeatMap = function (list) {
	return GisUtil.sendHeatmap(list, 'city', {
		cityId: this.cityId
	});
};
methods.cleanHeatMap = function () {
	IframeUtil.send('render_clearHeatmap');
};
methods.fetchRenderHeatMap = function () {
	let p = this.getHeatMapParam();
	if (!p) {
		return;
	}
	this.cleanHeatMap();
	request.vwRptCurrentRomaAtDay2(p).then((list) => {
		this.heatMapData = list;
		this.renderHeatMap(list);
	}).catch(() => {
		this.renderHeatMap([]);
	});
};
methods.fetchRender = function () {
	// 热力图
	this.fetchRenderHeatMap();
};
methods.onNavClick = function (cmd) {
	if (cmd === 'analysis') {
		this.showAnalysis();
	} else if (cmd === 'city') {
		this.view.citySelectVisible = !this.view.citySelectVisible;
	}
};
methods.onTimeChange = function (item) {
	this.timeVar = item;
	this.fetchRender();
};
methods.onRankRequestStart = function () {
	this.view.loadingTable = true;
};
methods.onRankRequestOver = function () {
	this.view.loadingTable = false;
};
methods.closeCitySelect = function () {
	this.view.citySelectVisible = false;
};
methods.onCitySelect = function (item) {
	barStore.commit('changeArea', item);
	this.closeCitySelect();
	this.initGis();
	this.fetchRender();
};
methods.showAnalysis = function () {
	this.view.analysisVisible = true;
};
methods.closeAnalysis = function () {
	this.view.analysisVisible = false;
};
methods.switchHome = function (v) {
	if (this.home === v) {
		return;
	}
	this.home = v;
	this.fetchRender();
};
methods.initGis = function () {
	let url = this.vConfig.gisUrlBase + '/travel/carouselHeatmap.jsp?cityid=' + this.cityId;
	this.setArcGisUrl(url);
};
methods.onGisReady = function () {
	setTimeout(() => {
		if (this.heatMapData) {
			this.renderHeatMap(this.heatMapData);
		}
	}, 100);
};
var computed = {};
computed.isCity = function () {
	return true;
};
computed.cityId = function () {
	return barStore.getters.areaId;
};
computed.dateKey = function () {
	let item = this.timeVar;
	if (!item) {
		return null;
	}
	return item.dateStr + '|' + item.hour;
};
computed.userType = function () {
	let t = this.home;
	if (t === '0' || t === 0) {
		return '0';
	}
	return (4 - t);
};
var watch = {};
watch.cityId = function () {
	// this.fetchRender();
};
var mounted = function () {
	window.VM = this;
	setTimeout(this.initGis, 1);
	IframeUtil.on('gis_ready', this.onGisReady);
};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		home: '0',
		timeVar: null,
		rankData: null,
		heatMapData: null,
		view: {
			analysisVisible: false,
			loadingTable: false,
			citySelectVisible: false
		}
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/gis_iframe.js')
	],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {
		'navbar': require('comp/enter_city/navbar.vue'),
		'analysis-layer': require('comp/enter_city/analysis-layer.vue'),
		'time-bar': require('comp/common/time-bar.vue'),
		'table-layer': require('comp/common/table-layer.vue'),
		'rank-list': require('comp/enter_city/rank-list.vue'),
		'city-select': require('comp/enter_city/city-select.vue')
	}
};
</script>

<style scoped lang="less">
@import (reference) "../../less/global/config";
.enter-city {
	height: 100%;
	font-size: 0;
}

.dim-list {
	position: fixed;
	top: @layerTop1;
	left: @layerLeft;
	width: @layerWidth-1;

	@border-color:       #999;
	li {
		display: inline-block;
		width: 25%;
		text-align: center;
		font-size: 16px;
		border: 1px solid @border-color;
		border-left: none;
		&:first-child {
			border-left: 1px solid @border-color;
		}
	}
	li > a {
		color: #333;
		display: block;
		height: @bar-height-1;
		line-height: @bar-height-1;
		background-color: #fff;
	}
	li:hover > a {
		background-color: #999;
		color: #fff;
	}
	li.active > a {
		background-color: #666666;
		color: #fff;
	}
}
</style>
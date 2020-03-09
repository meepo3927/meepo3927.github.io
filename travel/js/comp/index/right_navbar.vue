<template>
<div class="navbar right-navbar" :class="[overflowHidden ? 'o-hidden': 'o-visible']">
	<a href="javascript:;" class="area-name" @click="click(1)" :title="areaName">
		<span>{{areaName}}</span>
		<i class="fa fa-caret-down"></i>
	</a>
	<a href="javascript:;" class="btn-2" @click="click(2)">
		<i class="fa fa-line-chart"></i>
		实时监控
	</a>
	<a href="javascript:;" class="btn-3" @click="click(3)">
		<i class="fa fa-area-chart"></i>
		数据分析
	</a>

</div>
</template>

<script>
import myStore from 'store/rightbar.js';
import config from 'global/config.js';
import request from 'util/request.js';

const EMPTY_URL = 'javascript:;';

var methods = {};
var computed = {};
computed.myArea = function () {
	return this.area || {};
};
computed.isProvince = function () {
	return (this.myArea.level === 'province')
};
computed.isCity = function () {
	return (this.myArea.level === 'city');
};
computed.isAttraction = function () {
	return (this.myArea.level === 'attraction');
};
computed.areaId = function () {
	return this.myArea.id;
};
var mounted = function () {};
let dataFunc = function () {
	var o = {
		attractionCityId: undefined
	};
	return o;
};
let watch = {};
watch.areaId = function (id) {
	if (!id || !this.isAttraction) {
		this.attractionCityId = undefined;
		return;
	}
	request.getCitiesMap().then((hash) => {
		if (hash[id] && hash[id].parent) {
			this.attractionCityId = hash[id].parent.placeID;
		}
	});
};
export default {
	watch,
	store: myStore,
	data: dataFunc,
	methods,
	computed,
	mixins: [
		require('mixins/navbar.js')
	],
	props: ['areaName', 'area'],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";

</style>
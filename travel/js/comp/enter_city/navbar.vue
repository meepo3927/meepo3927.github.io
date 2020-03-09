<template>
<div class="right-navbar o-hidden" >
	<a href="javascript:;" class="area-name" @click="click('city')">
		<span v-text="areaName"></span>
		<i class="fa fa-caret-down"></i>
	</a>
	<a href="javascript:;" class="btn-3" @click="click('analysis')">
		<i class="fa fa-area-chart"></i>
		数据分析
	</a>
	<!-- 
	<a href="javascript:;" class="heatmap-toggle-btn" @click="toggleHeatmap">
		<i class="fa fa-dot-circle-o"></i>
		{{heatmapBtnLabel}}
	</a>
	-->

	<a href="javascript:;" class="toggle-btn" :title="toggleTitle"
		v-if="toggleBtnVisible"
		@click="toggle">
		<i class="fa " :class="[overflowHidden ? 'fa-angle-right' : 'fa-angle-left']"></i>
	</a>
</div>
</template>

<script>
import myStore from 'store/rightbar.js';
import request from 'util/request';
import Vuex from 'vuex';

var methods = {};
var computed = Vuex.mapGetters({
	'areaName': 'areaName',
	'areaId': 'areaId'
});
computed.toggleBtnVisible = function () {
	return false;
};
const created = function () {
	// 默认
	myStore.commit('changeArea', {
		id: 471,
		name: '呼和浩特'
	});
};
var mounted = function () {
};
let dataFunc = function () {
	var o = {
	};
	return o;
};
let watch = {};

export default {
	watch,
	store: myStore,
	data: dataFunc,
	created,
	methods,
	computed,
	mixins: [
		require('mixins/navbar.js')
	],
	props: [],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";

</style>
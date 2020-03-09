<template>
<center-layer :width="layerWidth" :height="layerHeight" anim="true" 
	@ready="layerReady" ref="clayer">

<div class="analysis-layer" >
	<a href="javascript:;" class="close-btn" @click="$emit('close')">
	    <i class="fa fa-times"></i>
	</a>
	<div class="x-wrapper" v-show="innerVisible">
		<!-- 标题 -->
		<div class="x-head" :style="{'min-width': calHeadMinWidth(navConfig.length)}">
			<h4>来市数据分析</h4>
			<head-nav :config="navConfig" :index="partIndex" 
				@change="switchPart" />
		</div>
		<!-- 内容 -->
		<div class="x-body">
			<transition @leave="leaveXAnim" @enter="enterXAnim">
			<keep-alive >
				<div :is="part" :area="area" :key="partIndex" ref="part" 
					class="x-part"></div>
			</keep-alive>
			</transition>
		</div>
	</div>
</div>

</center-layer>
</template>

<script>
import config from 'config';
var methods = {};
methods.layerReady = function () {
	this.partIndex = 1;
};

var computed = {};
computed.innerVisible = function () {
	return this.partIndex > 0;
};
computed.navConfig = function () {
	return [
		{
			name: '客流量历史分析',
			icon: 'fa-line-chart'
		},
		{
			name: '客流来源分析',
			icon: 'fa-location-arrow',
			hidden: false
		},
		{
			name: '游客构成分析',
			icon: 'fa-pie-chart'
		},
		{
			name: '游客驻留时间分析',
			icon: 'fa-area-chart'
		},
		{
			name: '游客线路分析',
			icon: 'fa-random',
			hidden: false
		},
		{
			name: '游客住宿分析',
			icon: 'fa-bar-chart-o'
		}
	];
};
var mounted = function () {
};
const beforeCreate = function () {
};
const beforeDestroy = function () {
};
let dataFunc = function () {
	var o = {
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	mixins: [
		require('mixins/analysis_layer.js'),
		require('mixins/with_cover.js')
	],
	beforeCreate,
	beforeDestroy,
	components: {
		'part-1': require('./part-1.vue'),
		'part-2': require('./part-2.vue'),
		'part-3': require('./part-3.vue'),
		'part-4': require('./part-4.vue'),
		'part-5': require('./part-5.vue'),
		'part-6': require('./part-6.vue')
	}
};
</script>

<style scoped lang="less">

</style>
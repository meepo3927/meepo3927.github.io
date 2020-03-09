<template>
<center-layer :width="layerWidth" :height="layerHeight" 
	anim="true" @ready="layerReady" ref="clayer">

<div class="analysis-layer" >
	<a href="javascript:;" class="close-btn" @click="$emit('close')">
	    <i class="fa fa-times"></i>
	</a>
	<div class="x-wrapper" v-show="innerVisible">
		<!-- 标题 -->
		<div class="x-head" >
			<h4>景区数据分析</h4>
			<head-nav :list="navlist" :index="partIndex" @click="switchPart" />
		</div>
		<!-- 内容 -->
		<div class="x-body">
			<transition @leave="leaveXAnim" @enter="enterXAnim">
			<keep-alive >
				<div :is="part" :area="area" :key="partIndex" ref="part" class="x-part"></div>
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
computed.navlist = function () {
	return [
		{icon: 'fa-line-chart', text: '客流量历史分析'},
		{icon: 'fa-location-arrow', text: '客流来源分析'},
		{icon: 'fa-pie-chart', text: '游客构成分析'},
		{icon: 'fa-bar-chart-o', text: '游客驻留时间分析'},
		{icon: 'fa-bar-chart-o', text: '游客语音流量分析'},
		{icon: 'fa-random', text: '游客来源去向'}
		// {icon: 'fa-gears', text: '景区关联分析'}
		// {icon: 'fa-bar-chart-o', text: '游客住宿分析'}
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
		require('mixins/with_cover.js'),
		require('comp/chart_layer/window_mix.js'),
		require('comp/chart_layer/loop_render_mix.js')
	],
	beforeCreate,
	beforeDestroy,
	components: {
		'part-1': require('comp/attraction/analysis_part_1.vue'),
		'part-2': require('comp/attraction/analysis_part_2.vue'),
		'part-3': require('comp/attraction/analysis_part_3.vue'),
		'part-4': require('comp/attraction/analysis_part_4.vue'),
		'part-5': require('comp/attraction/analysis_part_5.vue'),
		'part-6': require('comp/attraction/analysis_part_6.vue'),
		'part-7': require('comp/attraction/analysis_part_7.vue'),
		'close-box': require('comp/chart_layer/close-box.vue'),
		'head-nav': require('comp/attraction/responsive-head-nav.vue')
	}
};
</script>

<style scoped lang="less">
.x-head {
}
</style>
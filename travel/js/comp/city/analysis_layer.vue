<template>
<center-layer :width="layerWidth" :height="layerHeight" 
	anim="true" @ready="layerReady" ref="clayer">

<div class="analysis-layer" >
	<a href="javascript:;" class="close-btn" @click="$emit('close')">
	    <i class="fa fa-times"></i>
	</a>
	<div class="x-wrapper" v-show="innerVisible">
		<!-- 标题 -->
		<div class="x-head" :style="{'min-width': calHeadMinWidth(5)}">
			<h4>多景区数据分析</h4>
			<ul class="head-nav" >
				<li :class="{active: partIndex === 1}" @click="switchPart(1)">
					<i class="fa fa-line-chart"></i> 游客驻留分析
				</li>
				<li :class="{active: partIndex === 2}" @click="switchPart(2)">
					<i class="fa fa-area-chart"></i> 客流量分析
				</li>
				<li :class="{active: partIndex === 3}" @click="switchPart(3)">
					<i class="fa fa-location-arrow"></i> 客流来源分析
				</li>
				<li :class="{active: partIndex === 4}" @click="switchPart(4)">
					<i class="fa fa-pie-chart"></i> 游客构成分析
				</li>
				<li :class="{active: partIndex === 5}" @click="switchPart(5)">
					<i class="fa fa-bar-chart-o"></i> 游客语音流量分析
				</li>
				<!--
				<li :class="{active: partIndex === 6}" @click="switchPart(6)">
					<i class="fa fa-gears"></i> 景区关联分析
				</li>
				-->
			</ul>
		</div>
		<!-- 内容 -->
		<div class="x-body">
			<transition @leave="leaveXAnim" @enter="enterXAnim">
			<keep-alive>
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
		'part-1': require('./analysis_part_1.vue'),
		'part-2': require('./analysis_part_2.vue'),
		'part-3': require('./analysis_part_3.vue'),
		'part-4': require('./analysis_part_4.vue'),
		'part-5': require('./analysis_part_5.vue'),
		'part-6': require('./analysis_part_6.vue'),
		'close-box': require('comp/chart_layer/close-box.vue')
	}
};
</script>

<style scoped lang="less">

</style>
<template>
<center-layer width="96%" height="94%" anim="true" @ready="layerReady" ref="clayer">

<div class="analysis-layer" :class="{'full-mode': isFullMode}">
	<close-box @close="$emit('close')" @max="windowMax" @restore="windowRestore" :full="isFullMode"></close-box>
	<div class="x-wrapper" v-show="innerVisible">
		<!-- 标题 -->
		<div class="x-head">
			<h4>景区数据分析</h4>
			<ul class="head-nav">
				<li :class="{active: partIndex === 1}" @click="switchPart(1)">
					<i class="fa fa-line-chart"></i> 客流量历史分析
				</li>
				<li :class="{active: partIndex === 2}" @click="switchPart(2)">
					<i class="fa fa-location-arrow"></i> 客流来源分析
				</li>
				<li :class="{active: partIndex === 3}" @click="switchPart(3)">
					<i class="fa fa-pie-chart"></i> 游客构成分析
				</li>
				<li :class="{active: partIndex === 4}" @click="switchPart(4)">
					<i class="fa fa-bar-chart-o"></i> 游客驻留时间分析
				</li>

			</ul>
		</div>
		<!-- 内容 -->
		<div class="x-body">
			<transition @leave="leaveXAnim" @enter="enterXAnim">
			<keep-alive exclude="part-2">
				<div :is="part" :area="area" :key="partIndex" ref="part" class="x-part"></div>
			</keep-alive>
			</transition>
		</div>
	</div>
</div>

</center-layer>
</template>

<script>
import {config} from 'common';
var methods = {};
methods.layerReady = function () {
	this.partIndex = 1;
};
methods.switchPart = function (index) {
	if (index === this.partIndex) {
		return;
	}
	if (index > this.partIndex) {
		this.transitionDirection = 'left';
	} else {
		this.transitionDirection = 'right';
	}
	this.partIndex = index;
};
methods.handleWindowResize = function (v) {
	if (this.$refs.part) {
		this.$refs.part.$emit('window-resize', v);
	}
	if (v === 'full') {
		this.loopRenderStart(config.loopRenderInterval);
	} else if (v === 'restore') {
		this.loopRenderStop();
	}
};
var computed = {};
computed.innerVisible = function () {
	return this.partIndex > 0;
};
computed.part = function () {
	return 'part-' + this.partIndex;
};
var mounted = function () {
	this.$on('window-resize', this.handleWindowResize);
};
const beforeCreate = function () {
	this.transitionDirection = 'none';
};
const beforeDestroy = function () {
	this.loopRenderStop();
	this.$off('window-resize', this.handleWindowResize);
};
let destroyed = function () {
};
let dataFunc = function () {
	var o = {
		partIndex: 0
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: ['visible', 'area'],
	mounted,
	mixins: [
		require('comp/with_cover_mix.js'),
		require('comp/chart_layer/window_mix.js'),
		require('comp/transition/x_mix.js'),
		require('comp/chart_layer/loop_render_mix.js')
	],
	beforeCreate,
	beforeDestroy,
	destroyed,
	components: {
		'part-1': require('comp/attraction_analysis_part_1.vue'),
		'part-2': require('comp/attraction_analysis_part_2.vue'),
		'part-3': require('comp/attraction_analysis_part_3.vue'),
		'part-4': require('comp/attraction_analysis_part_4.vue'),
		'close-box': require('comp/chart_layer/close-box.vue')
	}
};
</script>

<style scoped lang="less">
.x-part {
	position: absolute;
	left: 0;
	top: 0;
}
</style>
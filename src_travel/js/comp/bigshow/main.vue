<template>
<div class="big-show" :class="[modeClass]">

	<!-- <v-logo /> -->
	<!-- 时间 -->
	<v-time />

	<!-- 排行 -->
	<rank-list />

	<!-- 地球 -->
	<!-- <v-globe /> -->

	<v-map :mode="mode" />

	<!-- 迁入迁出图表
	<chart-in-out />
	-->
	<!-- 实时客流量 -->
	<chart-realtime-user />

	<!-- 驻留时长 
	<chart-stay-time />

	-->

	<!-- 综合分析 散点图 
	<chart-all-type />

	-->

	<!-- 饼状图 
	<chart-pie-1 />
	<chart-pie-2 />
	<chart-pie-3 />

	-->

	<!-- 右边线 
	<r-line />
	-->

	<a href="javascript:;" class="switch-font-btn" @click="switchMode">
		<i class="fa fa-cube"></i>
	</a>
</div>
</template>

<script>
import 'root';
import localStore from 'util/store.js';
import store from 'store/bigshow.js';

var methods = {};
methods.switchMode = function () {
	if (this.mode >= 2) {
		this.mode = 1;
	} else {
		this.mode++;
	}
	localStore.set('bigshow_mode', this.mode);
};
var computed = {};
computed.modeClass = function () {
	return 'mode-' + this.mode;
};
var watch = {};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
	let localMode = localStore.get('bigshow_mode');
	let mode = 1;
	if (localMode) {
		mode = parseInt(localMode, 10);
	}
	var o = {
		mode
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	store,
	mixins: [],
	methods,
	computed,
	props: [],
	mounted,
	destroyed,
	components: {
		'v-logo': require('./logo.vue'),
		'v-head': require('./head.vue'),
		'v-time': require('./time.vue'),
		'rank-list': require('./rank-list.vue'),
		// 'v-globe': require('./globe.vue'),
		'v-map': require('./map.vue'),
		'chart-in-out': require('./chart-in-out.vue'),
		'chart-realtime-user': require('./chart-realtime-user.vue'),
		'chart-stay-time': require('./chart-stay-time.vue'),
		'chart-all-type': require('./chart-all-type.vue'),
		'chart-all-type-1': require('./chart-all-type-1.vue'),
		'chart-all-type-2': require('./chart-all-type-2.vue'),
		'chart-pie-1': require('./chart-pie-1.vue'),
		'chart-pie-2': require('./chart-pie-2.vue'),
		'chart-pie-3': require('./chart-pie-3.vue'),
		'r-line': require('./rline.vue')
	}
};
</script>

<style scoped lang="less">
.big-show {
	
}
.switch-font-btn {
	//color: #fff;
	position: fixed;
	right: 6px;
	bottom: 6px;
	i.fa {
		font-size: 24px;
	}
}
</style>
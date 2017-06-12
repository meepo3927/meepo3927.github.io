<template>
<div class="big-show">

	<!-- <v-logo /> -->
	<!-- 时间 -->
	<v-time />

	<!-- 排行 -->
	<rank-list />

	<!-- 地球 -->
	<!-- <v-globe /> -->

	<v-map />

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
</div>
</template>

<script>
var methods = {};
var computed = {};
var watch = {};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	watch,
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
</style>
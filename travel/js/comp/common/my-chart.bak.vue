<template>
<vue-echarts class="my-chart" 
	:loading="loading"
	:options="o"
	:theme="myTheme"
	:auto-resize="false"></vue-echarts>
</template>

<script>
var methods = {};
var computed = {};
computed.loading = function () {
	if (!this.o) {
		return true;
	}
	return false;
};
computed.myTheme = function () {
	return this.theme || 'shine';
};
var watch = {};
var mounted = function () {
	
};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: ['o', 'theme'],
	mounted,
	beforeDestroy,
	components: {
		'vue-echarts': (r) => {
			require.ensure([], () => {
				r(require('comp/common/ECharts.vue'));
			});
		}
	}
};
</script>

<style scoped lang="less">
.my-chart {
	
}
</style>
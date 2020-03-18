<template>
<ul class="head-nav">
	<li v-for="(v, i) in config" @click="onSwitch(i + 1)" class="mr5"
		:class="{active: index === i + 1}"
		v-show="!v.hidden">
		<i class="fa" :class="[v.icon]"></i>
		{{v.name}}
	</li>
</ul>
</template>

<script>
var methods = {};
methods.onSwitch = function (i) {
	this.$emit('change', i);
};
var computed = {};
var watch = {};
var mounted = function () {};
let beforeDestroy = function () {};
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
	props: ['config', 'index'],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.comp-xxx {
	
}
</style>
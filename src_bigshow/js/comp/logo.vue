<template>
<div class="v-logo">
	<img :src="src" alt="">
</div>
</template>

<script>
var methods = {};
var computed = {};
computed.src = function () {
	return './images/logo.png';
};
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
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.v-logo img {
	width: 230px;
	height: 42px;
}
</style>
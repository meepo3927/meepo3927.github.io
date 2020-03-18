<template>
<div class="v-logo">
	<img :src="src" alt="">
</div>
</template>

<script>
var methods = {};
var computed = {};
computed.src = function () {
	return this.vImgPath + '/logo.png';
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

</style>
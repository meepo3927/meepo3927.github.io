<template>
<a href="javascript:;" class="layer-close-btn" @click="$emit('click')">
	<i class="fa fa-times"></i>
</a>
</template>

<script>
let methods = {};
let computed = {};
let watch = {};
const mounted = function () {};
const destroyed = function () {};
const dataFunc = function () {
	let o = {};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	watch,
	props: [],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.layer-close-btn {
	position: absolute;
	right: 12px;
	top: 10px;
	line-height: 0;
	font-size: 24px;
	color: #333;
}
</style>

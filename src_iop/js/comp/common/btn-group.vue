<template>
<div class="btn-group">
	<button class="btn btn-default" v-for="(v,index) in list" 
		:class="{active: active === index}"
		@click="set(index)"
		v-text="v"></button>
</div>
</template>

<script>
let methods = {};
methods.set = function (index) {
	this.active = index;
	this.$emit('input', index);
};
let computed = {};
let watch = {};
watch.value = function (v) {
	this.set(v);
};
const mounted = function () {
	if (this.value !== undefined) {
		this.set(index);
	} else {
		this.set(0);
	}
};
const destroyed = function () {};
const dataFunc = function () {
	let o = {
		active: -1
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	watch,
	props: ['list', 'value'],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.btn-group {
	
}
</style>

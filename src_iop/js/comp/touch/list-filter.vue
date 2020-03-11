<template>
<div class="">
	<input type="checkbox" id="list_filter_1" name="listfilter" 
		v-model="c[0]" />
	<label for="list_filter_1">黑名单</label>

	<input type="checkbox" id="list_filter_2" name="listfilter" 
		v-model="c[1]" class="ml10" />
	<label for="list_filter_2">红名单</label>

	<input type="checkbox" id="list_filter_3" name="listfilter" 
		v-model="c[2]" class="ml10" />
	<label for="list_filter_3">敏感客户</label>

	<input type="checkbox" id="list_filter_4" name="listfilter" 
		v-model="c[3]" class="ml10" />
	<label for="list_filter_4">全国家庭网</label>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.valueStr = function () {
	return this.c.map((v) => {
		return (v ? '1': '0');
	}).join('');
};
let watch = {};
watch.value = function (v) {
	if (!v) {
		return;
	}
	for (let i = 0; i < v.length; i++) {
		let char = v.charAt(i);
		let b = char === '1' ? true : false;
		this.c.splice(i, 1, b);
	}
};
watch.valueStr = function (v) {
	this.$emit('input', v);
};
const created = function () {};
const mounted = function () {
	this.$emit('input', this.valueStr);
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		c: [true, true, true, true]
	};
	return o;
};
export default {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: ['value'],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
input[type=checkbox] {
	vertical-align: -1px;
}
</style>

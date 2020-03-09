<template>
<input type="text" :value="value" @input="onInput" />
</template>

<script>
let methods = {};
const fix = (v) => {
	let n = parseFloat(v);
	if (isNaN(n)) {
		return 0;
	}
	if (v.charAt(v.length - 1) === '.') {
		return n + '.';
	}
	return n;
};
methods.onInput = function () {
	let oValue = this.$el.value.trim();
	let val = fix(oValue);

	if (this.numType === 'integer') {
		val = parseInt(val, 10);
	}

	if (this.min !== undefined) {
		if (val < this.min) {
			val = this.min;
		}
	}
	this.$el.value = val;
	this.$emit('input', val);
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {};
	return o;
};
export default {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: ['value', 'numType', 'min'],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.vue-comp {
	
}
</style>

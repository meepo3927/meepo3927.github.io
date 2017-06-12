<template>
<select class="m-chosen">
	<option v-for="v in o" v-text="v.text" :value="v.value"></option>
</select>
</template>

<script>
import 'lib/chosen.jquery.js';
var methods = {};
methods.update = function () {
	$(this.$el).trigger('chosen:updated');
};
var computed = {};
computed.o = function () {
	var arr = [];
	this.options && this.options.forEach((v) => {
		var item = {};
		if (typeof v === 'object') {
			item = v;
		} else {
			item.text = item.value = ('' + v);
		}
		arr.push(item);
	});
	return arr;
};
computed.length = function () {
	return this.o.length;
};
let watch = {};
watch.o = function () {
	this.$nextTick(this.update);
};
var mounted = function () {
	$(this.$el).chosen().change((e, data) => {
		var val = data.selected;
		var selected = e.currentTarget.selectedOptions || [];
		this.$emit('change', e, val, selected[0] || {});
	});
};
let destroyed = function () {
	$(this.$el).chosen("destroy");
};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	watch,
	props: ['options'],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.m-chosen {
	min-width: 120px;
}
</style>
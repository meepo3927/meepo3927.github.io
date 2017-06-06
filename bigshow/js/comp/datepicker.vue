<template>
	<input type="text" class="input input-text" 
		:value="value">
</template>

<script>
var mDate = require('lib/mdate.js');

var methods = {};
methods.updateValue = function (val) {
	this.$emit('input', val);
};
var computed = {};
var mounted = function () {
	new mDate(this.$el, {
		onChoose: (val) => {
			this.updateValue(val);
		}
	});
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: ['value'],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.input {
	
}
</style>
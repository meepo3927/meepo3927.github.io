<template>
	<input type="text" :class="[inputClass]" 
		:value="value">
</template>

<script>
var mDate = require('lib/mdate.js');

var methods = {};
methods.updateValue = function (val) {
	this.$emit('input', val);
};
var computed = {};
computed.inputClass = function () {
	return this.className || 'input-text-big';
};
var mounted = function () {
	new mDate(this.$el, {
		onChoose: (val) => {
			this.updateValue(val);
		}
	});
};
const beforeDestroy = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: ['value', 'className'],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
input {
	width: 160px;
}
</style>
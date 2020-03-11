<template>
<div class="c">
	<span v-text="channelText"></span>
	<span v-text="errmsg" v-if="errmsg" class="text-error "></span>
</div>
</template>

<script>
var methods = {};
methods.check = function () {
	if (this.len) {
		this.errmsg = '';
		return true;
	}
	this.errmsg = '请选择至少一个渠道';
	return false;
};
var computed = {};
computed.len = function () {
	return this.value ? this.value.length : 0;
};
computed.channelText = function () {
	if (this.len) {
		return '已选择' + this.len + '个渠道';
	}
};
let watch = {};
watch.len = function () {
	this.check();
};
var mounted = function () {
};
export default {
	data: function () {
		return {

		};
	},
	watch,
	methods,
	computed,
	props: [],
	mounted,
	mixins: [require('./mix.js')]
};
</script>

<style scoped lang="less">
.c {
	
}
</style>
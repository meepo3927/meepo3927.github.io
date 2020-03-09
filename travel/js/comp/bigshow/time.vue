<template>
<div class="v-time">
	<i class="fa fa-clock-o"></i>
	<span v-text="str"></span>
</div>
</template>

<script>
import tool from 'util/tool';

var methods = {};
methods.tick = function () {
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();

	var h = date.getHours();
	var i = date.getMinutes();
	var s = date.getSeconds();

	this.str = [
		y, tool.padZero(m), tool.padZero(d)
	].join('-') + ' ' + [
		tool.padZero(h),
		tool.padZero(i),
		tool.padZero(s)
	].join(':');
	this.timer = setTimeout(() => {
		this.tick();
	}, 1000);
};
var computed = {};
var watch = {};
var mounted = function () {
	this.tick();
};
let beforeDestroy = function () {
	if (this.timer) {
		clearTimeout(this.timer);
		this.timer = null;
	}
};
let dataFunc = function () {
	var o = {
		str: ''
	};
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
.v-time {
	color: rgb(46, 147, 255);
	.fa {
		font-weight: normal;
	}
}

</style>
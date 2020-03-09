<template>
<div class="num-bar-2">
	<div class="item x-1"></div>
	<div class="item x-2"></div>
	<div class="item x-3"></div>
	<div class="item x-4"></div>

	<div class="item light" :style="{width: lightWidthPercent}" 
		v-show="leftWidth > 0"
		ref="light">
		<div class="x-wrapper" ref="wrapper"></div>
	</div>
	<div class="num" v-text="num" :style="numStyle"></div>
</div>
</template>

<script>
import $ from 'jquery';
var methods = {};
const RATIO = 50;
const MIN_PERCENT = 5;
methods.refresh = function () {
};
methods.loop = function () {
	if (this.stoped) {
		return false;
	}
	var wrapperWidth = this.$wrapper.filter(':visible').width();
	if (wrapperWidth) {
		var marginLeft = this.$wrapper.css('margin-left');
		marginLeft = parseInt(marginLeft, 10);
		var pWidth = this.$light.width();
		if (Math.abs(marginLeft) > pWidth) {
			marginLeft = 0;
		} else {
			marginLeft++;
		}
		this.$wrapper.css('margin-left', marginLeft + 'px');
	}
	// window.requestAnimationFrame(this.loop);
	this.timer = setTimeout(this.loop, RATIO);
};
var computed = {};
computed.leftWidth = function () {
	if (this.percent) {
		return Math.min(Math.max(0, this.percent * 100), 100);
	}
	return 0;
};
computed.fadeWidthPercent = function () {
	return (100 - this.lightWidth) + '%';
};
computed.lightWidth = function () {
	if (this.leftWidth === 0) {
		return 0;
	}
	return Math.max(this.leftWidth, MIN_PERCENT);
};
computed.lightWidthPercent = function () {
	return this.lightWidth + '%';
};
computed.numStyle = function () {
	let left = this.lightWidth;
	if (left < 1) {
		left = '4px';
	} else if (left > 90) {
		left = '80%';
	} else {
		left = (left + 2) + '%';
	}
	return {left};
};
var mounted = function () {
	this.$light = $(this.$refs.light);
	this.$wrapper = $(this.$refs.wrapper);
	this.loop(1);
};
var beforeDestroy = function () {
	if (this.timer) {
		clearTimeout(this.timer);
		this.timer = null;
	}
	this.stoped = true;
};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: ['percent', 'num'],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@height: 16px;
.num-bar-2 {
	height: @height;
	font-size: 0;
	position: relative;
	width: 260px;
}
.item {
	position: absolute;
	top: 0;
	height: 100%;
	border-radius: 7px;
}
.light {
	left:  0;
	z-index: 10;
	overflow: hidden;
}
.light .x-wrapper {
	height: 100%;
	width: 200%;
	transform: translateX(-50%);
}
.num {
	font-size: 14px;
	position: absolute;
	top: 1px;
	text-align: center;
	z-index: 15;
	color: #fff;
}
.x-1 {
	z-index: 8;
	left: 0;
	background-color: #8EC31F;
	width: 25%;
}
.x-2 {
	right: 60%;
	width: 40%;
	z-index: 6;
	background-color: #75AB00;
}
.x-3 {
	right: 20%;
	width: 50%;
	z-index: 4;
	background-color: #6A930F;
}
.x-4 {
	width: 80%;
	right: 0;
	z-index: 2;
	background-color: #456700;
}
</style>
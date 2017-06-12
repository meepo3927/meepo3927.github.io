<template>
<div class="num-bar">
	<div class="item x-1"></div>
	<div class="item x-2"></div>
	<div class="item x-3"></div>

	<div class="fade" :style="{width: fadeWidthPercent}"></div>
	<div class="light" :style="{width: lightWidthPercent}" v-show="leftWidth > 0">
		<div class="x-wrapper" ref="wrapper">
			<div></div>
			<i class="fa fa-caret-right"></i>
		</div>
	</div>
</div>
</template>

<script>
import {$} from 'common';
var methods = {};
const time = 1300;
const RATIO = time / 17;
const MIN_PERCENT = 10;
methods.refresh = function () {
};
methods.loop = function (count) {
	if (this.stoped) {
		return false;
	}
	var wrapperWidth = this.$wrapper.filter(':visible').width();
	if (wrapperWidth) {
		var left = parseFloat(this.$icon.css('left')) || 0;
		var iconWidth = this.$icon.width();
		var step = (wrapperWidth - iconWidth) / RATIO;
		left += step;
		if (count >= RATIO) {
			left = 0;
			count = 0;
		}
		this.$icon.css('left', left + 'px');
	}
	window.requestAnimationFrame(() => {
		this.loop(count + 1);
	});
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
var mounted = function () {
	this.$wrapper = $(this.$refs.wrapper);
	this.$icon = this.$wrapper.children('.fa');
	this.loop(1);
};
var destroyed = function () {
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
	props: ['percent'],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
@height: 22px;
.num-bar {
	height: @height;
	font-size: 0;
	position: relative;
	border: 1px solid #333;
	.x-1 {
		width: 60%;
		background-color: #00ff00;
	}
	.x-2 {
		width: 25%;
		background-color: #FF6633;
	}
	.x-3 {
		width: 15%;
		background-color: #ff0000;
	}
	.light, .fade {
		position: absolute;
		top: 0;
		height: 100%;
	}
	.light {
		width: 0%;
		left: 0;
	}
	.light .x-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		padding-top: 1px;
		border-right: 1px solid #fff;
	}
	.light .x-wrapper > div {
		border-bottom: 1px solid #fff;
		width: 100%;
		margin-top: (@height / 2) - 2;
	}
	.light .x-wrapper > .fa {
		color: #fff;
		font-size: 32px;
		line-height: @height - 2;
		position: absolute;
		left: 0;
		top: 0;
	}
	.fade {
		width: 0%;
		right: 0;
		background-color: #000;
		opacity: .5;
		filter: alpha(opacity=40);
	}
}
.num-bar > .item {
	height: 100%;
	display: inline-block;
}
</style>
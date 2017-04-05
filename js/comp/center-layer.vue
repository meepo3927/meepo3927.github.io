<template>
<div class="m-center-layer" >
	<div class="x-wrapper-1">
		<div class="x-wrapper-2" ref="w2">
			<div class="x-wrapper-3" ref="w3">
				<slot></slot>
			</div>
		</div>
	</div>
</div>
</template>

<script>
var $ = require('jquery');

let isPercent = function (str) {
	if (!str || !str.charAt) {
		return false;
	}
	str = str.trim();
	return str.charAt(str.length - 1) === '%';
};
const animDuration = 350;
const noop = function () {};

var methods = {};
methods.renderWidth = function (options = {}) {
	let val = this.width || 'auto';
	let complete = options.complete || noop;
	var $w3 = $(this.$refs.w3);
	if (this.isAnim && val !== 'auto') {
		$w3.stop().animate({width: val}, animDuration, complete);
	} else {
		$w3.css('width', val);
		setTimeout(complete);
	}
};
methods.renderHeight = function (options = {}) {
	let val = this.height || 'auto';
	let complete = options.complete || noop;
	var $w2 = $(this.$refs.w2);
	if (this.isAnim && val !== 'auto') {
		$w2.stop().animate({'height': val}, animDuration, complete);
	} else {
		$w2.css('height', val);
		setTimeout(complete);
	}
};
methods.render = function (options = {}) {
	let completeCount = 0;
	let allComplete = options.complete || noop;
	let wComplete = () => {
		completeCount++;
		if (completeCount >= 2) {
			allComplete();
		}
	};
	let hComplete = () => {
		completeCount++;
		if (completeCount >= 2) {
			allComplete();
		}
	};
	this.renderWidth({complete: wComplete});
	this.renderHeight({complete: hComplete});
};
var computed = {};
computed.isAnim = function () {
	return this.anim === 'true' || this.anim === true;
};
let watch = {};
watch.width = function () {
	this.$nextTick(this.renderWidth);
};
watch.height = function () {
	this.$nextTick(this.renderHeight);
};
var mounted = function () {
	this.render({
		complete: () => {
			this.$emit('ready');
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
	watch,
	computed,
	props: ['width', 'height', 'anim'],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.m-center-layer {
}
</style>
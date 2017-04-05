<template>
<div class="stage-2">
	<div class="canvas-holder" ref="canvasHolder" :style="canvasHolderStyle">
		<canvas ref="cvs"></canvas>
	</div>
</div>
</template>

<script>
var docElem = document.documentElement;
const headHeight = 100;
const bottomGap = 10;
const canvasWidthRate = 4;
const canvasHeightRate = 6;
var methods = {};
methods.draw = function () {
	var context = this.$refs.cvs.getContext('2d');
	var img = new Image();
	img.src = './images/1.png';
	context.drawImage(img, 10, 10);
};
methods.calCanvasSize = function () {
	var docWidth = docElem.clientWidth;
	var docHeight = docElem.clientHeight - headHeight - bottomGap;
	if (docWidth * canvasHeightRate > docHeight * canvasWidthRate) {
		var cheight = docHeight;
		var cwidth = Math.ceil(cheight * canvasWidthRate / canvasHeightRate);
	} else {
		cwidth = docWidth;
		cheight = Math.ceil(cwidth * canvasHeightRate / canvasWidthRate);
	}

	return {
		h: cheight,
		w: cwidth
	};
};
methods.renderCanvasSize = function () {
	var {h,w} = this.calCanvasSize();
	this.canvas.h = h;
	this.canvas.w = w;
	this.$refs.cvs.height = h;
	this.$refs.cvs.width = w;
};
methods.handleResize = function () {
	this.renderCanvasSize();
	this.draw();
};
var computed = {};
computed.canvasWidth = function () {
	return this.canvas.w;
};
computed.canvasHeight = function () {
	return this.canvas.h;
};
computed.canvasHolderStyle = function () {
	return {
		height: this.canvasHeight + 'px',
		width: this.canvasWidth + 'px',
		marginLeft: -(this.canvasWidth / 2) + 'px'
	};
};
var mounted = function () {
	this.renderCanvasSize();
	this.draw();
	window.addEventListener('resize', this);
};
let destroyed = function () {
	window.removeEventListener('resize', this);
};
let dataFunc = function () {
	let canvas = {
		h: 0,
		w: 0
	};
	var o = {
		canvas
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
</style>
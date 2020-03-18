<template>
<div class="mui-slider-root">
	<div class="mui-slider" @click.self="onSliderClick" ref="slider">
		<div class="slider-inner" :style="{left}" 
			@click.self="onSliderClick">
			<div class="slider-btn" @mousedown="onButtonMouseDown"></div>
		</div>
	</div>
</div>
</template>

<script>
const fixedValue = (v) => {
	if (v < 0) {
		return 0;
	}
	if (v > 100) {
		return 100;
	}
	return v;
};
let methods = {};
methods.getSliderWidth = function () {
	return this.$refs.slider.getBoundingClientRect().width;
};
methods.onSliderClick = function (e) {
	const currentX = e.clientX;
	const rect = this.$refs.slider.getBoundingClientRect();
	const sliderWidth = rect.width;
	const sliderLeft = rect.left;
	const newPos = (currentX - sliderLeft) / sliderWidth * 100;
	this.currentValue = newPos;
};
methods.onButtonMouseDown = function (e) {
	this.onDragStart(e);
	window.addEventListener('mousemove', this.onDragging);
	window.addEventListener('mouseup', this.onDragEnd);
};
methods.onDragStart = function (e) {
	this.dragging = true;
	this.startX = event.clientX;
	this.startPos = this.currentValue;
};
methods.onDragging = function () {
	if (this.dragging) {
		this.currentX = event.clientX;
		const diff = (this.currentX - this.startX) / this.getSliderWidth() * 100;
		this.currentValue = fixedValue(this.startPos + diff);
	}
};
methods.onDragEnd = function () {
	this.dragging = false;
	window.removeEventListener('mousemove', this.onDragging);
	window.removeEventListener('mouseup', this.onDragEnd);
};
methods.calCurrentValue = function (v) {
	let v1 = v - this.min;
	return (v1 * 100) / this.vdiff;
};
let computed = {};
computed.left = function () {
	return this.currentValue + '%'
};
computed.vdiff = function () {
	return this.max - this.min;
};
let watch = {};
watch.currentValue = function (v) {
	let min = parseFloat(this.min);
	let value = Math.round(min + (v * this.vdiff / 100));
	if (value !== this.value) {
		this.$emit('input', value);
	}
};
watch.value = function (v) {
	let newValue = this.calCurrentValue(v);
	if (newValue !== this.currentValue) {
		this.currentValue = fixedValue(newValue);
	}
};
const created = function () {};
const mounted = function () {
	if (this.value !== undefined) {
		let newValue = this.calCurrentValue(this.value);
		this.currentValue = fixedValue(newValue);
	}
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		currentValue: 0
	};
	return o;
};
module.exports = {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: {
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		value: {
			type: Number
		}
	},
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@side-pad:       8px;
@slider-height:  8px;
@back-color:     #4693DB;
.mui-slider-root {
	padding-left: @side-pad;
	padding-right: @side-pad;
}
.mui-slider {
	background-color: @back-color;
	border-radius: 4px;
	border: 1px solid #D3D3D3;
	box-shadow: inset 0 0 3px rgba(51,51,51,0.45);

	height: @slider-height;
	position: relative;

	cursor: pointer;
}
.slider-inner {
	background-color: #fafafa;
	box-shadow: inset 0 1px 1px #F0F0F0, 0 5px 9px -5px #BBB;
	
	transform: background .5s ease 0s;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border-radius: 2px;
}
.slider-btn {
	width: 16px;
	height: 16px;
	left: -8px;
	top: -5px;
	position: absolute;
	z-index: 10;
	border: 2px solid @back-color;
	border-radius: 50%;
	background: #FFF;
	cursor: pointer;
	transition: transform .3s ease 0s;
	&:hover {
		transform: scale(1.2);
	}
}
</style>

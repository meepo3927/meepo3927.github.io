<template>
<div class="time-bar">
	<div class="x-wrapper">
		<button class="scroll-btn" type="button"
			@click="toggleState">{{buttonText}}</button>

		<!-- 背景 -->
		<div class="bg-bar"></div>
		<!-- 时间列表 -->
		<div class="time-list">
			<ul class="clearfix" :class="[ulClassName]">
				<li v-for="(v, k) in list" :class="{active: v.hour === activeHour}"
					:title="getTimeTitle(v)"
					@click="onDotClick(v, k)" >
					<span v-text="getTimeText(v.hour)"></span>
					<div class="dot" ></div>
				</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>

import MDate from 'lib/mdate.js';

const loopInterval = 10 * 1000;

const created = function () {};
var methods = {};
methods.fetchRender = function () {
	let item = this.activeItem;
	this.$emit('change', item);
};
methods.onDotClick = function (v, index) {
	if (index === this.activeIndex) {
		return;
	}
	this.activeIndex = index;
	if (this.state === 'scroll') {
		this.loopStart();
	}
	// request
	if (isInvalidHour(this.activeHour)) {
		return mlayer.msg('该时段没有数据');
	}
	this.fetchRender();
};
methods.getTimeText = function (hour) {
	return hour + '点';
};
methods.getTimeTitle = function (v) {
	let prefix = v.isYesterday ? '昨天' : '今天';
	return prefix + this.getTimeText(v.hour);
};
methods.toggleState = function () {
	if (this.state === 'scroll') {
		this.state = 'stoped';

		this.loopStop();
		mlayer.msg('已停止自动滚动');
	} else {
		this.state = 'scroll';
		this.loopStart();
		mlayer.msg('已开启自动滚动');
	}
};
methods.loopStart = function () {
	this.loopStop();
	this.loopTimer = setTimeout(this.loopRun, loopInterval);
};

const isInvalidHour = (hour) => {
	if (hour >= 23) {
		return true;
	}
	if (hour >= 0 && hour <= 7) {
		return true;
	}
	return false;
};
methods.fixActiveIndex = function (index) {
	while(1) {
		let item = (index > 23) ? this.list[index - 24] : this.list[index];
		if (!item) {
			break;
		}
		let hour = item.hour;
		if (isInvalidHour(hour)) {
			index++;
		} else {
			return index;
		}
	}
	return index;
};
methods.loopRun = function () {
	if (this.activeIndex >= 23) {
		this.activeIndex = this.fixActiveIndex(0);
	} else {
		this.activeIndex = this.fixActiveIndex(this.activeIndex + 1);
	}
	this.fetchRender();
	this.loopTimer = setTimeout(this.loopRun, loopInterval);
};
methods.loopStop = function () {
	if (this.loopTimer) {
		clearTimeout(this.loopTimer);
		this.loopTimer = null;
	}
};
methods.getCurHour = function () {
	let d = new Date();
	return d.getHours();
};
methods.calHour = function () {
	this.curHour = this.getCurHour();
};
var computed = {};
computed.ulClassName = function () {
	return 'active-' + this.activeIndex;
};
computed.buttonText = function () {
	return (this.isScrolling ? '暂停' : '滚动')
};
computed.isScrolling = function () {
	return (this.state === 'scroll');
};
computed.list = function () {
	let cur = this.curHour;
	let curYMD = MDate.Util.getYMDStr();
	let prevYMD = MDate.Util.getDateOffsetStr(new Date, -1, 'day');
	let a = [];
	for (let i = 23; i >= 0; i--) {
		let item = {};
		item.hour = cur - i;
		item.dateStr = curYMD;
		if (item.hour < 0) {
			item.hour += 24;
			item.dateStr = prevYMD;
			item.isYesterday = true;
		}
		a.push(item);
	}
	return a;
};
computed.activeItem = function () {
	return this.list[this.activeIndex] 
		|| this.list[this.activeIndex - 24]
		|| {};
};
computed.activeHour = function () {
	return this.activeItem.hour;
};
var watch = {};
var mounted = function () {
	// 实时计算当前小时
	this.calHourTick = setInterval(this.calHour, 30 * 1000);
	// 修正index
	this.activeIndex = this.fixActiveIndex(23);

	// 请求数据
	this.$nextTick(this.fetchRender);
};
let beforeDestroy = function () {
	if (this.calHourTick) {
		clearInterval(this.calHourTick);
		this.calHourTick = null;
	}
};
let dataFunc = function () {
	var o = {
		curHour: this.getCurHour(),
		state: 'stoped',
		activeIndex: 0
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
	created,
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@import (less) "../../../less/global/config";

@bar-width:        @layerWidth-2;
@time-line-width:  @bar-width - 30px;
@time-line-bottom: 10px;
@text-color:  #333;

@bg-zindex:  10;
@scroll-btn-zindex:  @bg-zindex + 5;

@item-width:  36px;

.time-bar {
	font-size: 13px;
	height: 42px;
	width: @bar-width;

	& > .x-wrapper {
		height: 100%;
		width: 100%;
		position: relative;
		background-color: rgba(30, 30, 30, .2);
		border-radius: 8px;
		padding: 2px;
	}

	.scroll-btn {
		color: @text-color;
		background-color: #fff;
		border: 1px solid #f2f2f2;
		border-radius: 5px;
		left: 8px;
		bottom: @time-line-bottom - 5px;
		position: absolute;
		z-index: @scroll-btn-zindex;
		font-size: 12px;
		padding: 1px 3px;
	}
	.bg-bar {
		width: @time-line-width;
		height: 5px;
		background-color: #9DCB38;
		position: absolute;
		left: 28px;
		bottom: @time-line-bottom;
		z-index: @bg-zindex;
	}
}

.time-list {
	position: absolute;
	left: 45px;
	bottom: @time-line-bottom - 1px;
	z-index: @scroll-btn-zindex - 1;
	width: @time-line-width - 20px;

	overflow: hidden;
}
.time-list > ul {
	width: 870px;
	transition: all .5s ease;
	& > li {
		float: left;
		text-align: center;
		display: inline-block;
		width: @item-width;
		cursor: pointer;
		& > span {
			background-color: #fff;
			color: @text-color;
			border-radius: 6px;
			padding: 0px 6px;
			font-size: 12px;
			white-space: nowrap;
			visibility: hidden;
		}
		& > .dot {
			width: 10px;
			height: 10px;
			background-color: #fff;
			border: 1px solid #ccc;
			border-radius: 50%;

			margin-top: 6px;
			margin-left: auto;
			margin-right: auto;
		}
	}
	& > li:hover > span {
		visibility: visible;
	}
	& > li.active {
		& > span {
			visibility: visible;
		}
		& > .dot {
			background-color: #FF9429;
		}
	}
}
.time-list > ul {
	@offset-5:  0;
	@offset-6:  -@item-width;
	@offset-7:  @offset-6 - @item-width;
	@offset-8:  @offset-7 - @item-width;
	@offset-9:  @offset-8 - @item-width;
	@offset-10:  @offset-9 - @item-width;
	@offset-11:  @offset-10 - @item-width;
	@offset-12:  @offset-11 - @item-width;
	@offset-13:  @offset-12 - @item-width;
	@offset-14:  @offset-13 - @item-width;
	@offset-15:  @offset-14 - @item-width;
	@offset-16:  @offset-15 - @item-width;
	@offset-17:  @offset-16 - @item-width;
	@offset-18:  @offset-17 - @item-width;
	@offset-19:  @offset-18;
	@offset-20:  @offset-19;
	@offset-21:  @offset-20;
	@offset-22:  @offset-21;
	@offset-23:  @offset-22;
	&.active-1 {
	}
	&.active-2 {}
	&.active-3 {}
	&.active-4 {}
	&.active-5 {
		transform: translateX(@offset-5);
	}
	&.active-6 {
		transform: translateX(@offset-6);
	}
	&.active-7 {
		transform: translateX(@offset-7);
	}
	&.active-8 {
		transform: translateX(@offset-8);
	}
	&.active-9 {
		transform: translateX(@offset-9);
	}
	&.active-10 {
		transform: translateX(@offset-10);
	}
	&.active-11 {
		transform: translateX(@offset-11);
	}
	&.active-12 {
		transform: translateX(@offset-12);
	}
	&.active-13 {
		transform: translateX(@offset-13);
	}
	&.active-14 {
		transform: translateX(@offset-14);
	}
	&.active-15 {
		transform: translateX(@offset-15);
	}
	&.active-16 {
		transform: translateX(@offset-16);
	}
	&.active-17 {
		transform: translateX(@offset-17);
	}
	&.active-18 {
		transform: translateX(@offset-18);
	}
	&.active-19 {
		transform: translateX(@offset-19);
	}
	&.active-20 {
		transform: translateX(@offset-20);
	}
	&.active-21 {
		transform: translateX(@offset-21);
	}
	&.active-22 {
		transform: translateX(@offset-22);
	}
	&.active-23 {
		transform: translateX(@offset-23);
	}
}
</style>
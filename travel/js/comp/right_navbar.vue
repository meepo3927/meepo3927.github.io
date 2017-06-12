<template>
<div class="navbar" :class="[overflowHidden ? 'o-hidden': 'o-visible']">
	<a href="javascript:;" class="btn-1" @click="click(1)" :title="areaName">
		<span>{{areaName}}</span>
		<i class="fa fa-caret-down"></i>
	</a>
	<a href="javascript:;" class="btn-2" @click="click(2)">
		<i class="fa fa-line-chart"></i>
		实时监控
	</a>
	<a href="javascript:;" class="btn-3" @click="click(3)">
		<i class="fa fa-area-chart"></i>
		数据分析
	</a>

	<a href="javascript:;" class="toggle-btn" :title="toggleTitle"
		v-show="toggleBtnVisible"
		@click="toggle">
		<i class="fa " :class="[overflowHidden ? 'fa-angle-right' : 'fa-angle-left']"></i>
	</a>
</div>
</template>

<script>
import myStore from 'store/rightbar.js';
var methods = {};
methods.click = function (index) {
	this.$emit('click', index);
};
methods.toggle = function () {
	if (this.overflowHidden) {
		this.overflowHidden = false;
	} else {
		this.overflowHidden = true;
	}
};
var computed = {};
computed.toggleTitle = function () {
	return (this.overflowHidden) ? '展开' : '收起';
};

computed.toggleBtnVisible = function () {
	if (!this.isAttraction) {
		return false;
	}
	if (this.isNameVerylong) {
		return true;
	}

	return false;
};
computed.isNameVerylong = function () {
	if (!this.areaName) {
		return false;
	}
	return (this.areaName.length > 9);
};
computed.myArea = function () {
	return this.area || {};
};
computed.isCity = function () {
	return (this.myArea.level === 'city');
};
computed.isAttraction = function () {
	return (this.myArea.level === 'attraction');
};
var mounted = function () {};
let dataFunc = function () {
	var o = {
		overflowHidden: true
	};
	return o;
};
let watch = {};
watch.areaName = function () {
	if (!this.isAttraction) {
		if (!this.overflowHidden) {
			this.overflowHidden = true;
		}

	} else if (!this.toggleBtnVisible) {
		this.overflowHidden = true;
	}
};
export default {
	watch,
	store: myStore,
	data: dataFunc,
	methods,
	computed,
	props: ['areaName', 'area'],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../less/global/config";

@height: @bar-height-1;
@btnHeight: @height - 18px;
.navbar {
	position: fixed;
	top: @layerTop1;
	right: @layerRight;
	
	height: @height;
	background-color: @theme-color;
	background: linear-gradient(to bottom, lighten(@theme-color, 10%), darken(@theme-color, 10%));
	font-size: 0;
	white-space: nowrap;
	padding-right: 20px;
}
.navbar > a {
	display: inline-block;
	height: @btnHeight;
	margin-top: (@height - @btnHeight) / 2;
	color: #fff;
	line-height: @btnHeight;
	font-size: @title-font-size;
	padding-left: 10px;
	padding-right: 10px;
	&:hover {
		color: #ddd;
	}
}
.navbar.o-hidden {
	width: @layerWidth-2;
	.btn-1 span {
		max-width: 160px;
	}
}
.navbar.o-visible {
	.btn-big-screen {
		border-left: 1px solid darken(@themeColor, 10%);
	}
}
.btn-1 span {
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	vertical-align: -2px;
}

.btn-2,
.btn-3,
.heatmap-toggle-btn {
	border-left: 1px solid darken(@themeColor, 10%);
}
.btn-2 {}
.btn-3 {}
.toggle-btn {
	position: absolute;
	right: 1px;
	top: -5px;
}
.toggle-btn > .fa {
	font-size: 26px;
}
</style>
<template>
<div class="table-layer">
	<div class="table-wrapper" ref="tableWrapper" >
		<slot></slot>
	</div>

	<!-- footer-bar -->
	<div class="footer-bar">
		<a href="javascript:;" :title="toggleTitle" @click="toggle">
			<i class="fa " :class="[tableVisible ? 'fa-toggle-up' : 'fa-toggle-down']"></i>
			<span>{{toggleTitle}}</span>
		</a>
		<a href="javascript:;" class="fr" title="返回上一级" v-if="isBackVisible" @click="$emit('back')">
			<span>返回上一级</span>
			<i class="fa fa-level-up"></i>
		</a>
	</div>
</div>
</template>

<script>
var methods = {};
methods.toggle = function () {
	if (this.tableVisible) {
		$(this.$refs.tableWrapper).slideUp();
		this.tableVisible = false;
	} else {
		$(this.$refs.tableWrapper).slideDown();
		this.tableVisible = true;
	}
};
var computed = {};
computed.isBackVisible = function () {
	if (this.isProvince) {
		return false;
	}
	if (this.area.level === 'city') {
		if (this.auth === 'all') {
			return true;
		}
		return false;
	}
	return true;
};
computed.isProvince = function () {
	return this.area.level === 'province';
};
computed.toggleTitle = function () {
	return this.tableVisible ? '收起' : '展开';
};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		tableVisible: true
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: ['area', 'auth'],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../less/global/config";
.table-layer {
	position: fixed;
	top: @layerTop2;
	bottom: 0;
	overflow: hidden;
	left: @layerLeft;
	width: @layerWidth-1;

	.table-wrapper {
		max-height: 430px;
		overflow: auto;
	}
}
@bar-height: 30px;
.footer-bar {
	height: @bar-height;
	background-color: #222;
	padding: 4px 0 0 0;
	position: absolute;
	left: 0;
	width: 100%;
	a {
		display: inline-block;
		padding: 4px 10px 2px;
		color: #fff;
		font-size: 16px;
	}
	a span {
		font-size: 14px;
		vertical-align: 1px;
	}
}
</style>
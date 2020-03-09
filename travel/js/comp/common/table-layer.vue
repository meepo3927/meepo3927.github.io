<template>
<div class="table-layer">
	<div class="table-wrapper" ref="tableWrapper" >
		<slot></slot>
	</div>

	<!-- footer-bar -->
	<div class="footer-bar" :class="[footerBarClass]">
		<!-- 展开/收起 按钮 -->
		<a href="javascript:;" :title="toggleTitle" class="toggle-btn" 
			@click="toggle">
			<i class="fa" :class="[toggleIconClass]"></i>
		</a>
		<!-- 返回按钮 -->
		<a href="javascript:;" class="back-btn" title="返回上一级" 
			v-if="isBackVisible" @click="$emit('back')">
			<span>返回</span>
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
computed.footerBarClass = function () {
	if (!this.tableVisible) {
		return 'x-hidden';
	}
};
computed.toggleIconClass = function () {
	if (this.tableVisible) {
		return 'fa-angle-double-up';
	} else {
		return 'fa-angle-double-down';
	}
};
computed.isBackVisible = function () {
	return false;
};

computed.toggleTitle = function () {
	return this.tableVisible ? '收起' : '展开';
};
var mounted = function () {};
const beforeDestroy = function () {};
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
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
.table-layer {
	position: fixed;
	top: @layerTop2;
	bottom: 0;
	overflow: hidden;
	left: @layerLeft;
	width: @layerWidth-1;

	.table-wrapper {
		
	}
}
.toggle-btn {
	.fa {
		font-size: 28px;
	}
}
@bar-height: 38px;
.footer-bar {
	height: @bar-height;
	background-color: #fff;
	padding: 4px 0 0 0;
	position: relative;
	left: 0;
	width: 100%;
	text-align: center;

	&.x-hidden {
		background-color: @section-head-bg;
	}
	&.x-hidden a {
		color: #fff;
	}
	a {
		display: inline-block;
		color: @section-head-bg;
		font-size: 16px;
	}
	a span {
		font-size: 14px;
		vertical-align: 1px;
	}
	.toggle-btn {
		padding: 2px 80px 2px 80px;
	}
	.back-btn {
		padding: 4px 14px;
		position: absolute;
		right: 0px;
		top: 8px;
		color: #777;
	}
}
</style>
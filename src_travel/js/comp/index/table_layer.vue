<template>
<div class="table-layer">
	<div class="table-wrapper" ref="tableWrapper" >
		<slot></slot>
	</div>

	<!-- footer-bar -->
	<div class="footer-bar" :class="[footerBarClass]">
		<!-- 展开/收起 按钮 -->
		<a href="javascript:;" :title="toggleTitle" class="toggle-btn" @click="toggle">
			<i class="fa" :class="[toggleIconClass]"></i>
		</a>
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
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
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
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";

</style>
<template>
<div class="close-btn-box">
	<a href="javascript:;" class="x-max layer-icon-btn mr5" @click="$emit('max')" v-if="maxVisible">
		<i class="fa fa-window-maximize"></i>
	</a>
	<a href="javascript:;" class="x-restore layer-icon-btn mr5" @click="$emit('restore')" v-if="restoreVisible">
		<i class="fa fa-window-restore"></i>
	</a>
	<a href="javascript:;" class="x-close layer-icon-btn" @click="$emit('close')">
	    <i class="fa fa-times"></i>
	</a>
</div>
</template>

<script>
var methods = {};
var computed = {};
computed.maxVisible = function () {
	if (this.full === false) {
		return true;
	}
	return false;
};
computed.restoreVisible = function () {
	if (this.full === true) {
		return true;
	}
	return false;
};
var watch = {};
var mounted = function () {};
const beforeDestroy = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: ['full'],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.close-btn-box {
	position: absolute;
	top: 6px;
	right: 12px;
	z-index: 1111;
	& > a {
		vertical-align: middle;
		font-size: 22px;
	}
	& > a.x-close {
		font-size: 27px;
	}
}
</style>
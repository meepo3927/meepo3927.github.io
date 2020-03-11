<template>
<center-layer v-if="visible" :anim="myAnim" :width="w" :height="h">
	<div class="full-layer" :class="[className]">
		<close-btn @click="onClose" />
		<slot></slot>
	</div>
</center-layer>
</template>

<script>
//import Cover from 'util/cover.js';
let methods = {};
methods.show = function () {
	this.visible = true;

};
methods.onClose = function () {
	if (this.defineClose === '1') {
		// 定义关闭动作，目前没有
	} else {
		this.close();
	}
	
	this.$emit('close');
};
methods.close = function () {
	this.visible = false;
};
let computed = {};
computed.w = function () {
	return this.width || '96%';
};
computed.h = function () {
	return this.height || '94%';
};
computed.myAnim = function () {
	let a = this.anim;
	let defaultAnim = true;
	if (a === undefined) {
		return defaultAnim;
	}
	if (a === false || a === 'false') {
		return false;
	}
	if (a === true || a === 'true') {
		return true;
	}
	return defaultAnim;
};
let watch = {};
const mounted = function () {};
const destroyed = function () {};
const dataFunc = function () {
	let o = {
		visible: false
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	watch,
	props: ['width', 'height', 'anim', 'className', 'defineClose'],
	mounted,
	destroyed,
	components: {
		'close-btn': require('comp/common/layer-close-btn.vue')
	}
};
</script>

<style scoped lang="less">
.full-layer {
	background-color: #fff;
	padding: 8px 12px;
}
</style>

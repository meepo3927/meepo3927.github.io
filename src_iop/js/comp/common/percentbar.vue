<template>
<div class="percent-bar">
	<span :style="{left: percent}" v-text="percent"></span>
	<em :style="{width: percent}"></em>
</div>
</template>

<script>
var methods = {};
var computed = {};
computed.percent = function () {
	return (this.value || 0) + '%';
};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	computed,
	props: ['value'],
	mounted
};
</script>

<style scoped lang="less">
.percent-bar {
	border-radius: 1px;
	width: 100%;
	height: 10px;
	background-color: #DDE8ED;
	position: relative;
	overflow: visible;
	span {
		transform: translateX(-45%);
		position: absolute;
		top: -24px;
		font-size: 16px;
	}
	em {
		height: 100%;
		display: block;
		background-color: blue;
	}
}
</style>
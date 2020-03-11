<template>
<div class="c">
	<input type="text" class="form-control" 
		:value="v0"
		@input="onInput($event)" />
</div>
</template>

<script>
var methods = {};
methods.onInput = function (e) {
	this.v = e.target.value;
};
var computed = {};
let watch = {};
var mounted = function () {
};
export default {
	data: function () {
		return {
			v: ''
		};
	},
	watch,
	methods,
	computed,
	props: [],
	mounted,
	mixins: [require('./mix.js')]
};
</script>

<style scoped lang="less">
.c {
	
}
input[type=text] {
	width: 160px;
}
</style>
<template>
<center-layer ref="clayer" :width="width" :height="height" anim="true">
	<div class="test-layer" >
		<p>test-123</p>
		<button @click="f1">Button-1</button>
		<button @click="f2">Button-2</button>
		<button @click="f3">Button-3</button>
		<button @click="f4">Button-4</button>
		<ul>
			<li v-for="item in list"><span v-text="item"></span></li>
		</ul>
	</div>
</center-layer>
</template>

<script>
var methods = {};
methods.f1 = function () {
	this.width = '90%';
	this.height = '80%';
};
methods.f2 = function () {
	this.width = '400px';
	this.height = '280px';
};
methods.f3 = function () {
	this.width = '';
	this.height = '';
};
methods.f4 = function () {
	this.list.push('str-' + Math.random());
};
var computed = {};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		width: '90%',
		height: '90%',
		list: []
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.test-layer {
	font-size: 20px;
	background-color: #fff;
	height: 100%;
}
</style>
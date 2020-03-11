<template>
<div class="c">
	<vue-date class="form-control" v-model="val_1" placeholder="日期" />
	<span> - </span>
	<vue-date class="form-control" v-model="val_2" placeholder="日期" />
</div>
</template>

<script>
import tool from 'util/tool';
var methods = {};
methods.setValue = function (v) {
	if (v && v[0]) {
		this.val_1 = v[0];
	}
	if (v && v[1]) {
		this.val_2 = v[1];
	}
};
let watch = {};
watch.value = function (v, old) {
	if (tool.deepEqual(v, old)) {
		return;
	}
	this.setValue(v);
};
var computed = {};
computed.v = function () {
	return [this.val_1, this.val_2];
};
const created = function () {
	this.setValue(this.value);
};
var mounted = function () {};
export default {
	data: function () {
		return {
			val_1: '',
			val_2: ''
		};
	},
	created,
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
	input[type=text] {
		width: 115px;
		display: inline-block;
	}
}
</style>
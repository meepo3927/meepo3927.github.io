<template>
	<vue-chosen class="attraction-select" :options="options" @change="change"
		ref="chosen" />
</template>

<script>
import request from 'util/request';
var methods = {};
methods.change = function (e, val, node) {
	this.$emit('change', val, node.innerHTML);
};
methods.fetch = function (id, callback) {
	id = id || this.id;
	if (!id) {
		return;
	}
	request.getAttractionsOfCity(id).then((result) => {
		this.options = result.map((v) => {
			return {
				text: v.placeName,
				value: v.placeID
			};
		});
		callback && callback(this.options);
	});
};
var computed = {};
var watch = {};
watch.id = function (v) {
	this.fetch(v);
};
var mounted = function () {
	this.fetch(this.id, (options) => {
		var first = options[0] || {};
		this.$emit('change', first.value, first.text);
	});
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		options: []
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	methods,
	computed,
	props: ['id'],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.attraction-select {
	width: 180px;
}
</style>
<template>
	<select @change="onChange" class="select-big">
		<option v-for="o in options" v-text="o.placeName"
			:value="o.placeID"></option>
	</select>

</template>

<script>
import request from 'util/request';
var methods = {};
methods.onChange = function () {
	let val = $(this.$el).val();
	this.$emit('change', val);
};
methods.fetch = function (id, callback) {
	id = id || this.id;
	if (!id) {
		return;
	}
	if (id.length >= 4) {
		request.getAttractionById(id).then((result) => {
			this.options = [result];
			callback && callback(this.options);
		});
	} else {
		request.getAttractionsOfCity(id).then((result) => {
			this.options = result;
			callback && callback(this.options);
		});
	}
};
var computed = {};
var watch = {};
watch.id = function (v) {
	this.fetch(v);
};
var mounted = function () {
	this.fetch(this.id, (options) => {
		var first = options[0] || {};
		this.$emit('change', first.placeID, first.placeName);
	});
};
const beforeDestroy = function () {};
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
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
select {
	width: 180px;
}
</style>
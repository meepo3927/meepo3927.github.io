<template>
<v-chosen class="c-video-chosen" :options="options"
	v-model="val1" />
</template>

<script>
var methods = {};
methods.fetchOptions = function () {
	this.options = [];
	this.val1 = undefined;
	let p = {
		atomId: this.atomId
	};
	this.vRequest.fetch2('/videoPreference/queryAll', p).then((data) => {
		this.options = data.map(v => {
			return {
				text: v.sub_name,
				value: v.sub_id
			}
		});

	});
};
var computed = {};
computed.v = function () {
	if (!this.val1) {
		return [];
	}
	return [this.val1];
};
var mounted = function () {
	this.fetchOptions();
};
let watch = {};
watch.atomId = function () {
	this.fetchOptions();
};
export default {
	data: function () {
		return {
			options: [],
			val1: undefined
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
.c-video-chosen {
}
</style>
<template>
	<input type="text" readonly="readonly"
		:value="value" />
</template>

<script>
import 'jeDate';

let methods = {};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
	$(this.$el).jeDate({
		isinitVal: false,
		zIndex: 19900420 + 3333,
		format: this.format || 'YYYY-MM-DD',
		hmsSetVal: {
			hh: this.hh || 0,
			mm: this.mm || 0,
			ss: 0
		},
		choosefun: (elem, val, date) => {
			this.$emit('input', val);
		},
		okfun: (elem, val, date) => {
			this.$emit('input', val);
		}
	});
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {};
	return o;
};
export default {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: ['value', 'format', 'hh', 'mm'],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.vue-comp {
	
}
</style>

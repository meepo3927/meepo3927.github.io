<template>
	<input type="text" :value="value" readonly />
</template>

<script>
import 'lib/bootstrap-datetimepicker.min.js';
import 'lib/locales/bootstrap-datetimepicker.zh-CN.js';
let methods = {};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
	$(this.$el).datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd hh:ii:00'
	}).on('changeDate', (ev) => {
		let val = (ev.target.value);
		this.$emit('input', val);
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
	props: ['value'],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">

</style>

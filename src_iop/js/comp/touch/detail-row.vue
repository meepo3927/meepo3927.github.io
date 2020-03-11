<template>
<div class="m-row-auto">
	<div class="col-1">
		<label for="" v-html="label"></label>
	</div>
	<div class="col-2" v-html="content">
	</div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myData = function () {
	return this.data || {};
};
computed.label = function () {
	if (!this.myData.label) {
		return '';
	}
	return this.myData.label + '：';
};
computed.content = function () {
	return this.myData.html;
};
let watch = {};
const created = function () {};
const mounted = function () {};
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
	props: ['data'],
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

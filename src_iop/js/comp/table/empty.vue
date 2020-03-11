<template>
<tbody>
	<tr>
		<td :colspan="columnCount" class="text-muted text-center"
			v-text="myMsg"></td>
	</tr>
</tbody>
</template>

<script>
var methods = {};
var computed = {};
computed.columnCount = function () {
	return this.colspan || 10;
};
computed.myMsg = function () {
	return this.msg || '没有内容';
};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	computed,
	props: ['colspan', 'msg'],
	mounted
};
</script>

<style scoped lang="less">
</style>
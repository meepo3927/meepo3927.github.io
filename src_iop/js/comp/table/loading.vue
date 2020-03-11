<template>
<tfoot>
	<tr>
		<td :colspan="columnCount" class="pt10 pb10">
			<vue-loading class="center-block"></vue-loading>
		</td>
	</tr>
</tfoot>
</template>

<script>
var methods = {};
var computed = {};
computed.columnCount = function () {
	return this.colspan || 10;
};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	computed,
	props: ['colspan'],
	mounted
};
</script>

<style scoped lang="less">
</style>
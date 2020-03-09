<template>
<table class="table-2 travel-table" >
	<thead >
		<tr v-if="heads">
			<th v-for="(v, i) in heads" v-text="v" :class="['col-' + i]"></th>
		</tr>
	</thead>
	<slot></slot>
	<tfoot v-if="data === null">
		<tr>
			<td :colspan="colspan">暂无数据</td>
		</tr>
	</tfoot>
	<tfoot v-if="data === undefined && !loading">
		<tr>
			<td :colspan="colspan">请点击[开始计算]获取实时数据</td>
		</tr>
	</tfoot>
	<tfoot v-if="loading">
		<tr>
			<td :colspan="colspan">
				<p v-if="loadingTip" v-text="loadingTip"></p>
				<!--<div class="loading-1" :class="{mt10: !!loadingTip}"></div> -->
				<div class="loading-bar" :class="{mt10: !!loadingTip}"></div>
			</td>
		</tr>
	</tfoot>
</table>
</template>

<script>
let methods = {};
let computed = {};
computed.colspan = function () {
	if (this.heads) {
		return this.heads.length;
	}
	return 1;
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
	props: ['heads', 'data', 'loading', 'loadingTip'],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">

</style>

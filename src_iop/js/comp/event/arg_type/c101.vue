<template>
<div class="c">
	<v-chosen v-model="areaName" :options="options" 
		class="my-chosen" />
</div>
</template>

<script>
var methods = {};
var computed = {};

let watch = {};
watch.areaName = function (name) {
	if (!this.cellMap) {
		return;
	}
	let lacCell = this.cellMap[name];
	if (name && lacCell) {
		this.v = [name, lacCell];
	}
};
var mounted = function () {
	if (this.value && this.value[0]) {
		this.areaName = this.value[0];
		this.v = this.value;
	}
	this.vRequest.fetch2('/heatArea/queryCells').then((data) => {
		let cellMap = {};
		this.options = data.map(v => {
			cellMap[v.name] = v.laccell;
			return {
				text: v.name,
				value: v.name
			}
		});
		this.cellMap = cellMap;
		if (!this.areaName && data[0]) { // 默认选中第一个
			this.areaName = data[0].name;
		}
	});
};
export default {
	data: function () {
		return {
			options: [],
			areaName: '',
			v: []
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
.my-chosen {
	width: 160px;
}
</style>
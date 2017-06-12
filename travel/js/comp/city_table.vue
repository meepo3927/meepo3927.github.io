<template>
<table class="table">
	<thead>
		<tr>
			<th class="col-1">排名</th>
			<th class="col-2 tal">城市</th>
			<th class="col-3 tar">实时客流量</th>
			<th class="col-4 tar" >告警区域</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item, index) in mlist" title="点击查看详情" @click="rowClick(item)">
			<td v-text="item.city_title === '合计' ? '' : (index + 1)" class="tac"></td>
			<td v-text="item.city_title"></td>
			<td v-text="item.user_num" class="tar col-3" ></td>
			<td v-text="item.alarm_num" class="tar col-4" :class="getWarnClassName(item.alarm_num)"></td>
		</tr>
	</tbody>
</table>
</template>

<script>
var methods = {};
methods.getWarnClassName = function (count) {
	if (count >= 2) {
		return 'warn-2';
	} else if (count === 1) {
		return 'warn-1';
	}
	return '';
};
var computed = {};
computed.mlist = function () {
	return this.list || [];
};
var mounted = function () {};
let destroyed = function () {
};
let mix = require('comp/table_mix.js');
export default {
	data: function () {
		return {};
	},
	methods,
	mixins: [mix],
	computed,
	props: [],
	mounted,
	destroyed
};
</script>

<style scoped lang="less">
.table {
	.col-1 {
		width: 55px;
	}
	.col-2 {
		width: 120px;
	}
	.col-3 {
		width: 150px;
	}
	.col-4 {
		width: 110px;
	}
	td {
		cursor: pointer;
	}
	td.col-3 {
		font-weight: bold;
	}
	td.col-4 {
		font-weight: bold;
	}
}
</style>
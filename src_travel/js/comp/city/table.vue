<template>
<table class="table">
	<thead>
		<tr>
			<th class="col-ranking">排名</th>
			<th class="col-2 tal">城市</th>
			<th class="col-3 tar">实时客流量</th>
			<th class="col-4 tar" >告警区域</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item, index) in mlist" title="点击查看详情" 
			@click="rowClick(item)">
			<td v-text="getIndex(item, index)" class="col-ranking"></td>
			<td v-text="item.placeName"></td>
			<td v-text="item.peopleNum" class="tar col-3" ></td>
			<td v-text="geteAlarm(item)" class="tar col-4" :class="getWarnClassName(item.alarmPlaceNum)"></td>
		</tr>
	</tbody>
</table>
</template>

<script>

const TOTAL_TEXT = '合计';
var methods = {};
methods.getIndex = function (item, index) {
	if (item.placeName === TOTAL_TEXT) {
		return '';
	}
	return (index + 1);
};
methods.geteAlarm = function (item) {
	if (item.placeName === TOTAL_TEXT) {
		return '';
	}
	return item.alarmPlaceNum;
};
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
const beforeDestroy = function () {};


export default {
	data: function () {
		return {};
	},
	methods,
	mixins: [
		require('mixins/index_table.js')
	],
	computed,
	props: [],
	mounted,
	beforeDestroy
};
</script>

<style scoped lang="less">
.table {
	
	.col-2 {
		width: 90px;
	}
	.col-3 {
		width: 115px;
	}
	.col-4 {
		width: 110px;
	}
	td {
		cursor: pointer;
	}
	td.col-3,
	td.col-4 {
		// font-weight: bold;
	}

}
</style>
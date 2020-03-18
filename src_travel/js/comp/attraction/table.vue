<template>
<div>
	<table class="table">
		<thead>
			<tr>
				<th class="col-ranking ">排名</th>
				<th class="col-2 tal">景区名称</th>
				<th class="col-num-state pr30">实时客流量</th>
			</tr>
		</thead>
	</table>
	<div class="table-box-2">
		<table class="table">
			<tbody>
				<tr v-for="(item, index) in mlist" title="点击查看详情" 
					@click="rowClick(item)">
					<td v-text="item.id || (index + 1)" class="col-ranking"></td>
					<td class="col-2">
						<div class="item-name">
							<span v-text="item.placeName" v-marquee></span>
						</div>
					</td>
					<td class="col-num-state">
						{{item.peopleNum}}
						<span v-text="(item.status)" class="state-span "
							:class="[getStateClassName(item.status)]"></span>
					</td>

				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>

<script>
var methods = {};
methods.getStateText = function (state) {
	var map = {
		3: '告警',
		2: '拥挤',
		1: '正常'
	};
	return map[state] || '正常';
};
methods.getStateClassName = function (state) {
	var map = {
		'告警': 3,
		'拥挤': 2,
		'正常': 1
	};
	return 'state-' + (map[state] || '1');
};
var computed = {};
computed.mlist = function () {
	let alarmArr = [];
	let normalArr = [];
	(this.list || []).forEach((item) => {
		if (item.status === '告警') {
			alarmArr.push(item);
		} else {
			normalArr.push(item);
		}
	});
	const sortFunc = (a, b) => {
		return (b.peopleNum - a.peopleNum);
	};
	alarmArr = alarmArr.sort(sortFunc);
	normalArr = normalArr.sort(sortFunc);
	return alarmArr.concat(normalArr);
};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	computed,
	mixins: [
		require('mixins/index_table.js')
	],
	props: [],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
.table {
	.col-2 {
		width: 150px;
	}
	td {
		cursor: pointer;
	}
	td.col-4 {
		text-align: center;
	}
}
.item-name {
	overflow: hidden;
	max-width: 146px;
	white-space: nowrap;
}
.item-name > span {
	display: inline-block;
}
.table-box-2 {
	max-height: 500px;
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
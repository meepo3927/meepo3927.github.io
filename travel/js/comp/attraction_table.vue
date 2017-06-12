<template>
<table class="table">
	<thead>
		<tr>
			<th class="col-1">排名</th>
			<th class="col-2 tal">景区名称</th>
			<th class="col-3 tar">实时客流量</th>
			<!-- <th class="col-4">状态</th> -->
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item, index) in mlist" title="点击查看详情" @click="rowClick(item)">
			<td v-text="item.id || (index + 1)" class="tac"></td>
			<td>
				<div class="item-name">
					<span v-text="item.city_title" v-marquee></span>
				</div>
			</td>
			<td class="col-3 tar">
				{{item.user_num}}
				<span v-text="(item.state)" class="state-span ml10"
					:class="[getStateClassName(item.state)]"></span>
			</td>

		</tr>
	</tbody>
</table>
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
		if (item.state === '告警') {
			alarmArr.push(item);
		} else {
			normalArr.push(item);
		}
	});
	const sortFunc = (a, b) => {
		return (b.user_num - a.user_num);
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
	mixins: [require('comp/table_mix.js')],
	props: [],
	mounted
};
</script>

<style scoped lang="less">
.table {
	.col-1 {
		width: 55px;
		white-space: nowrap;
	}
	.col-2 {}
	.col-3 {
		width: 100px;
		white-space: nowrap;
	}
	.col-4 {
		width: 90px;
	}
	td {
		cursor: pointer;
	}
	td.col-3 {
		font-weight: bold;
	}
	td.col-4 {
		text-align: center;
	}
	td .state-span {
		display: inline-block;
		color: #fff;
		padding: 6px 12px;
	}
	@color-3: #FF0000;
	@color-2: #FFC000;
	@color-1: #70AD47;
	.state-3 {

		@my-border-color: darken(@color-3, 10%);
		background-color: @color-3;
		border: 1px solid @my-border-color;

		box-shadow: 0 0 5px @my-border-color;
	}
	.state-2 {
		background-color: @color-2;
		border: 1px solid darken(@color-2, 10%);

	}
	.state-1 {
		background-color: @color-1;
		border: 1px solid darken(@color-1, 10%);
	}
}
.item-name {
	overflow: hidden;
	max-width: 160px;
	white-space: nowrap;
}
.item-name > span {
	display: inline-block;
}
</style>
<template>
<table class="table" v-show="!loading" :key="data.id">
	<thead>
		<tr>
			<th class="tal " colspan="2">
				<span>{{name}} - 实时概况</span>
				<span class="head-tip">
					较5分钟前 <i class="fa fa-long-arrow-up"></i>
				</span>
			</th>

		</tr>
	</thead>
	<tbody>
		<tr class="row-1">
			<td class="col-1">
				实时人数
				<!-- <p class="x-count">({{userNum}}人)</p> -->
			</td>
			<td class="state-1">

				<div is="num-bar" :percent="userNumPercent" 
					:num="userNum + '人'"
					:key="data.id"></div>
			</td>
		</tr>
		<tr class="row-2">
			<td class="col-1">
				迁入人数

			</td>
			<td class="state-1">
				<div is="num-bar":percent="inNumPercent"
					:num="inNum + '人'"></div>
			</td>
		</tr>
		<tr>
			<td class="col-1">
				迁出人数

			</td>
			<td class="state-1">

				<div is="num-bar":percent="outNumPercent"
					:num="outNum + '人'"></div>
			</td>
		</tr>
	</tbody>
</table>
</template>

<script>
const NUM_MAX = 1000;
var methods = {};
var computed = {};
computed.name = function () {
	return this.data ? this.data.placeName : '';
};
computed.userNum = function () {
	return this.data ? (this.data.peopleNum || 0) : 0;
};
computed.userNumPercent = function () {
	return this.userNum / NUM_MAX;
};
computed.inNum = function () {
	return this.data ? (this.data.moveInNum || 0) : 0;
};
computed.inNumPercent = function () {
	return this.inNum / NUM_MAX;
};
computed.outNum = function () {
	return this.data ? (this.data.moveOutNum || 0) : 0;
};
computed.outNumPercent = function () {
	return this.outNum / NUM_MAX;
};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	computed,
	props: ['data', 'loading'],
	mounted,
	mixins: [],
	components: {
		'num-bar-1': require('comp/common/num_bar.vue'),
		'num-bar': require('comp/common/num-bar.vue')
	}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
.table {
	tbody > tr > td {
		background-color: #fff;
		font-size: @title-font-size;
	}
	tbody > tr.row-1,
	tbody > tr.row-2 {
		border-bottom: 1px solid #fff;
	}
	.head-tip {
		float: right;
		font-weight: normal;
	}
	
	td.col-1 {
		width: 96px;
		text-align: center;
		color: #333;
	}
	td.state-1 {
		padding-left: 0;
		padding-right: 0;
	}
	td.state-1 .num-box {
		color: #00ee00;
	}
	td .num-box {
		font-weight: bold;
		margin-bottom: 7px;
	}
	p.x-count {
		margin-top: 5px;
	}
	td .x-state {
		float: right;
		margin-top: -5px;
	}
	td .x-state i {
		font-size: 22px;
		vertical-align: text-top;
		margin-left: 8px;
	}
	td .x-state .fa-angle-double-up {
		color: #ff0000;
	}
	td .x-state .fa-angle-double-down {
		color: #00ff00;
	}
}
</style>
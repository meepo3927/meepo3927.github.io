<template>
<table class="table" v-show="!loading" :key="data.id">
	<thead>
		<tr>
			<th class="tal" colspan="2">{{name}}景区实时概况</th>
		</tr>
	</thead>
	<tbody>
		<tr class="row-1">
			<td class="col-1">实时人数</td>
			<td class="state-1">
				<div class="num-box clearfix">
					<span class="x-count" v-text="userNum"></span>
					<span class="x-state">较5分钟前<i class="fa fa-angle-double-up"></i></span>
				</div>
				<div is="num-bar" :percent="userNumPercent" :key="data.id"></div>
			</td>
		</tr>
		<tr class="row-2">
			<td class="col-1">迁入人数</td>
			<td class="state-1">
				<div class="num-box">
					<span class="x-count" v-text="inNum"></span>
				</div>
				<div is="num-bar":percent="inNumPercent"></div>
			</td>
		</tr>
		<tr>
			<td class="col-1">迁出人数</td>
			<td class="state-1">
				<div class="num-box">
					<span class="x-count" v-text="outNum"></span>
				</div>
				<div is="num-bar":percent="outNumPercent"></div>
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
	return this.data ? this.data.city_title : '';
};
computed.userNum = function () {
	return this.data ? this.data.user_num : 0;
};
computed.userNumPercent = function () {
	return this.userNum / NUM_MAX;
};
computed.inNum = function () {
	return this.data ? this.data.check_in_num : 0;
};
computed.inNumPercent = function () {
	return this.inNum / NUM_MAX;
};
computed.outNum = function () {
	return this.data ? this.data.check_out_num : 0;
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
		'num-bar': require('comp/num_bar.vue')
	}
};
</script>

<style scoped lang="less">
@import (reference) "../../less/global/config";
.table {
	tbody > tr > td {
		background-color: @themeColor;
		font-size: @title-font-size;
	}
	tbody > tr.row-1,
	tbody > tr.row-2 {
		border-bottom: 1px solid #fff;
	}
	td.col-1 {
		width: 96px;
		text-align: right;
	}
	td.state-1 .num-box {
		color: #00FF00;
	}
	td .num-box {
		font-weight: bold;
		margin-bottom: 7px;
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
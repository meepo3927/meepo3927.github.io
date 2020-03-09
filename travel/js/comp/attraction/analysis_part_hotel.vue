<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box fl x-head">
		<label>选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />

		<div class="btn-group ml30">
			<button class="btn-big" v-for="(v, key) in vConfig.homeMap"
				:class="{active: userType === key}"
				@click="switchUserType(key)"
				v-text="v"></button>
		</div>
	</div>
	<!-- chart -->
	<div class="x-body" >
		<div class="travel-panel-layout">
			<div class="x-left">
				<h3 v-text="tableTitle"></h3>
				<div class="table-box" >
					<travel-table class="clickable" :heads="heads" 
						:data="listdata"
						:loading="loadingTable">
						<tbody v-if="listdata">
							<tr v-for="(v, i) in listdata" title="查看酒店位置和人数"
								@click="" :class="{}">
								<td v-text="i + 1"></td>
								<td v-text="v.name"></td>
								<td v-text="v.num"></td>
							</tr>
						</tbody>
					</travel-table>
				</div>

			</div><!-- x-left -->
			<div class="x-right">
				<!-- iframe -->
				<iframe frameborder="0" ref="gisFrame" class="type-1"
					:src="gisUrl"></iframe>
			</div><!-- x-right -->
		</div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import MDate from 'lib/mdate.js';
import Promise from 'lib/promise.js';
import EchartUtil from 'util/echart.js';

var DateUtil = MDate.Util;
var methods = {};

methods.fetchRender = function () {
	var m = 'render' + this.type;
	this.disposeCharts();
	this[m] && this[m]();
};
var computed = {};
computed.tableTitle = function () {
	return '热门酒店TOP10';
};
computed.heads = function () {
	return ['TOP', '酒店名称', '人数'];
};
var mounted = function () {
	this.gisUrl = this.getGisTravelUrl();
};
const beforeDestroy = function () {};
let dataFunc = function () {
	var date = new Date();
	var startDate = DateUtil.getDateOffset(date, -1);
	var o = {
		type: 1,
		startDatetime:  DateUtil.getYMD(startDate),
		loadingTable: false,
		listdata: [
			{name: '汉庭', num: 3998},
			{name: '如家', num: 2998},
			{name: '七天快捷', num: 1998}
		]
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	mixins: [
		require('mixins/analysis_part.js'),
		require('mixins/travel.js'),
		require('comp/chart_layer/the_common_mix.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.analysis-part {
}

</style>
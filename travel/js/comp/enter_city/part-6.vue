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
								<td v-text="v.hotelName"></td>
								<td v-text="v.userNumber"></td>
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
import IframeUtil from 'util/iframe.js';

var DateUtil = MDate.Util;
var methods = {};

methods.fetchRender = function () {
	let p = {
		start_date: this.startDatetime,
		end_date: this.endDatetime,
		userType: this.getUserTypeParam(),
		scenery_city: this.id
	};
	this.listdata = undefined;
	this.loadingTable = true;
	request.r1('/v2/sceneryHotelAnalyze', p).then((r) => {
		this.loadingTable = false;
		this.listdata = r;
		this.sendGis();

	}).catch(() => {
		this.loadingTable = false;
		this.listdata = null;
	});
};
methods.sendGis = function () {
	IframeUtil.send('render_hotel', this.listdata, this.$refs.gisFrame);
};
methods.onGisReady = function () {
	this.gisReady = true;
	if (this.listdata) {
		this.sendGis();
	}
};
var computed = {};
computed.tableTitle = function () {
	return '热门酒店TOP10';
};
computed.heads = function () {
	return ['TOP', '酒店名称', '人数'];
};
var mounted = function () {
	this.gisUrl = this.getGisHotelUrl();
	this.$on('onDateChange', this.fetchRender);
	this.fetchRender();
	IframeUtil.on('gis_hotel_ready', this.onGisReady);
};
const beforeDestroy = function () {};
let dataFunc = function () {
	var date = new Date();
	var startDate = DateUtil.getDateOffset(date, -8);
	var o = {
		type: 1,
		startDatetime:  DateUtil.getYMD(startDate),
		loadingTable: false,
		listdata: null
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
		require('./part-mix.js'),
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
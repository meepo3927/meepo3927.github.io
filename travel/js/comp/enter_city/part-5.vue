<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box fl x-head">
		<label>选择日期：</label>
		<!-- type1 -->
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" 
			v-show="type === 1"/>
		<span class="d-span" v-show="type === 1">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" 
			v-show="type === 1" />
		<!-- type2 -->
		<datepicker v-model="startDatetime2" v-show="type === 2"/>
		<span class="d-span" v-show="type === 2">至十天后</span>

		<div class="btn-group ml30" style="">
			<button class="btn-big" :class="{active: type === 1}"
				@click="switchType(1)">热门出行线路</button>
			<button class="btn-big" :class="{active: type === 2}"
				@click="switchType(2)">热门旅游线路</button>
		</div>

		<div class="btn-group ml30">
			<button class="btn-big" v-for="(v, key) in vConfig.homeMap"
				:class="{active: userType === key}"
				@click="switchUserType(key)"
				v-text="v"></button>
		</div>

		<button class="btn-big ml20 start-btn" v-show="type === 2"
			@click="render2">开始计算</button>
	</div>
	<!-- chart -->
	<div class="x-body" >
		<div class="travel-panel-layout">
			<div class="x-left">
				<h3 v-text="tableTitle"></h3>
				<div class="table-box" >
					<travel-table class="clickable" :heads="heads" 
						:data="rankData"
						:loading="loadingTable"
						:loading-tip="loadingTip">
						<tbody v-if="rankData && type === 1">
							<tr v-for="v in rankData" @click="onTableClick(v)"
								title="查看线路"
								:class="{active: v.rankNum === rankActive}">
								<td v-text="v.rankNum"></td>
								<td v-text="v.odDesc"></td>
								<td v-text="v.userNum"></td>
							</tr>
						</tbody>
						<tbody v-if="rankData && type === 2">
							<tr v-for="(v, i) in rankData" @click="onRouteClick(v, i)"
								title="查看线路"
								:class="{active: i === rankActive}">
								<td v-text="i + 1"></td>
								<td v-text="v.routeDESC"></td>
								<td v-text="v.number"></td>
							</tr>
						</tbody>
					</travel-table>
				</div>

			</div><!-- x-left -->
			<div class="x-right">
				<!-- 选择时段 -->
				<div class="period-select-box m-row col-mid" v-if="type === 2">
					
					<label for="" class="m-col">选择时段：</label>
					
					<div class=" m-col">
						<button class="btn mr10" v-for="v in travelPeriodOptions"
							:class="{active: days === v.value}"
							@click="switchDay(v)"
							v-text="v.name"></button>
					</div>
				</div>

				<!-- iframe -->
				<iframe frameborder="0" ref="gisFrame"
					:src="gisUrl" 
					:class="['type-' + this.type]"></iframe>
			</div><!-- x-right -->
		</div>
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';
import MDate from 'lib/mdate.js';
import config from 'global/config';
import IframeUtil from 'util/iframe.js';

var methods = {};
methods.onTableClick = function (v) {
	// this.sendSingle(v);
	let relatedItems = [v];
	let from = v.beginPiecedName || '_NULL';
	let to = v.afterPiecedName || '_NULL';
	const isRelated = (item) => {
		let iFrom = item.beginPiecedName;
		let iTo = item.afterPiecedName;
		if (iFrom === from || iFrom === to) {
			return true;
		}
		if (iTo === from || iTo === to) {
			return true;
		}
		return false;
	};
	this.rankData.forEach((item) => {
		// self
		if (item.rankNum === v.rankNum) {
			return;
		}
		if (isRelated(item)) {
			relatedItems.push(item);
		}
	});
	// LOG(relatedItems);
	this.sendMulti(relatedItems);

	this.rankActive = v.rankNum;
};
methods.onRouteClick = function (v, i) {
	this.rankActive = i;
	this.sendRoute(v);
};
methods.fetchRender = function () {
	let m = 'render' + this.type;
	if (this.type !== 2) {
		this.$nextTick(this[m]);
	}
};
methods.getParam = function () {
	return {
		scenery_city: this.id,
		start_date: this.startDatetime,
		end_date: this.endDatetime,
		userType: this.getUserTypeParam()
	};
};
methods.getParam2 = function () {
	let startDate = MDate.Util.parseDate(this.startDatetime2);
	let endDate = MDate.Util.getDateOffset(startDate, 10);
	let endDatetime = MDate.Util.getYMDStr(endDate);
	let p = {
		scenery_city: this.id,
		start_date: this.startDatetime2,
		end_date: endDatetime,
		userType: this.getUserTypeParam()
	};
	if (this.days) {
		p.days = this.days;
	}

	return p;
};
methods.render1 = function () {
	this.rankActive = -1;
	this.gisUrl = config.gisUrlBase + '/travel/visitorAnalyse.jsp?cityId=' + this.id;
	let p = this.getParam();
	this.rankData = undefined;
	this.loadingTable = true;
	let pm = request.r1('/travelV2/getTravelerOD', p, p.userType);
	request.U(pm).then((r) => {
		// 已经切换
		if (this.type !== 1) {
			return;
		}
		if (!r || !r.length) {
			this.rankData = null;
		} else {
			this.rankData = r;
			this.sendMulti(r);
		}

		this.loadingTable = false;
	}).catch((e) => {
		this.rankData = null;
		this.loadingTable = false;
		LOG(e);
	});
};

methods.render2 = function (options = {}) {
	this.rankActive = -1;
	// 检查
	let r = this.checkDatetimeLength(this.startDatetime, this.endDatetime, this.days);
	if (r !== true) {
		return mlayer.msg(r, {time: 6000});
	}

	let p = this.getParam2();
	this.rankData = undefined;
	this.loadingTable = true;
	let pm = request.getActionJSON('/v2/touristRoutesAnalyze', p);
	request.U(pm).then((r) => {
		// 已经切换
		if (this.type !== 2) {
			return;
		}
		if (r && r.length) {
			this.rankData = r;
			this.rankActive = 0;
			this.sendRoute(r[0]);
		} else {
			this.rankData = null;
		}
		
		this.loadingTable = false;
	}).catch((e) => {
		// 已经切换
		if (this.type !== 2) {
			return;
		}
		LOG('error:', e);
		if (options.autoTry === false) {
			this.rankData = null;
			this.loadingTable = false;
		} else {
			this.startDatetime2 = MDate.Util.getDateOffsetStr(this.startDatetime2, -1);
			this.$nextTick(() => {
				this.render2({autoTry: false});
			});
		}
	});
};
methods.switchType = function (type) {
	if (this.type === type) {
		return;
	}
	this.type = type;
	this.userType = '0';
	if (type === 1) {
		this.fetchRender();
	} else {
		this.rankData = undefined;
		this.gisUrl = this.getGisTravelUrl();
	}
};
methods.switchDay = function (v) {
	if (this.days === v.value) {
		return;
	}
	this.days = v.value;
	// this.render2();
};
methods.sendSingle = function (item) {
	IframeUtil.send('render_oneiterm', item, this.$refs.gisFrame);
};
methods.sendMulti = function (data) {
	let p = {
		cityId: this.id,
		data
	};
	IframeUtil.send('render_multiterm', p, this.$refs.gisFrame);
};
methods.sendRoute = function (data) {
	IframeUtil.send('render_onetravelline', data, this.$refs.gisFrame);
};
methods.onODReady = function () {
	if (this.type === 1 && this.rankData) {
		this.sendMulti(this.rankData);
	}
};
methods.onTravelReady = function () {
	if (this.type === 2 && this.rankData) {
		this.sendRoute(this.rankData[0]);
	}
};
var computed = {};

computed.tableTitle = function () {
	return (this.type === 1) ? '本市热门出行线路' : '本市近十天热门旅游线路';
};
computed.heads = function () {
	let a = [
		'Top',
		(this.type === 1) ? '出行线路' : '旅游线路',
		'人数'
	];
	return a;
};
computed.loadingTip = function () {
	if (this.type === 2) {
		return '该数据需要实时计算，时间可能较长，请耐心等待...';
	}
	return '数据加载中，请稍等...';
};
var mounted = function () {
	this.$on('onDateChange', this.fetchRender);
	this.fetchRender();
	IframeUtil.on('gis_visitorOD_ready', this.onODReady);
	IframeUtil.on('gis_travelFlow_ready', this.onTravelReady);
};
let beforeDestroy = function () {
	IframeUtil.off('gis_visitorOD_ready', this.onODReady);
	IframeUtil.off('gis_travelFlow_ready', this.onTravelReady);
};
let dataFunc = function () {
	const startDate2 = MDate.Util.getDateOffset(new Date, -11);
	var o = {
		type: 1,
		rankActive: null,
		rankData: undefined,
		loadingTable: false,
		startDatetime2: MDate.Util.getYMDStr(startDate2),
		days: 0
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
@import "../../../less/global/config";
.analysis-part {
}



.start-btn {
	vertical-align: top;
}

</style>
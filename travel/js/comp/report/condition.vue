<template>
<div class="comp-condition">
	<div class="m-row w-auto mb15">

		<div class="m-col pr15" v-show="dimVisible">
			<div class="btn-group">
				<button class="btn" :class="{active: isDimCity}"
					@click="changeDim('city')">城市分析报告</button>
				<button class="btn" :class="{active: isDimScenery}"
					@click="changeDim('scenery')">景区分析报告</button>
			</div>
		</div>
		

		<div class="m-col pl5 pr15" v-show="isDimCity">
			<div class="btn-group">
				<button class="btn" :class="{active: isMonthDateType}"
					@click="changeDateType('month')">月分析</button>
				<button class="btn" :class="{active: isYearDateType}"
					@click="changeDateType('year')">年分析</button>
				<button class="btn" :class="{active: isDiyDateType}"
					@click="changeDateType('diy')">自定义时间分析</button>
			</div>
		</div>
		<!-- 选择年月 -->
		<div class="m-col chosen-col pl5" v-if="yearMonthVisible">
			<label v-text="yearMonthLabel"></label>
			<v-chosen class="year-chosen" :options="yearlist"
				v-model="year"></v-chosen>
			<v-chosen class="month-chosen" :options="monthlist"
				v-if="isMonthDateType"
				v-model="month"></v-chosen>
		</div>
		<!-- 选择日期 -->
		<div class="m-col pl5" v-if="datepickerVisible">
			<label>选择日期：</label>
			<datepicker class-name="input-text" v-model="start_date"
				class="date-input" />
			<span class="mh5">至</span>
			<datepicker class-name="input-text" v-model="end_date"
				class="date-input" />
		</div>
	</div>
	<div class="m-row w-auto">
		<div class="m-col chosen-col pl5">
			<label >选择地市：</label>
			<v-chosen class="city-chosen" :options="citylist"
				v-if="citylistVisible"
				v-model="cityId" 
				@change="onCityChange"></v-chosen>
			<mui-select class="scenery-select" :options="scenerylist"
				v-model="sceneryValue" placeholder="请选择景区"
				ref="scenerySelect" 
				v-if="isDimScenery" />
		</div>

		<div class="m-col pl20" v-if="inited">
			<button class="btn btn-primary" @click="asyncSubmit"
				v-show="submitBtnVisible">
				提交查询
			</button>
			<button class="btn btn-default ml15" @click="$emit('report')"
				v-show="searched">导出PDF</button>

			<button class="btn btn-info ml15" @click="$emit('pptx')"
				v-show="searched"
				:disabled="pptDisabled"
				:title="pptBtnTitle">导出PPT</button>

			<button class="btn btn-default ml15" v-show="resetBtnVisible"
				@click="reset">重置</button>
		</div>
	</div>

</div>
</template>

<script>
import {request, config, mlayer} from 'root';
import MDate from 'lib/mdate.js';
import URL from 'util/url.js';
const IS_AUTH_ALL_CITY = (config.user.auth === 'all');
const tDateParam = (dateStr) => {
	if (dateStr.indexOf('-') > 0) {
		return dateStr;
	}
	return [
		dateStr.substr(0, 4),
		dateStr.substr(4, 2),
		dateStr.substr(6, 2)
	].join('-');
};
var methods = {};
methods.onCityChange = function () {
	this.$nextTick(this.updateScenerylist);
};
methods.reset = function () {
	if (!confirm('重置后，数据和报告将被清除，不再提供查询和下载。确定重置吗？')) {
		return;
	}
	const r = () => {
		this.sceneryValue = [];
		this.$store.commit('setStatus', 'default');
		this.$emit('reset');
	};
	request.getJSON3('/async/report/clear').then((data) => {
		r();
		mlayer.msg('已重置');
	}).catch((e) => {
		r();
	});
};
methods.getSelectedScenerys = function () {
	if (this.$refs.scenerySelect) {
		return this.$refs.scenerySelect.getItemByValues(
			this.sceneryValue
		);
	}
};
// 立即查询
methods.onSubmit = function () {
	let o = {
		start_date: this.start_date,
		end_date: this.end_date,
		city_id: this.cityId,
		city_name: this.cityName,
		year: this.year,
		month: this.month
	};
	let selectedScenerys = this.getSelectedScenerys();
	if (selectedScenerys) {
		o.scenery_ids = this.sceneryIds;
		o.scenery_names = selectedScenerys.map(v => v.text);
	}

	this.$store.commit('setCondition', o);
	this.$emit('submit');
};
// 异步查询
methods.asyncSubmit = function () {
	if (this.isDimCity) {
		let o = {
			scenery_city: this.cityId,
			scenery_ids: null
		};
		if (this.isYearDateType) {
			o.start_date = this.year + '01';
			o.end_date = this.year + '12';
		} else if (this.isMonthDateType) {
			o.start_date = this.year + this.month;
			o.end_date = o.start_date;
		} else {
			o.start_date = this.start_date.replace(/-/g, '');
			o.end_date = this.end_date.replace(/-/g, '');
		}
		this.$emit('async-city', o);
	} else {
		this.$emit('async-scenery', {
			start_date: this.start_date.replace(/-/g, ''),
			end_date: this.end_date.replace(/-/g, ''),
			scenery_city: this.cityId,
			scenery_ids: this.sceneryIds
		});
	}
};
methods.changeDim = function (dim) {
	if (this.$store.state.dimType === dim) {
		return;
	}
	this.sceneryValue = []; // 清空景区
	this.$store.commit('setStatus', 'default');
	this.$store.commit('setDim', dim);
};
methods.changeDateType = function (dateType) {
	if (this.$store.state.dateType === dateType) {
		return;
	}
	this.$store.commit('setDateType', dateType);
};
methods.updateScenerylist = function () {
	let p = {
		cityId: this.cityId,
		userId: this.vConfig.user.id
	};
	this.scenerylist = null;
	return request.getCityChildrenAccounts(p).then((r) => {
		this.scenerylist = r.map((v) => {
			return {
				text: v.sceneryName,
				value: v.sceneryId,
				disabled: false
			};
		});
		this.sceneryValue = [];
		return this.scenerylist;
	});
};
// 立即查看数据
methods.restoreParam = function (o) {
	let ids = o.scenery_ids;
	// 回填日期
	if (!ids || (ids.length === 0)) { // 城市查询
		this.$store.commit('setDim', 'city');
		if (o.start_date && o.start_date.length === 6) { // 年月查询
			if (o.start_date === o.end_date) {
				this.$store.commit('setDateType', 'month');
				this.year = o.start_date.substr(0, 4);
				this.month = o.start_date.substr(4);
			} else {
				this.$store.commit('setDateType', 'year');
				this.year = o.start_date.substr(0, 4);
			}
		} else {
			this.$store.commit('setDateType', 'diy');
			this.start_date = tDateParam(o.start_date);
			this.end_date = tDateParam(o.end_date);
		}
	} else {
		if (o.start_date) {
			this.start_date = tDateParam(o.start_date);
		}
		if (o.end_date) {
			this.end_date = tDateParam(o.end_date);
		}
	}

	// 回填景区
	if (o.scenery_city && o.scenery_city != this.cityId) {
		this.cityId = o.scenery_city;
		this.updateScenerylist().then((list) => {
			this.sceneryValue = ids || [];
			this.onSubmit();
		});
	} else {
		this.sceneryValue = ids || [];
		this.onSubmit();
	}
	this.$store.commit('setStatus', 'onSubmit');
};
var computed = {};
computed.citylistVisible = function () {
	return IS_AUTH_ALL_CITY;
};
computed.checkAllImg = function () {
	return this.vImgPath + '/check_all.png';
};
computed.sceneryIds = function () {
	return this.sceneryValue.join(',');
};
computed.pptDisabled = function () {
	return (this.skin !== 'default');
};
computed.pptBtnTitle = function () {
	return (this.pptDisabled) ? '请切换至默认主题' : '导出pptx';
};
computed.cityName = function () {
	if (!this.citylist) {
		return '';
	}
	for (let i = 0; i < this.citylist.length; i++) {
		if (this.citylist[i].value == this.cityId) {
			return this.citylist[i].text;
		}
	}
};
computed.isDimCity = function () {
	return this.$store.getters.isDimCity;
};
computed.isDimScenery = function () {
	return this.$store.getters.isDimScenery;
};
computed.isMonthDateType = function () {
	return this.$store.getters.isMonthDateType;
};
computed.isYearDateType = function () {
	return this.$store.getters.isYearDateType;
};
computed.isDiyDateType = function () {
	return this.$store.getters.isDiyDateType;
};
computed.yearMonthVisible = function () {
	return this.isDimCity && (this.isYearDateType || this.isMonthDateType)
};
computed.datepickerVisible = function () {
	return (this.isDiyDateType) || (this.isDimScenery);
};
computed.dimVisible = function () {
	return true;
};
computed.inited = function () {
	return this.$store.state.inited;
};
computed.status = function () {
	return this.$store.state.status;
};
computed.submitBtnVisible = function () {
	return (this.status === 'default');
};
computed.resetBtnVisible = function () {
	return (this.status === 'onSubmit');
};
computed.yearMonthLabel = function () {
	return this.isYearDateType ? '选择年份：' : '选择月份：';
};
var watch = {};
const mounted = function () {
	this.updateScenerylist();
	this.vBus.on('restoreReportParam', this.restoreParam);
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let d = new Date();
	let citylist = request.getStaticCityOptions();
	if (IS_AUTH_ALL_CITY) {
		var cityId = citylist[0].value;
	} else {
		cityId = config.user.cityId;
	}
	// 年份options
	let yearlist = [];
	let year = d.getFullYear();
	for (let y = year; y >= 2018; y--) {
		yearlist.push(y);
	}
	if (yearlist.length === 0) {
		yearlist.push(year);
	}
	// 月份options
	let monthlist = [
		'01', '02', '03', '04', '05', '06',
		'07', '08', '09', '10', '11', '12'
	];
	var o = {
		citylist,
		scenerylist: null,
		sceneryValue: [],
		cityId,
		searchWord: '',
		year,
		yearlist,
		monthlist,
		month: monthlist[0],
		start_date: MDate.Util.getDateOffsetStr(new Date, -30, 'day'),
		end_date: MDate.Util.getDateOffsetStr(new Date, -1, 'day')
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: ['searched', 'skin'],
	mounted,
	beforeDestroy,
	components: {
		'mui-select': require('comp/mui/select.vue'),
		'v-chosen': require('comp/common/v-chosen.vue')
	}
};
</script>
<style lang="less">
.comp-condition .chosen-col {
	position: relative;
	& > label {
		vertical-align: top;
		line-height: 30px;
	}
	& > .chosen-container {
		vertical-align: top;
	}
}
</style>
<style scoped lang="less">
@import (reference) "../../ref.less";

.comp-condition {
	background-color: #EEE;
	border: 1px solid #999;
	border-radius: 4px;
	padding: 10px;
	width: @report-slide-width;
}

.date-input {
	width: 100px;
}

.selected-box {
	& > label {
		vertical-align: top;
		line-height: 26px;
	}
}
.selected-list {
	display: inline-block;
	width: 90%;
	& > li {
		display: inline-block;
		background-color: #fff;
		border: 1px solid #999;
		padding: 4px 8px;
		border-radius: 4px;
		margin-right: 8px;
		margin-bottom: 8px;
		.fa {
			cursor: pointer;
		}
	}
}
.mui-select.scenery-select {
	width: 220px;
}
.year-chosen.m-chosen {
	width: 78px;
	min-width: 78px;
}
.month-chosen.m-chosen {
	width: 66px;
	min-width: 66px;
}
.check-all-btn {
	position: absolute;
	top: 5px;
	right: 8px;
	img {
		height: 20px;
	}
}
li.clear-btn {
	color: #fff;
	background-color: #8FC31F;
	cursor: pointer;
}
.btn.active {
	background-color: #6FB242;
	color: #fff;
	border-color: #777;
}
.m-col > label,
.m-col > span {
	font-size: 13px;
}
</style>
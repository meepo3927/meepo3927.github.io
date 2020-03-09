<template>
<!-- 日期选择 -->
<div class="datepicker-box">
	<label>选择日期：</label>
	<span class="d-span">从</span>
	<datepicker class="date-input" v-model="dateValue" />
	<span class="d-span">往前</span>
	<select class="select-big" v-model="cycle">
		<option value="week">1 周</option>
		<option value="month">1 月</option>
	</select>
</div>
</template>

<script>
import MDate from 'lib/mdate.js';
var DateUtil = MDate.Util;
var methods = {};
methods.setDate = function (v) {
	this.dateValue = v;
};
methods.setPreviousDate = function () {
	let v = DateUtil.getDateOffsetStr(this.dateValue, -1);
	this.dateValue = v;
};
methods.getDefaultDate = function () {
	var nowDate = new Date();
	var date = DateUtil.getDateOffset(nowDate, -1);
	return DateUtil.getYMD(date);
};
methods.getStartEnd = function () {
	let endStr = this.dateValue;
	let end = DateUtil.parseDate(endStr);
	let num = 1;
	let start = DateUtil.getDateOffset(end, -num, this.cycle);

	return {
		start_date: DateUtil.getYMD(start),
		end_date: endStr
	};
};
methods.emitChange = function () {
	this.$emit('change', this.getParam(), this.getStartEnd());
};
methods.emitUserChange = function () {
	this.$emit('user-change', this.getParam(), this.getStartEnd());
};
methods.getParam = function () {
	return {
		deal_date: this.dateValue,
		cycle: this.cycle
	};
};

var computed = {};
var watch = {};
watch.dateValue = function () {
	this.emitChange();
	this.emitUserChange();
};

watch.cycle = function () {
	this.emitChange();
	this.emitUserChange();
};
var mounted = function () {
	this.$nextTick(this.emitChange);
};
let beforeDestroy = function () {};
let dataFunc = function () {
	let defaults = this.defaults || {};
	var o = {
		dateValue: defaults['date'] || this.getDefaultDate(),
		// num: defaults[1] || 1,
		cycle: defaults.cycle || 'week'
	};

	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: ['defaults'],
	mounted,
	beforeDestroy,
	components: {
		'v-chosen': require('comp/common/v-chosen.vue')
	}
};
</script>

<style scoped lang="less">

.datepicker-box.style-inline {
	display: inline-block;
}
.date-input {
	width: 160px;
}
.select-big {
	vertical-align: top;
}
</style>
<template>
<div class="comp-condition">
	<div class="m-row w-auto">
		<div class="m-col">
			<label>选择日期：</label>
			
			<datepicker class-name="input-text" v-model="start_date"
				class="date-input" />
			<span class="mh10">至</span>
			<datepicker class-name="input-text" v-model="end_date"
				class="date-input" />
		</div>

		<div class="m-col pl20 chosen-col">
			<label >选择景区：</label>
			<v-chosen class="city-chosen" :options="citylist"
				v-if="citylistVisible"
				v-model="cityId"
				@change="onCityChange"></v-chosen>
			<mui-select class="scenery-select" :options="scenerylist"
				v-model="sceneryValue" placeholder="请选择景区"
				ref="scenerySelect" />
		</div>

		<div class="m-col pl20">
			<button class="btn btn-primary" @click="onSubmit">
				提交查询
			</button>
			<button class="btn btn-default ml15" @click="$emit('pdf')"
				v-show="searched">导出PDF</button>

			<button class="btn btn-info ml15" @click="$emit('pptx')"
				v-show="searched"
				:disabled="pptDisabled"
				:title="pptBtnTitle">导出PPT</button>
		</div>
	</div>

</div>
</template>

<script>
import {request, config, mlayer} from 'root';
import MDate from 'lib/mdate.js';
const IS_AUTH_ALL_CITY = (config.user.auth === 'all');
var methods = {};
methods.onCityChange = function () {
	this.$nextTick(this.updateScenerylist);
};
// 立即查询
methods.onSubmit = function () {
	let o = {
		start_date: this.start_date,
		end_date: this.end_date,
		city_id: this.cityId,
		city_name: this.cityName
	};
	let selectedScenerys = this.getSelectedScenerys();
	if (selectedScenerys) {
		o.scenery_ids = this.sceneryIds;
		o.scenery_names = selectedScenerys.map(v => v.text);
	}

	this.$store.commit('setCondition', o);
	this.$emit('submit');
};
methods.getSelectedScenerys = function () {
	if (this.$refs.scenerySelect) {
		return this.$refs.scenerySelect.getItemByValues(
			this.sceneryValue
		);
	}
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
var watch = {};
const mounted = function () {
	this.updateScenerylist();
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let citylist = request.getStaticCityOptions();
	if (IS_AUTH_ALL_CITY) {
		var cityId = citylist[0].value;
	} else {
		cityId = config.user.cityId;
	}
	var o = {
		citylist,
		scenerylist: null,
		sceneryValue: [],
		cityId,
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
	width: 130px;
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
	width: 280px;
}
.scenery-chosen {
	width: 280px;
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
</style>
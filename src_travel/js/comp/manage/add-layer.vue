<template>
<center-layer >
<!-- 已迁移至 pages/modify-scenery.vue -->
<div class="add-scenery-layer common-form-layer">
	<close-box @close="$emit('close')" />
	<h2>景区基础用户</h2>
	<form action="" class="label-w-7">
		<!-- 归属地市 -->
		<div class="form-item" >
			<label for="">归属地市<em class="i-star">*</em>：</label>
			<div class="x-right pr30">
				<v-chosen :options="citylist" v-model="form.cityID" />
			</div>

			<label for="" style="width: auto;">区县：</label>
			<v-chosen :options="arealist" v-model="form.areaID"
				class="area-chosen" />
		</div>

		<!-- 名称 -->
		<div class="form-item" >
			<label for="">景区名称<em class="i-star">*</em>：</label>
			<div class="x-right ">
				<input type="text" class="input-text" placeholder="例如：某公园"
					v-model="form.sceneryName" />
			</div>
		</div>

		<!-- 简介 -->
		<div class="form-item v-top" >
			<label for="">景区简介：</label>
			<div class="x-right ">
				<textarea class="input-text"
					v-model="form.sceneryDesc"></textarea>
			</div>
		</div>

		<!-- 星级 -->
		<div class="form-item " >
			<label for="">景区星级：</label>
			<div class="x-right ">
				<v-chosen :options="starOptions" v-model="form.sceneryStar" />
			</div>
		</div>

		<!-- 类型 -->
		<div class="form-item " >
			<label for="">景区类型：</label>
			<div class="x-right ">
				<v-chosen :options="busiTypeOptions" v-model="sceneryBusiType">
				</v-chosen>
			</div>
		</div>

		<!-- Form Item -->
		<div class="form-item " >
			<label for="">旺季营业时间：</label>
			<div class="x-right ">
				<je-date class="input-text time-input" placeholder="08:00"
					v-model="form.busyOpenTimeStart"
					hh="08"
					mm="00"
					format="hh:mm" />
				<span class="input-break-span">到</span>
				<je-date class="input-text time-input" placeholder="18:30"
					v-model="form.busyOpenTimeOver"
					hh="18"
					mm="30"
					format="hh:mm" />
			</div>
		</div>

		<!-- Form Item -->
		<div class="form-item " >
			<label for="">淡季营业时间：</label>
			<div class="x-right ">
				<je-date class="input-text time-input" placeholder="09:00"
					v-model="form.slackOpenTimeStart"
					hh="09"
					mm="00"
					format="hh:mm" />
				<span class="input-break-span">到</span>
				<je-date class="input-text time-input" placeholder="17:30"
					v-model="form.slackOpenTimeOver"
					hh="17"
					mm="30"
					format="hh:mm" />
			</div>
		</div>

		<!-- Form Item -->
		<div class="form-item " >
			<label for="">旺季：</label>
			<div class="x-right ">
				<je-date class="input-text date-input"
					v-model="form.busyOpenDateStart" />
				<span class="input-break-span">到</span>
				<je-date class="input-text date-input"
					v-model="form.busyOpenDateOver" />
				<span class="ml20">门票：</span>
				<input-number class="input-text money-input"
					v-model="form.priceBusy" min="0" />
				<span>元</span>
			</div>
		</div>

		<!-- Form Item -->
		<div class="form-item " >
			<label for="">淡季：</label>
			<div class="x-right ">
				<je-date class="input-text date-input"
					v-model="form.slackOpenDateStart" />
				<span class="input-break-span">到</span>
				<je-date class="input-text date-input"
					v-model="form.slackOpenDateOver" />
				<span class="ml20">门票：</span>
				<input-number class="input-text money-input"
					v-model="form.priceSlack" min="0" />
				
				<span>元</span>
			</div>
		</div>

		<!-- Form Item -->
		<div class="form-item " >
			<label for="">游客容量：</label>
			<div class="x-right pr30">
				<input-number class="input-text capacity-input"
					v-model="form.capacity" min="0" />
				
				<span>人</span>
			</div>

			<label for="" class="w-auto">区域类型<em class="i-star">*</em>：</label>
			<v-chosen :options="typeOptions" v-model="form.sceneryType"></v-chosen>
		</div>

		<!--
		<div class="form-item">
			<label for="">上传景区头像：</label>
			<div class="x-right">
				<file-upload filetype="image" />
			</div>
		</div>
		-->
		
		<!-- 按钮 -->
		<div class="form-item ">
			<label for="" >&nbsp;</label>
			<div class="x-right">
				<button class="btn" type="button" @click="submit">下一步</button>

				<button class="btn ml15" type="button" 
					@click="close">取消</button>

				<button class="btn ml15" type="button" 
					@click="reset">清空</button>

				<span class="inline-loading ml10" v-show="loading"></span>
			</div>
		</div>
	</form>
</div>
</center-layer>
</template>

<script>

import {request, config} from 'root';
import 'mVali';
import tool from 'util/tool.js';

var methods = {};
methods.close = function () {
	this.$emit('close');
};
methods.reset = function () {
	let formHash = [
		'sceneryName',
		'sceneryDesc',
		'capacity',
		'priceSlack', 'priceBusy',
		'busyOpenTimeStart',
		'busyOpenTimeOver',
		'slackOpenTimeStart',
		'slackOpenTimeOver',

		'busyOpenDateStart',
		'busyOpenDateOver',
		'slackOpenDateStart',
		'slackOpenDateOver'
	];
	formHash.forEach((v) => {
		this.form[v] = '';
	});
};
methods.handleSuccess = function (data) {
};
const tripDateTime = (str) => {
	return str.replace(/[-:]/g, '');
};
methods.getParam = function () {
	let fm = this.form;
	let formHash = [
		'cityID', 'areaID',
		'sceneryName', 'sceneryDesc',
		'sceneryStar',
		// 景区类型
		'sceneryBusiType',
		// 游客容量
		'capacity',
		// 门票价格
		'priceSlack', 'priceBusy',
		// 区域类型
		'sceneryType'
	];
	let r = {};
	formHash.forEach((v) => {
		r[v] = fm[v];
	});

	// 旺季营业时间
	r.openhoursBusyTime = tripDateTime(fm.busyOpenTimeStart)
		+ '-' + tripDateTime(fm.busyOpenTimeOver);
	// 淡季营业时间
	r.openhoursSlackTime = tripDateTime(fm.slackOpenTimeStart)
		+ '-' + tripDateTime(fm.slackOpenTimeOver);
	// 旺季日期
	r.seasonBusyDate = tripDateTime(fm.busyOpenDateStart)
		+ '-' + tripDateTime(fm.busyOpenDateOver);
	// 淡季日期
	r.seasonSlackDate = tripDateTime(fm.slackOpenDateStart)
		+ '-' + tripDateTime(fm.slackOpenDateOver);
	
	// 操作人ID
	r.operatorCode = this.vConfig.user.code;

	// for-dev
	r.locations = 'lac1|cell1,lac2|cell2,lac3|cell3';
	return r;
};
methods.checkForm = function () {
	if (!this.form.sceneryName) {
		mlayer.msg('景区名称不能为空');

		return false;
	}

	return true;
};
methods.submit = function () {
	if (this.loading) {
		return;
	}
	if (!this.checkForm()) {
		return;
	}
	this.loading = true;
	let p = this.getParam();
	request.insertSceneryInfoExtend(p).then((r) => {
		this.loading = false;
		if (r.success) {
			this.handleSuccess();
		} else {
			mlayer.msg(r.msg || '提交失败');
		}
	}).catch(() => {
		this.loading = false;
		mlayer.msg('提交失败');
	});
};
methods.updateArealist = function () {
	request.getCountryByCityID(this.form.cityID).then((r) => {
		this.arealist = r.map((v) => {
			return {
				text: v.name,
				value: v.id
			};
		});

		this.form.areaID = this.arealist[0].value;
		
	});
};

var computed = {};
const starOptions = ['A', 'AA', 'AAA', 'AAAA', 'AAAAA', '未评级'];
const busiTypeOptions = [
	'自然景观',
	'人文历史',
	'公园游乐',
	'休闲度假',
	'其他'
];
const typeOptions = [
	'旅游景区',
	'公共场所',
	'其他'
];
computed.starOptions = function () {
	return starOptions;
};
computed.busiTypeOptions = function () {
	return busiTypeOptions;
};
computed.typeOptions = function () {
	return typeOptions;
};
var watch = {};
const created = function () {
	this.$watch('form.cityID', this.updateArealist); 
};
var mounted = function () {
	window.ADD_LAYER = this;
	// this.updateArealist();
};
let beforeDestroy = function () {};
let dataFunc = function () {
	let citylist = request.getStaticCityOptions();
	var o = {
		loading: false,
		citylist,
		arealist: null,
		form: {
			cityID: citylist[0].value,
			areaID: null,
			sceneryName: '',
			sceneryDesc: '',
			sceneryStar: starOptions[2],
			sceneryBusiType: busiTypeOptions[0],
			sceneryType: typeOptions[0],
			busyOpenTimeStart: '',
			busyOpenTimeOver: '',
			slackOpenTimeStart: '',
			slackOpenTimeOver: '',

			busyOpenDateStart: '',
			busyOpenDateOver: '',
			slackOpenDateStart: '',
			slackOpenDateOver: '',

			capacity: '',
			priceBusy: '',
			priceSlack: ''
		}
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/with_cover.js')
	],
	methods,
	computed,
	props: [],
	created,
	mounted,
	beforeDestroy,
	components: {
		'close-box': require('comp/chart_layer/close-box.vue'),
		'file-upload': require('comp/common/file-upload.vue'),
		'je-date': require('comp/common/je-date.vue'),
		'v-chosen': require('comp/common/v-chosen.vue'),
		'input-number': require('comp/common/input-number.vue')
	}
};
</script>

<style scoped lang="less">
.add-scenery-layer {
	
}
.area-chosen {
	width: 160px;
}
@time-input-width: 120px;
.time-input,
.date-input {
	width: @time-input-width;
}
.input-break-span {
	margin-left: 10px;
	margin-right: 10px;
}
.money-input {
	width: 60px;
}
.capacity-input {
	width: 80px;
}
.form-item span {
	font-size: 13px;
}
</style>
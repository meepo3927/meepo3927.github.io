<template>
<div class="analysis-layer root-el" >
<div class="x-wrapper">
	<!-- 头部 -->
	<div class="x-head">
		<h4>出省数据分析</h4>
		<select class="select-big x-city-select" v-show="citySelectVisible"
			v-model="cityId" >
			<option v-for="v in citylist" v-text="v.name"
				:value="v.id"></option>
		</select>
		<head-nav :config="navConfig" :index="partIndex" 
			@change="switchPart" />
	</div>

	<!-- 内容 -->
	<div class="x-body">
		<transition @leave="leaveXAnim" @enter="enterXAnim">
			<keep-alive >
			<div :is="part" ref="part" class="x-part"
				:area="area"
				:key="partIndex" ></div>
			</keep-alive>
		</transition>
	</div>
</div><!-- x-wrapper -->
</div><!-- root -->
</template>

<script>
import 'root';
import config from 'global/config';
import request from 'util/request';

var methods = {};

var computed = {};
computed.navConfig = function () {
	return [
		{
			name: '客流流量分析',
			icon: 'fa-line-chart'
		},
		{
			name: '客流去向分析',
			icon: 'fa-location-arrow'
		},
		{
			name: '游客构成分析',
			icon: 'fa-pie-chart'
		},
		{
			name: '客流驻留时间分析',
			icon :'fa-pie-chart'
		}
	];
};
computed.citySelectVisible = function () {
	return config.user.auth === 'all';
};
computed.area = function () {
	return {
		id: this.areaId,
		name: this.areaName
	};
};
computed.areaId = function () {
	return this.citySelectVisible ? this.cityId : config.user.cityId;
};
computed.areaName = function () {
	let id = this.areaId;
	if (!id) {
		return '';
	}
	for (let i = 0; i < this.citylist.length; i++) {
		let v = this.citylist[i];
		if (v.id == id) {
			return v.name;
		}
	}
};
var watch = {};
var mounted = function () {};
let beforeDestroy = function () {};
let dataFunc = function () {
	let citylist = request.getStaticCityList();
	var o = {
		citylist,
		partIndex: 1,
		cityId: citylist[0].id
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/analysis_layer.js')
	],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {
		'part-1': require('comp/leave_city/part-1.vue'),
		'part-2': require('comp/leave_city/part-2.vue'),
		'part-3': require('comp/leave_city/part-3.vue'),
		'part-4': require('comp/leave_city/part-4.vue')
	}
};
</script>

<style scoped lang="less">
.root-el {
	height: 100%;
	position: relative;
}
.x-city-select {
	float: left;
	margin-top: 14px;
	margin-left: 20px;

	width: 140px;
	height: 34px;
	font-size: 14px;
}
.x-head {
	padding-left: 80px !important;
}
</style>
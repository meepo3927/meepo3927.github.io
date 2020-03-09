<template>
<div class="navbar right-navbar" :class="[overflowHidden ? 'o-hidden': 'o-visible']">
	<a href="javascript:;" class="area-name" @click="click(1)" :title="areaName">
		<span>{{areaName}}</span>
		<i class="fa fa-caret-down"></i>
	</a>
	<a href="javascript:;" class="btn-2" @click="click(2)">
		<i class="fa fa-line-chart"></i>
		实时监控
	</a>
	<a href="javascript:;" class="btn-3" @click="click(3)">
		<i class="fa fa-area-chart"></i>
		数据分析
	</a>
	<a href="javascript:;" class="heatmap-toggle-btn" @click="toggleHeatmap"
		v-show="heatmapBtnVisible">
		<i class="fa fa-dot-circle-o"></i>
		{{heatmapBtnLabel}}
	</a>
	<a :href="bigShowUrl" target="_blank" class="btn-big-screen" v-show="bigScreenVisible">
		<i class="fa fa-th-large"></i>
		大屏展示
	</a>
	<a :href="monitorUrl" target="_blank" class="btn-monitor" 
		v-show="monitorBtnVisible">
		<i class="fa fa-user-o"></i>
		人流监控
	</a>
	<a href="javascript:;" class="toggle-btn" :title="toggleTitle"
		v-show="toggleBtnVisible"
		@click="toggle">
		<i class="fa " :class="[overflowHidden ? 'fa-angle-right' : 'fa-angle-left']"></i>
	</a>
</div>
</template>

<script>
import myStore from 'store/rightbar.js';
import config from 'global/config.js';
import request from 'util/request.js';

const EMPTY_URL = 'javascript:;';

var methods = {};
var computed = {};

computed.bigShowUrl = function () {
	return this.getStaticUrl('/bigshow', 'id=' + this.myArea.id);
};
computed.monitorUrl = function () {
	if (!this.attractionCityId || !this.myArea.id) {
		return EMPTY_URL;
	}
	return config.basePath + '/bigdata/monitor'
		+ '?scenery_id=' + this.myArea.id
		+ '&city_id=' + this.attractionCityId;
};
computed.bigScreenVisible = function () {
	// 只有景区有大屏展示
	if (!this.isAttraction) {
		return false;
	}
	// bar隐藏状态下，不显示
	if (this.overflowHidden) {
		return false;
	}

	return true;
};
computed.monitorBtnVisible = function () {
	if (this.monitorUrl === EMPTY_URL) {
		return false;
	}
	return this.bigScreenVisible;
};
computed.toggleBtnVisible = function () {
	if (this.isProvince) {
		return false;
	}
	// 非景区下，不显示，因为足够宽
	if (this.isAttraction) {
		return true;
	}

	// 名字太长，显示
	return !!this.isNameVerylong;
};
computed.heatmapBtnVisible = function () {
	if (this.isCity) {
		return true;
	}

	if (this.isAttraction) {
		if (!this.overflowHidden) {
			return true;
		}
		if (this.isNameVerylong) {
			return false;
		}
		return true;
	}

	return false;
};
computed.isNameVerylong = function () {
	if (!this.areaName) {
		return false;
	}
	return (this.areaName.length > 5);
	// return (this.areaName.length > 9);
};
computed.myArea = function () {
	return this.area || {};
};
computed.isProvince = function () {
	return (this.myArea.level === 'province')
};
computed.isCity = function () {
	return (this.myArea.level === 'city');
};
computed.isAttraction = function () {
	return (this.myArea.level === 'attraction');
};
computed.areaId = function () {
	return this.myArea.id;
};
var mounted = function () {};
let dataFunc = function () {
	var o = {
		attractionCityId: undefined
	};
	return o;
};
let watch = {};
watch.areaId = function (id) {
	if (!id || !this.isAttraction) {
		this.attractionCityId = undefined;
		return;
	}
	request.getCitiesMap().then((hash) => {
		if (hash[id] && hash[id].parent) {
			this.attractionCityId = hash[id].parent.placeID;
		}
	});
};
watch.areaName = function () {
	if (!this.isAttraction) {
		if (!this.overflowHidden) {
			this.overflowHidden = true;
		}

	} else if (!this.toggleBtnVisible) {
		this.overflowHidden = true;
	}
};
export default {
	watch,
	store: myStore,
	data: dataFunc,
	methods,
	computed,
	mixins: [
		require('mixins/navbar.js')
	],
	props: ['areaName', 'area'],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";

</style>
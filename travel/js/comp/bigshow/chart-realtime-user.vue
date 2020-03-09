<template>
<div class="chart-realtime-user m-panel m-right-chart" 
	v-show="userNum">
	
	<!-- logo 
	<div class="x-img">
		<img :src="logoSrc" alt="">
	</div>

	-->
	<h3 >
		<span v-text="title"></span>
		<!-- 人数 -->
		<div class="x-user-num" >
			<span v-text="userNum" :class="{'a-rotate': rotating}"></span>
			<em>人</em>
		</div>
	</h3>
	

	<!-- chart 
	<div class="v-chart" ref="chart"></div>

	-->
</div>
</template>

<script>
import chartUtil from 'util/chart';
import echarts from 'echarts';
import request from 'util/request';
import tool from 'util/tool';
import URL from 'util/url.js';

const loopInterval = 6 * 1000;
const sceneryId = URL.query().id || 7112;

var methods = {};
methods.rotate = function (n) {
	this.rotating = true;
	clearTimeout(this.rotateTimer);
	this.rotateTimer = setTimeout(() => {
		this.rotating = false;
	}, 550);
};
methods.loopFetch = function () {
	setTimeout(this.fetchRender, loopInterval);
};
methods.fetchRender = function () {
	request.getAttractionDetail(sceneryId).then((data) => {
		this.rotate();
		this.$store.commit('setRealtimeScenery', data);
		this.loopFetch();
	}).catch(() => {
		this.loopFetch();
	});
};
var computed = {};
computed.logoSrc = function () {
	return this.vImgPath + '/logo.png';
};
computed.title = function () {
	let name = this.placeName || '景区';
	return name + '当前客流量';
};
computed.userNum = function () {
	return this.$store.getters.realtimeUserNum;
};
computed.placeName = function () {
	return this.$store.getters.realtimePlaceName;
};

var watch = {};
var mounted = function () {
	this.fetchRender();
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		rotating: false
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
	],
	methods,
	computed,
	props: [],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.v-chart {
}
</style>
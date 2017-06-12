<template>
<div class="chart-realtime-user m-panel m-right-chart" 
	v-show="userNum">
	
	<!-- logo 
	<div class="x-img">
		<img :src="logoSrc" alt="">
	</div>

	-->
	<h3 >
		<span>会场及周边实时人数</span>
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

const getUserNum = (list) => {
    let len = list.length;
    for (let i = len - 3; i >= 0; i--) {
        let item = list[i] || {};
        if (item.userNum !== undefined) {
            return item.userNum;
        }
    }
    return 0;
};

const renderChart = false;
var methods = {};
methods.setNumber = function (n) {
	this.rotating = true;
	setTimeout(() => {
		this.rotating = false;
		this.userNum = n;
	}, 550);
};
methods.fetchRender = function (r) {

	let n = 0;
	let list = r[0] || [];
	list.forEach((v) => {
		n += v.userNum;
	});
	this.setNumber(n);
	// this.userNum = n;

};
methods.fetchRender2 = function () {
	request.getBigShowRealtimeUser(this.pId).then((data) => {

		this.userNum = getUserNum(data);

		if (renderChart) {
			let option = chartUtil.getHumanTrafficOption({
				data
			});
			option = tool.extend(option, this.chartOption, {
				series: [{
					markLine: null
				}]
			});

			let myChart = this.getChartInstance();
			myChart.setOption(option);

			this.chart = myChart;
		}
		
		this.loopNext();
	});
};
var computed = {};
computed.logoSrc = function () {
	return this.vImgPath + '/logo.png';
};
var watch = {};
var mounted = function () {
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		rotating: false,
		userNum: ''
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		// require('./right_chart_mix.js')
		require('./real_mix.js')
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
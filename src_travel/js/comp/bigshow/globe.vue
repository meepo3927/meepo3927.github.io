<template>
<div class="v-globe">
	
</div>
</template>

<script>
import tool from 'util/tool';
import echarts from 'echarts';
import echartsGL from 'lib/echarts-gl.min.js';
import config from 'global/config';
import EchartUtil from 'util/echart.js';
import request from 'util/request';
import URL from 'util/url';

var methods = {};
methods.initChart = function (myChart, data) {

	var pointsData = [];
	data.forEach(function (v) {
	    pointsData.push([
	    	parseFloat(v.province_clogiitud), 
	    	parseFloat(v.province_clatitude)
	    ]);
	    pointsData.push([
	    	parseFloat(v.scenery_clogiitud), 
	    	parseFloat(v.scenery_clatitude)
	    ]);
	});

	var sData = data.map((v) => {
		return [
			[
				parseFloat(v.province_clogiitud),
				parseFloat(v.province_clatitude)
			],
			[
				parseFloat(v.scenery_clogiitud),
				parseFloat(v.scenery_clatitude)
			]
		];
	});

	var series = [{
		type: 'lines3D',
		name: 'china',

		effect: {
		    show: true,
		    trailWidth: 2,
		    trailLength: 0.6,
		    trailOpacity: 0.8,
		    trailColor: '#ff0000'
		    // trailColor: 'rgb(30, 30, 60)'
		},

		lineStyle: {
		    width: 2,
		    color: '#041348',
		    // color: 'rgb(50, 50, 150)',
		    // color: 'rgb(118, 233, 241)',
		    opacity: 0.1
		},
		blendMode: 'lighter',

		distanceToGlobe: 4,
		data: sData
	}];
	LOG('s data:', sData);

	series.push({
	    type: 'scatter3D',
	    coordinateSystem: 'globe',
	    blendMode: 'lighter',
	    symbolSize: 3,
	    distanceToGlobe: 4,
	    itemStyle: {
	        color: 'rgb(250, 250, 150)',
	        opacity: 0.6
	    },
	    data: pointsData
	});

	LOG('p:', pointsData);

	let baseTexture = 'globe/data-1491837049070-rJZtl7Y6x.jpg';
	let heightTexture = 'globe/data-1491837049070-rJZtl7Y6x.jpg';
	let environment = 'globe/data-1491837999815-H1_44Qtal.jpg';
	let texture = 'globe/data-1491838644249-ry33I7YTe.hdr';
	let light = {
        main: {
            intensity: 1,
            shadow: true
        },
        ambientCubemap: {
            texture,
            diffuseIntensity: 0.2
        }
    };
	myChart.setOption({
	    legend: {
	    },
	    globe: {
	        viewControl: {
	            autoRotate: this.autoRotate,
	            distance: 170
	        },
	        baseTexture,
	        heightTexture,
	        environment: environment,
	        displacementScale: 0.04,
	        shading: 'realistic',
	        realisticMaterial: {
	            roughness: 0.9
	        },
	        postEffect: {
	            enable: true
	        },
	        light
	    },
	    series: series
	});

};
methods.toggleRotate = function () {
	let myChart = this.chart;
	if (!myChart) {
		return false;
	}
	this.autoRotate = !this.autoRotate;
	let globe = {
		viewControl: {
			autoRotate: this.autoRotate
		}
	};
	myChart.setOption({
		globe
	}, {
		lazyUpdate: true
	});
};
methods.bind = function () {
	document.documentElement.addEventListener('keydown', (e) => {
		if (e.keyCode === 13) {
			this.toggleRotate();
		}
	});
};
methods.init = function () {
	request.getGlobe(URL.query().id).then((data) => {
		let myChart = echarts.init(this.$el);
		this.initChart(myChart, data);

		this.chart = myChart;
	});
};
var computed = {};
var watch = {};
var mounted = function () {
	setTimeout(() => {
		this.init();
	}, 0);

	this.bind();
};
let beforeDestroy = function () {
	if (this.chart) {
		this.chart.dispose();
		this.chart = null;
	}
};
let dataFunc = function () {
	var o = {
		autoRotate: false
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.v-globe {
	
}
</style>
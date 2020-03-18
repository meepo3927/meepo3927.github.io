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

var methods = {};
methods.initChart = function (myChart, data) {
	var airports = data.airports.map(function (item) {
	    return {
	        coord: [item[3], item[4]]
	    }
	});

	function getAirportCoord(idx) {
	    return [data.airports[idx][3], data.airports[idx][4]];
	}

	// Route: [airlineIndex, sourceAirportIndex, destinationAirportIndex]
	var routesGroupByAirline = {};
	data.routes.forEach(function (route) {
	    var airline = data.airlines[route[0]];
	    var airlineName = airline[0];
	    if (!routesGroupByAirline[airlineName]) {
	        routesGroupByAirline[airlineName] = [];
	    }
	    routesGroupByAirline[airlineName].push(route);
	});

	var pointsData = [];
	data.routes.forEach(function (airline) {
	    pointsData.push(getAirportCoord(airline[1]));
	    pointsData.push(getAirportCoord(airline[2]));
	});

	var series = data.airlines.map(function (airline, index) {
		if (index > 2) {
			return null;
		}
	    var airlineName = airline[0];
	    var routes = routesGroupByAirline[airlineName];

	    if (!routes) {
	        return null;
	    }
	    return {
	        type: 'lines3D',
	        name: airlineName,

	        effect: {
	            show: true,
	            trailWidth: 2,
	            trailLength: 0.2,
	            trailOpacity: 0.4,
	            trailColor: 'rgb(30, 30, 60)'
	        },

	        lineStyle: {
	            width: 1,
	            color: 'rgb(50, 50, 150)',
	            // color: 'rgb(118, 233, 241)',
	            opacity: 0.1
	        },
	        blendMode: 'lighter',

	        distanceToGlobe: 4,

	        data: routes.map(function (item) {
	            return [airports[item[1]].coord, airports[item[2]].coord];
	        })
	    };
	}).filter(function (series) {
		if (series) {
			// LOG('s data:');
			// LOG(series.data);
		}
	    return !!series;
	});

	series.push({
	    type: 'scatter3D',
	    coordinateSystem: 'globe',
	    blendMode: 'lighter',
	    symbolSize: 2,
	    distanceToGlobe: 4,
	    itemStyle: {
	        color: 'rgb(50, 50, 150)',
	        opacity: 0.2
	    },
	    data: pointsData
	});

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
	request.getGlobe2().then((data) => {
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
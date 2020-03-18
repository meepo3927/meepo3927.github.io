var URL = require('util/url.js');

const created = function () {
};
const mounted = function () {
    setTimeout(() => {
        this.fetchRender();
    }, 1000);
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    if (this.loopTimer) {
        clearTimeout(this.loopTimer);
        this.loopTimer = null;
    }
};

const loopInterval = 9 * 1000;
let echarts = require('echarts');
let methods = {};
methods.getChartInstance = function () {
    return this.chart || echarts.init(this.$refs.chart, 'bigshow');
};
methods.loopNext = function () {
    this.loopTimer = setTimeout(() => {
        this.fetchRender();
    }, loopInterval)
};
methods.getRequestParam = function () {
    let startDatetime = '2017-05-14';
    let endDatetime = '2017-05-15';
    return [this.pId, startDatetime, endDatetime];
};
let computed = {};
computed.pId = function () {

    return URL.query().id || 7112;
};
computed.chartOption = function () {
    const xyFontSize = 18;
    let xAxisLabel = {
        textStyle: {
            fontSize: xyFontSize
        }
    };
    let yAxisLabel = {
        textStyle: {
            fontSize: xyFontSize
        }
    };
    return {
        xAxis: {
            axisLabel: xAxisLabel
        },
        yAxis: {
            axisLabel: yAxisLabel
        },
        animationDurationUpdate: 1000
    };
};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy
};
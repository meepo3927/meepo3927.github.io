var echarts = require('echarts');
const created = function () {
};
const mounted = function () {
    this.fetchRender();
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

let methods = {};
methods.getChartInstance = function () {
    return this.chart || echarts.init(this.$refs.chart, 'bigshow');
};
methods.loopNext = function () {
    this.loopTimer = setTimeout(() => {
        this.fetchRender();
    }, loopInterval)
};
let computed = {};
computed.chartOption = function () {
    return {
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
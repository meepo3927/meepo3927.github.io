const created = function () {
};
const mounted = function () {
    setTimeout(() => {
        this.fetchRender();
    }, 3000);
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
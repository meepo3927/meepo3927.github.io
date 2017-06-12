var chartUtil = require('util/chart').default;

var methods = {};
methods.close = function () {
    this.$emit('close');
};
methods.reset = function () {
    this.charts = {};
    this.chartRequest = {};
};
methods.refreshCurrent = function () {
    var i = this.active;
    this.chartRequest[i] = null;
    let funcName = 'render_' + i;
    this[funcName] && this[funcName]({
        chart: this.charts[i] || this.charts.c
    });
};
methods.toggle = function (val) {
    if (val === this.active) {
        return;
    }
    this.active = val;
    this.$nextTick(() => {
        var funcName = 'render_' + val;
        if (this[funcName]) {
            this[funcName]();
        }
    });
};
const refreshInterval = 60;
const mounted = function () {
    this.refreshTimer = setInterval(() => {
        this.refreshCurrent();
    }, refreshInterval * 1000);
};
const destroyed = function () {
    clearInterval(this.refreshTimer);
};
var mix = {
    methods,
    mounted,
    destroyed,
    data: function () {
        return {
            active: 0
        };
    }
};

module.exports = mix;
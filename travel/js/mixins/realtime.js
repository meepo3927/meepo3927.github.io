const refreshInterval = 60;

var chartUtil = require('util/chart');

var methods = {};
methods.close = function () {
    this.$emit('close');
};
methods.reset = function () {
    this.chartRequest = {};
};
methods.refreshCurrent = function () {
    var i = this.active;
    this.chartRequest[i] = null;
    let funcName = 'render_' + i;
    this[funcName] && this[funcName]({
        mode: 'refresh'
    });
};
methods.toggle = function (val) {
    if (val === this.active) {
        return;
    }
    this.active = val;
    this.$nextTick(() => {
        var funcName = 'render_' + val;
        this[funcName] && this[funcName]({
        });
    });
};

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
            active: 0,
            o: null
        };
    },
    components: {
        'my-chart': require('comp/common/my-chart.vue')
    }
};

module.exports = mix;
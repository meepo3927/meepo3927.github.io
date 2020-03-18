let chartUtil = require('util/chart');

let mounted = function () {
    if (!this.charts) {
        this.charts = {};
    }
    this.$on('window-resize', this.handleResize);
};
let destroyed = function () {
    this.$off('window-resize', this.handleResize);
    this._chartlayermix_destroyed = true;
};
let activated = function () {
    this._deactivated = false;
    this.$nextTick(function () {
        this.resizeAllCharts();
    });
};
let deactivated = function () {
    this._deactivated = true;
};
let methods = {};

methods.handleResize = function (e) {
    if (this._chartlayermix_destroyed) {
        return false;
    }
    if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
    }
    this.resizeTimer = setTimeout(() => {
        this.resizeAllCharts()
    }, 80);
};
methods.resizeAllCharts = function () {
    if (this._deactivated) {
        return;
    }
    for (var i in this.charts) {
        if (!this.charts.hasOwnProperty(i)) {
            continue;
        }
        if (this.charts[i] && this.charts[i].resize) {
            this.charts[i].resize();
        }
    }
};
methods.disposeCharts = function () {
    if (this._deactivated) {
        return;
    }
    for (var i in this.charts) {
        if (!this.charts.hasOwnProperty(i)) {
            continue;
        }
        if (this.charts[i] && this.charts[i].dispose) {
            this.charts[i].dispose();
            this.charts[i] = null;
            delete this.charts[i];
        }
    }
};
module.exports = {
    methods,
    activated,
    deactivated,
    mounted: mounted,
    destroyed: destroyed,
    mixins: [
        require('mixins/bind_resize.js')
    ],
    components: {
        'pie-chart': require('comp/chart_layer/pie-chart.vue'),
        'horz-bar-chart': require('comp/chart_layer/horz-bar-chart.vue'),
        'my-chart': require('comp/common/my-chart.vue')
    }
};
const created = function () {
    window.addEventListener('resize', this.handleChartResize);
};
const mounted = function () {

};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    window.removeEventListener('resize', this.handleChartResize);
};
let methods = {};
methods.handleChartResize = function () {
    if (this.chart && this.chart.resize) {
        this.chart.resize();
    }
    if (this.charts) {
        for (var i in this.charts) {
            if (!this.charts.hasOwnProperty(i)) {
                continue;
            }
            if (this.charts[i] && this.charts[i].resize) {
                this.charts[i].resize();
            }
        }
    }
};
let computed = {};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {}
};
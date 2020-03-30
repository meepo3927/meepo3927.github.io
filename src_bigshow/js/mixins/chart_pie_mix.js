const created = function () {
};
const mounted = function () {
    this.fetchRender();
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    if (this.loopChartPieTimer) {
        clearTimeout(this.loopChartPieTimer);
        this.loopChartPieTimer = null;
    }
};
const interval = 12 * 1000;
let methods = {};
methods.getRandomInterval = function () {
    let second = parseInt(Math.random() * 12) + 1;
    return second * 1000;
};
methods.loopNext = function () {
    this.loopChartPieTimer = setTimeout(() => {
        this.fetchRender();
    }, this.getRandomInterval());
};
let computed = {};
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
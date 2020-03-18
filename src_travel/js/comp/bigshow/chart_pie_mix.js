var URL = require('util/url.js');

const created = function () {
};
const mounted = function () {
    setTimeout(() => {
        this.fetchRender();
    }, 2000);
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

methods.getRequestParam = function () {
    let startDatetime = '2017-05-15';
    return [this.pId, startDatetime];
};
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
computed.pId = function () {
    return URL.query().id || 7112;
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
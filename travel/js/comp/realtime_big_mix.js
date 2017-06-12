const refreshInterval = 60;

let mounted = function () {
    this.setupRefresh();
};
let destroyed = function () {
    clearInterval(this.refreshTimer);
};
let activated = function () {
    this.setupRefresh();
};
let deactivated = function () {
    this.closeRefresh();
};
let methods = {};
methods.refreshCurrent = function () {
    var i = this.active;
    let funcName = 'render' + i;
    this[funcName] && this[funcName]({
        chart: this.charts.c
    });
};
methods.setupRefresh = function () {
    this.closeRefresh();
    this.refreshTimer = setInterval(() => {
        this.refreshCurrent();
    }, refreshInterval * 1000);
};
methods.closeRefresh = function () {
    if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
    }
};
methods.render = function (a) {
    if (a === this.active) {
        return;
    }
    this.active = a;
    var m = 'render' + a;
    this[m] && this.$nextTick(this[m]);
};
let computed = {};
computed.id = function () {
    return this.area ? this.area.id : 0;
};
computed.areaName = function () {
    if (this.area) {
        return this.area[this.area.level];
    }
    return '';
};
computed.title = function () {
    return this.areaName + '实时客流量';
};
module.exports = {
    props: ['area'],
    data: function () {
        var o = {
            active: 0
        };
        return o;
    },
    methods,
    computed,
    activated,
    deactivated,
    mounted: mounted,
    destroyed: destroyed
};
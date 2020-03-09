const refreshInterval = 60;

let mounted = function () {
    this.setupRefresh();
};
let beforeDestroy = function () {
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
        mode: 'refresh'
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
computed.isTitleTooLong = function () {
    return (this.title.length > 20);
};
computed.titleClassName = function () {
    return (this.isTitleTooLong ? 'line-break' : '');
};
computed.layerWidth = function () {
    return '85%';
};
computed.layerHeight = function () {
    return '85%';
};
module.exports = {
    props: ['area'],
    data: function () {
        var o = {
            active: 0,
            o: null
        };
        return o;
    },
    methods,
    computed,
    activated,
    mixins: [
        require('mixins/with_cover.js'),
        require('mixins/chart_layer.js'),
        require('comp/chart_layer/window_mix.js')
    ],
    deactivated,
    mounted: mounted,
    beforeDestroy
};
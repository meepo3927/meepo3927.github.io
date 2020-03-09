let navbarStore = require('store/rightbar.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    this.disposeCharts();
};
let methods = {};
methods.switchHome = function (v) {
    if (this.home === v) {
        return;
    }
    this.home = v;
    this.$emit('switch-home');
};
methods.getCycleSubtext = function () {
    if (!this.$refs.datepicker) {
        return this.subtext;
    }
    let p = this.$refs.datepicker.getStartEnd();
    return this.areaName + ' ' + p.start_date + '至' + p.end_date;
};
let computed = {};
computed.subtext = function () {
    let dateStr = ' ';
    if (this.startDatetime) {
        dateStr += this.startDatetime;
        if (this.endDatetime) {
            dateStr += '至' + this.endDatetime;
        }
    }
    return this.areaName + dateStr;
};
computed.id = function () {
    return navbarStore.getters.areaId;
};
computed.areaName = function () {
    return navbarStore.getters.areaName;
};
computed.isCity = function () {
    return true;
};
computed.isEnterCity = function () {
    return true;
};
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
    mixins: [
        require('mixins/analysis_part.js')
    ],
    components: {}
};
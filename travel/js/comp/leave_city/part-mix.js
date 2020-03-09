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
methods.getCycleSubtext = function () {
    if (!this.$refs.datepicker) {
        return this.subtext;
    }
    let p = this.$refs.datepicker.getStartEnd();
    return this.areaName + ' ' + p.start_date + '至' + p.end_date;
};
let computed = {};
computed.isCity = function () {
    return true;
};
computed.isLeaveCity = function () {
    return true;
};
computed.areaName = function () {
    let o = this.area || {};
    return o.name;
};
computed.subtext = function () {
    let dateStr = ' ';
    if (this.startEndDate) {
        dateStr += this.startEndDate.start_date + '至' + this.startEndDate.end_date;
    } else if (this.startDatetime) {
        dateStr += this.startDatetime;
        if (this.endDatetime) {
            dateStr += '至' + this.endDatetime;
        }
    }
    return this.areaName + dateStr;
};
let watch = {};
watch.id = function () {
    this.fetchRender();
};
module.exports = {
    props: ['area'],
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
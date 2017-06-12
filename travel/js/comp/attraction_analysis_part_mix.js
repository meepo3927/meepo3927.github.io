var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;

let mounted = function () {
};
let destroyed = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
methods.onStartDateInput = function (val) {
    this.startDatetime = val;
    this.$emit('onDateChange');
};
methods.onEndDateInput = function (val) {
    this.endDatetime = val;
    this.$emit('onDateChange');
};
methods.getRequestParam = function () {
    return [this.id, this.startDatetime, this.endDatetime];
};
let computed = {};
computed.areaName = function () {
    if (this.area) {
        return this.area.city + this.area.attraction;
    }
    return '';
};
computed.id = function () {
    return this.area ? this.area.id : 0;
};
computed.subtitle = function () {
    let p = this.getRequestParam();
    let start = p[1];
    let end = p[2];
    let t = this.areaName + ' ' + start;
    if (end) {
        t += '至' + end;
    }
    return t;
};
module.exports = {
    props: ['area'],
    data: function () {
        var date = new Date();
        var endDate = DateUtil.getDateOffset(date, -1);
        var startDate = DateUtil.getDateOffset(endDate, -7);
        var o = {
            startDatetime:  DateUtil.getYMD(startDate),
            endDatetime: DateUtil.getYMD(endDate)
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
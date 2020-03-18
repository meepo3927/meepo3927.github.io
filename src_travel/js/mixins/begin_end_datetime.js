var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;

let mounted = function () {
};
let beforeDestroy = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let watch = {};
watch.startDatetime = function () {
    this.$emit('onDateChange', this.startDatetime, this.endDatetime);
};
watch.endDatetime = function () {
    this.$emit('onDateChange', this.startDatetime, this.endDatetime);
};
let methods = {};
let computed = {};
module.exports = {
    props: [],
    data: function () {
        var date = new Date();
        let beginOffset = -8;
        if (this.getBeginDateOffset) {
            beginOffset = this.getBeginDateOffset();
        }
        let endOffset = -1;
        if (this.getEndDateOffset) {
            endOffset = this.getEndDateOffset();
        }
        var endDate = DateUtil.getDateOffset(date, endOffset);
        var startDate = DateUtil.getDateOffset(date, beginOffset);
        var o = {
            startDatetime:  DateUtil.getYMD(startDate),
            endDatetime: DateUtil.getYMD(endDate)
        };
        return o;
    },
    watch,
    methods,
    computed,
    activated,
    deactivated,
    mounted: mounted,
    beforeDestroy
};
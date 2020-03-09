var MDate = require('lib/mdate.js');
var DateUtil = MDate.Util;
var config = require('global/config');

let mounted = function () {
};
let beforeDestroy = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
methods.getPreviousDate = function (dateStr) {
    return DateUtil.getDateOffsetStr(dateStr, -1);
};
methods.autoTryWrapper = function (func, onFinalError) {
    onFinalError = onFinalError || function () {};
    var defaultDate = DateUtil.getDateOffsetStr(new Date, -1);
    func().catch((e) => {
        if (this.startDatetime === defaultDate) { // 默认日期才执行
            this.startDatetime = this.getPreviousDate(defaultDate);
            func().catch((e) => {
                onFinalError(e);
            });
        } else {
            onFinalError(e);
        }
    });
};
methods.autoTryWrapper2 = function (func, onFinalError) {
    onFinalError = onFinalError || function () {};
    var defaultDate = DateUtil.getDateOffsetStr(new Date, -1);
    let $refs = this.$refs;
    func().catch((e) => {
         // 默认日期才执行
        if (this.startEndDate && (this.startEndDate.end_date === defaultDate)) {
            let previousDate = this.getPreviousDate(defaultDate);
            this.dateChangeDisabled = true;
            if ($refs.datePicker2) {
                $refs.datePicker2.setDate(previousDate);
            }
            this.$nextTick(() => {
                func().catch((e) => {
                    onFinalError(e);
                });
                this.dateChangeDisabled = false;
            });
        } else {
            onFinalError(e);
        }
    });
};
methods.autoTryWrapper3 = function (func, onFinalError) {
    onFinalError = onFinalError || function () {};
    var defaultDate = DateUtil.getDateOffsetStr(new Date, -1);
    let $refs = this.$refs;
    func().catch((e) => {
        let dateParam = $refs.datePicker2.getParam();
        // 日期比对
        if (dateParam.deal_date === defaultDate) {
            this.dateChangeDisabled = true;
            this.$refs.datePicker2.setPreviousDate();
            this.$nextTick(() => {
                func().catch((e) => {
                    onFinalError(e);
                });
                this.dateChangeDisabled = false;
            });
        } else {
            onFinalError(e);
        }
    });
};
methods.onStartDateInput = function (val) {
    this.startDatetime = val;
    this.$emit('onDateChange');
};
methods.onEndDateInput = function (val) {
    this.endDatetime = val;
    this.$emit('onDateChange');
};
methods.getRequestParam = function () {
    return [
        this.id,
        this.startDatetime,
        this.endDatetime,
        config.user.id
    ];
};
methods.callTypeRender = function () {
    var m = 'render' + this.type;
    if (this[m]) {
        this.$nextTick(this[m]);
    }
};

let computed = {};
computed.areaName = function () {
    if (this.area) {
        if (this.isCity) {
            return this.area.city;
        }
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
computed.isCity = function () {
    if (this.area) {
        return (this.area.level === 'city');
    }
    return false;
};
computed.isAttraction = function () {
    if (this.area) {
        return (this.area.level === 'attraction');
    }
    return false;
};
module.exports = {
    props: ['area'],
    data: function () {
        var date = new Date();
        var endDate = DateUtil.getDateOffset(date, -1);
        var startDate = DateUtil.getDateOffset(endDate, -7);
        var o = {
            view: {
                loading: false
            },
            o: null,
            startDatetime:  DateUtil.getYMD(startDate),
            endDatetime: DateUtil.getYMD(endDate)
        };
        return o;
    },
    methods,
    computed,
    mixins: [
        require('mixins/chart_layer.js')
    ],
    activated,
    deactivated,
    mounted: mounted,
    beforeDestroy,
    components: {
        'datepicker-2': require('comp/chart_layer/date-picker-2.vue')
    }
};
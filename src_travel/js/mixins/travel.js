let config = require('global/config.js');
let MDate = require('lib/mdate.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getGisTravelUrl = function () {
    return config.gisUrlBase + '/travel/travelFlow.jsp?cityId=' + this.id;
};
methods.getGisHotelUrl = function () {
    return config.gisUrlBase + '/travel/hotelAnalysis.jsp?cityId=' + this.id;
};
methods.checkDatetimeLength = function (startDatetime, endDatetime, days) {
    let d1 = MDate.Util.parseDate(startDatetime);
    let d2 = MDate.Util.parseDate(endDatetime);
    let diffDay = (d2.getTime() - d1.getTime()) / (24 * 3600 * 1000);
    if (days > diffDay) {
        return [
            '查询' + days + '日游数据，需将开始和结束日期间隔设置为',
            days + '天以上'
        ].join('');
    }
    return true;
};
let computed = {};
computed.travelPeriodOptions = function () {
    return [
        {name: '全部', value: 0},
        {name: '1日游', value: 1},
        {name: '2日游', value: 2},
        {name: '3日游', value: 3},
        {name: '4日游', value: 4},
        {name: '5日游', value: 5},
        {name: '6日游', value: 6},
        {name: '7日游', value: 7}
    ];
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            gisUrl: 'about:blank'
        };
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
    components: {
        'travel-table': require('comp/travel-table.vue')
    }
};
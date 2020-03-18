const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};

// const barTitleTop10 = ' TOP10';
// const barTitleTop5 = ' TOP5'
const barTitleTop10 = '';
const barTitleTop5 = ''


let barNameMap = {
    0: '人数',
    1: '流量'
};

let methods = {};
methods.getTitle = function (v) {
    let o ={
        text:v.title,
        subtext:this.getBarSubTitle()
    };
    return o;
};
methods.getBarName = function (i) {
    return barNameMap[this.sumType];
};
methods.getBarTitle = function (i) {
    let barTitlePrefix = '景区游客';
    if (this.netPreferBarTitlePrefix !== undefined) {
        barTitlePrefix = this.netPreferBarTitlePrefix;
    }
    let barTitleMap = {
        0: [
            barTitlePrefix + '热门网站' + barTitleTop10,
            barTitlePrefix + '热门APP' + barTitleTop10,
            barTitlePrefix + '热门旅游类APP' + barTitleTop10,
            barTitlePrefix + '热门网购APP' + barTitleTop10,
            barTitlePrefix + '热门支付偏好' + barTitleTop10,
            barTitlePrefix + '热门美食团购APP' + barTitleTop5,
            barTitlePrefix + '热门打车APP' + barTitleTop5,
            barTitlePrefix + '热门地图导航APP' + barTitleTop5,
            barTitlePrefix + '热门手机阅读APP' + barTitleTop10,
            barTitlePrefix + '热门手机音乐APP' + barTitleTop10,
            barTitlePrefix + '热门手机视频APP' + barTitleTop10,
            barTitlePrefix + '热门手机游戏APP' + barTitleTop10
        ]
    };
    barTitleMap[1] = barTitleMap[0].slice();
    barTitleMap[2] = barTitleMap[0].slice();
    barTitleMap[3] = barTitleMap[0].slice();
    let o = {
        text: (barTitleMap[this.userType] || [])[i],
        subtext: this.getBarSubTitle()
    };
    return o;
};
methods.getBarSubTitle = function () {
    var dateStr = '';
    if (this.startEndDate.start_date) {
        dateStr += this.startEndDate.start_date;
    }
    if (this.startEndDate.end_date) {
        dateStr += '至' + this.startEndDate.end_date;
    }
    return [
        this.areaName,
        dateStr
    ].join(' ');
};

methods.getNetPreferRequestParam = function () {
    let p = {
        start_date: this.startEndDate.start_date,
        end_date: this.startEndDate.end_date,
        user_id: this.vConfig.user.id,
        sumType: this.sumType,
        userType: this.getUserTypeParam()
    };
    if (this.isAttraction) {
        p.scenery_id = this.id;
    } else if (this.isCity) {
        p.scenery_city = this.id;
    }
    p.dim = this.getDimParam();
    return p;
};
methods.getWordCloudRequestParam = function () {
    let p = {
        start_date: this.startEndDate.start_date,
        end_date: this.startEndDate.end_date,
        user_id: this.vConfig.user.id,
        userType: this.getUserTypeParam()
    };
    if (this.isAttraction) {
        p.scenery_id = this.id;
    } else if (this.isCity) {
        p.scenery_city = this.id;
    }
    p.dim = this.getDimParam();
    return p;
};
methods.fetchRenderWordCloud = function () {
    this.wordCloudData = null;
    let p2 = this.getWordCloudRequestParam();
    return Request.wordCloud(p2).then((data) => {
        this.wordCloudData = data;
    }).catch((e) => {
        this.wordCloudData = [];
    });
};
let computed = {};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            sumType: '0',
            startEndDate: {
                start_date: '',
                end_date: ''
            },
            barListData: null,
            wordCloudData: null
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
    components: {}
};
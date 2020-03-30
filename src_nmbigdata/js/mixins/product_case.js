const config = require('global/config.js');
const URL = require('util/url.js');

const getTravelUrl = (path, param = '') => {
    let paramStr = '';
    if (param) {
        if (typeof param === 'object') {
            paramStr = '?' + URL.buildQuery(param)
        } else {
            paramStr = '?' + param;
        }
    }
    
    return config.travelUrlBase + path + paramStr;
};
const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getProductImg = function (item) {
    return this.getImageUrl('/product/' + item.img);
};
methods.getProductVideoPoster = function (proName) {
    let item = this.productNameMap[proName];
    if (item) {
        return this.getProductImg(item);
    }
};
methods.getProductVideoSrc = function (proName) {
    let item = this.productNameMap[proName];
    if (item && item.videoUrl) {
        return './videos/' + item.videoUrl;
    }
};

let computed = {};
computed.productNameMap = function () {
    let map = {};
    this.products.forEach((v) => {
        map[v.id] = map[v.name] = v;
    });
    return map;
};
computed.products = function () {
    return [
        {
            id: 'monitor',
            name: '鹰眼',
            img: 'monitor.jpg',
            videoUrl: 'monitor.mp4',
            needlogin: true,
            url: getTravelUrl('/login', {tourl: config.travelUrlBase + '/bigdata/monitor' }),
            desc: '人流监控平台，实时监控特定区域人口密度，分析人流趋势、人群特征，助力公共安全监控、区域人口管理等'
        },
        {
            id: 'travel',
            name: '远方',
            img: 'travel.jpg',
            videoUrl: 'travel.mp4',
            needlogin: true,
            url: getTravelUrl('/login'),
            desc: '旅游大数据平台，对内蒙古自治区360余核心旅游景点进行实时客流量监控与超量预警'
        },
        {
            id: 'publico',
            name: '风云',
            img: 'publico.jpg',
            videoUrl: 'publico.mp4',
            needlogin: true,
            url: getTravelUrl('/login', {tourl: config.travelUrlBase + '/bigdata/publico' }),
            desc: '舆情实时监控，对特定区域内人群进行实时舆情分析，包括热力图分布、热门搜索排行、实时搜索关键词等'
        },
        {
            id: 'civil',
            name: '征途',
            img: 'civil.jpg',
            videoUrl: 'civil.mp4',
            needlogin: true,
            url: getTravelUrl('/civilaviation/login'),
            desc: '民航大数据平台，提供航空客流量实时监控，客流来源分析，飞行路径、航班中转路径分析以及旅客区域定位等'
        },
        {
            id: 'dangjian',
            name: '党建',
            img: 'dangjian.jpg',
            videoUrl: 'monitor.mp4',
            desc: '党员大数据平台，对辖区内党员进行实时区域分布分析、外出情况分析、舆情监控与互联网偏好分析'
        },
        {
            id: 'tianwang',
            name: '天网',
            img: 'tianwang.jpg',
            videoUrl: 'travel.mp4',
            //url: 'abc',
            desc: '流动人口大数据平台，提供流动人口监控与登记情况分析，流动人口来源、驻留时长等分析'
        },
        {
            id: 'zhengxin',
            name: '征信',
            img: 'zhengxin.jpg',
            videoUrl: 'report.mp4',
            desc: '个人金融征信业务服务平台  借款人向金融机构提交借贷申请，并授权进行信用验真查询'
        },
        {
            id: 'netlog',
            name: '解码',
            img: 'netlog.png',
            videoUrl: 'publico.mp4',
            desc: '移动用户上网日志进行实时解析与分析，借助大数据流处理技术满足对海量日志的解析率与实时性要求'
        },
        {
            id: 'report',
            name: '速析',
            img: 'report.jpg',
            videoUrl: 'report.mp4',
            needlogin: true,
            url: getTravelUrl('/login', {tourl: config.travelUrlBase + '/Static_Full_Version/2.0/views/report' }),
            desc: '分析报告自动生成 ，只需要选择分析开始时间、结束时间，选择单个景区或者多个景区，即可自动生成分析报告'
        }
    ];
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
    mixins: [],
    components: {}
};
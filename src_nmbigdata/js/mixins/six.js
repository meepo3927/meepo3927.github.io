const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getSixUrl = function (i) {
    return this.getPageUrl('/six', '#nav-' + i);
};
methods.getSixImg = function (i) {
    let name = this.sixName[i];
    return this.getImageUrl('/index/six_' + name + '.png');
};
methods.getSixImgClass = function (i) {
    let name = this.sixName[i];
    return 'img-' + name;
};
let computed = {};
computed.sixName = function () {
    return [
        'monitor', 'portray', 'credit',
        'locate', 'ad', 'publico'
    ]
};
computed.sixTitle = function () {
    return [
        '人流监控', '客户画像', '信用评估',
        '店面选址', '广告投放', '舆情监控'
    ]
};
computed.sixSubTitle = function () {
    return [
        '客户聚集流动规律', '数据洞察客户特征', '客户信用特征评估',
        '客流特征辅助选址', '广告投放价值评估', '数据监控舆情动态'
    ];
};
computed.sixDesc = function () {
    return [
        this.sixWholeDesc[0],
        this.sixWholeDesc[1],
        this.sixWholeDesc[2].substr(0, 95) + '...',
        this.sixWholeDesc[3].substr(0, 96) + '...',
        this.sixWholeDesc[4].substr(0, 94) + '...',
        this.sixWholeDesc[5].substr(0, 95) + '...'
    ];
};

computed.sixWholeDesc = function () {
    return [
        '针对旅游景区、广场、会展中心、公园等指定区域内的人口分布，通过数据可视化展示，结合数据报表，反映人口的分布，实时监控人口密度，助力区域人口管理、公共安全监控、商业选址等。',
        '为各行业提供基于大数据的客户特征洞察与客户细分。通过整合传统电信数据和行业相关数据，挖掘用户身份特征、消费价值特征、社交行为特征、地理位置特征等，构建行业客户细分群。',
        '基于大数据设计个人信用评估模型，直观体现个人信用风险，帮助企业进行客户信用精细化管理，降低企业风险。同时，除了对个人信用的总体评价之外，还可以建立分量指标，对客户收入、消费、出行、社交活跃、资讯、金融、购物等方面的信用特征进行评估。',
        '针对传统选址周期长、成本高，选址缺乏目的性，选址效果难保证等痛点，整合内蒙位置数据、用户属性和偏好数据、公开的POI数据区域商业数据，以匿名和聚合的方式为商家提供低成本、灵活、高效、精确的门店选址决策服务，改善经营效能，提升门店竞争力。',
        '基于位置信令数据、GIS信息、地理信息以及无线工参等信息，通过大数据技术计算广告位下的受众范围、受众人群，并分析受众的行为特征，评估广告投放价值，包括广告投放受众价值评估、广告位价值评估、广告内容价值评估等。',
        '通过整合用户上网行为数据、位置信令数据等，通过大数据平台文本挖掘技术进行互联网舆情监控，包括特定区域、特定人群舆情监控，可快速、准确、灵活的监测互联网上的舆论信息，为相关管理部门全面掌握互联网舆情动态，做出正确舆论引导，提供分析依据。'
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
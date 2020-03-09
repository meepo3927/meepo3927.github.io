const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};

let pieNameMap = {
    0: [
        '性别构成', '年龄构成', 'ARPU分档', '职业构成',
        '信用评估', '出行方式', '终端品牌'
    ]
};
pieNameMap[1] = pieNameMap[0].slice();
pieNameMap[2] = [
    pieNameMap[0][5],
    pieNameMap[0][6]
];
pieNameMap[3] = pieNameMap[2].slice();

let pieTitleMap = {
    0: [
        '游客性别构成分析',
        '游客年龄构成分析',
        '游客ARPU分档占比',
        '游客职业构成分析',
        '游客信用评估分析',
        '游客出行方式占比',
        '游客终端品牌占比'
    ]
};
pieTitleMap[1] = pieTitleMap[0].slice();
pieTitleMap[2] = [
    pieTitleMap[0][5],
    pieTitleMap[0][6]
];
pieTitleMap[3] = pieTitleMap[2].slice();


let methods = {};

methods.getPieName = function (i) {
    return (pieNameMap[this.userType] || [])[i];
};

methods.getPieTitle = function (i) {
    let a = (pieTitleMap[this.userType] || []);
    let text = (this.userLevPieTitlePrefix || '') + (a[i] || '')
    let subtext = (this.userLevPieSubTitle === undefined)
        ? this.subtitle
        : this.userLevPieSubTitle;
    let o = {
        text,
        subtext
    };
    return o;
};
methods.getUserLevRequestParam = function () {
    let p = {
        user_id: this.vConfig.user.id,
        deal_date: this.startDatetime,
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
let computed = {};
computed.userLevPieTitlePrefix = function () {
    return '当日景区';
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            pieListData: null
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
    mixins: [
        require('./the_common_mix.js')
    ],
    components: {}
};
let Promise = require('lib/promise.js');
let EchartUtil = require('util/echart.js');
let chartUtil = require('util/chart.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
const onClick = function (e) {
    let chart = this;
    let option = chart.getOption();
    if (e.seriesType === 'pie') {
        let name = ' ' + e.name;
        let legend = option.legend[1] || {};
        let legendData = legend.data || [];
        if (name === chart.selectedName) {
            legendData.forEach((v) => {
                chart.dispatchAction({
                    type: 'legendSelect',
                    name: v
                });
            });
            chart.selectedName = '';
            return;
        }
        // 取消其他
        legendData.forEach((v) => {
            if (v === name) {
                return;
            }
            chart.dispatchAction({
                type: 'legendUnSelect',
                name: v
            });
        });
        
        // 选中
        chart.dispatchAction({
            type: 'legendSelect',
            name: name
        });
        chart.selectedName = name;
    }
};

let methods = {};
methods.renderGPRS = function ({pieRequest, barRequest}) {
    this.o1 = null;
    let tPrefix = (this.gprsTitlePrefix === undefined) ? '景区': this.gprsTitlePrefix;
    let title = {
        text: tPrefix + '当日游客手机上网流量分析',
        subtext: this.subtitle
    };
    return Promise.all([pieRequest, barRequest]).then(([r1, r2]) => {
        this.o1 = chartUtil.vwRptNmComeGPRSLevDailyPie({
            title: title
        }, {
            pieData: r1,
            barData: r2,
            name: '流量使用量分布'
        });
        // 点击 切换柱图legend
        this.$refs.c1.on('click', onClick);
    }).catch((e = {}) => {
        this.o1 = 'empty';
        return Promise.reject(e);
    });
};
methods.renderGSM = function ({pieRequest, barRequest}) {
    this.o2 = null;
    let tPrefix = (this.gprsTitlePrefix === undefined) ? '景区': this.gprsTitlePrefix;
    let title = {
        text: tPrefix + '当日游客手机语音通话分析',
        subtext: this.subtitle
    };
    return Promise.all([pieRequest, barRequest]).then(([r1, r2]) => {
        this.o2 = chartUtil.vwRptNmComeGPRSLevDailyPie({
            title
        }, {
            pieData: r1,
            barData: r2,
            name: '语音通话时长分布'
        });
        // 点击 切换柱图legend
        this.$refs.c2.on('click', onClick);
    }).catch((e = {}) => {
        this.o2 = 'empty';
        return Promise.reject(e);
    });
};
let computed = {};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            o1: null,
            o2: null
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
let request = require('util/request.js');
let tool = require('util/tool.js');
let Promise = require('Promise');
let EChartUtil = require('util/echart.js');
let html2canvas = require('html2canvas');

const created = function () {
};
const mounted = function () {
    this.$parent.$on('search', () => {
        this.fetchRender && this.fetchRender();
    });
    if (this.condition && this.fetchRender) {
        this.fetchRender();
    }
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.slideSubmitOver = function () {
    this.$store.commit('submitCountPlus');
};
methods.removeMe = function () {
    if (!confirm('确定暂时屏蔽该页内容吗？')) {
        return;
    }
    this.$emit('remove-slide', this.index);
};
methods.getLabelFontSize = function (len) {
    if (len < 8) {
        return 12;
    } else if (len < 14) {
        return 10;
    } else {
        return 8;
    }
};
methods.getSlideImage = function () {
    let elem = this.$el;
    let config = this.vConfig;
    return new Promise((resolve, reject) => {
        let o = {
            background: '#FFF',
            // dpi: 192,
            scale: 1,
            allowTaint: true,
            logging: false
        };
        html2canvas(elem, o).then((canvas) => {
            let url = canvas.toDataURL('image/jpeg', 1.0);
            resolve(url);
        }).catch((e) => {
            reject(e);
        });
    });
};
methods.lineGrid = function () {
    return {
        left: 15, right: 40,
        bottom: 15,
        containLabel: true
    };
};
methods.barGrid = function () {
    return {
        left: 15, right: 25,
        bottom: 15,
        containLabel: true
    };
};
methods.barGrid2 = function () {
    return {
        left: 20,
        right: 30,
        bottom: 15,
        containLabel: true
    };
};
methods.barGrid3 = function () {
    return {
        left: 22,
        right: 40,
        bottom: 15,
        containLabel: true
    };
};
methods.commonRequest = function (url, o = {}, m) {
    let p = tool.extend({
        start_date: this.condition.start_date,
        end_date: this.condition.end_date,
        scenery_ids: this.condition.scenery_ids
    }, o);

    if (url.charAt(0) === '/') {
        return request.r1(url, p, m);
    }
    return request.r1('/ana/' + url, p, m);
};
methods.commonRequest2 = function (url, o = {}, m) {
    let p = tool.extend({
        start_date: this.condition.start_date,
        end_date: this.condition.end_date,
        scenery_ids: this.condition.scenery_ids
    }, o);

    if (url.charAt(0) === '/') {
        return request.getActionJSON(url, p, m);
    }
    return request.getActionJSON('/ana/' + url, p, m);
};
methods.commonRequest3 = function (url, o = {}, m) {
    let p = tool.extend({
        start_date: this.condition.start_date,
        end_date: this.condition.end_date,
        scenery_ids: this.condition.scenery_ids
    }, o);

    if (url.charAt(0) === '/') {
        return request.getActionJSON(url, p, m);
    }
    return request.getActionJSON('/ana/' + url, p, m);
};
methods.getDefaultOption = function (o) {
    let title = {
        top: 15,
        left: 'center',
        textStyle: {
            fontFamily: '微软雅黑',
            fontWeight: 'bold',
            fontSize: 16
        }
    };
    let defaults = {
        title,
        toolbox: false,
        backgroundColor: '#FFFFFF'
    };
    if (o.title && o.title.length) {
        defaults.title = [title];
    }
    return tool.extend(defaults, o);
};
methods.getCommonLegend = function (o) {
    return tool.extend({
        left: 'center',
        bottom: 10
    }, o);
};
methods.getBarSeries = function (o) {
    return tool.extend({
        type: 'bar',
        barMaxWidth: 60,
        barMinHeight: 1,
        label: {
            normal: {
                show: true
            }
        }
    }, o);
};
// 显示数字
methods.getBarSeries1 = function (o) {
    return tool.extend({
        type: 'bar',
        barMaxWidth: 60,
        label: {
            normal: {
                position: 'top',
                show: true
            }
        }
    }, o);
};
// 不显示数字
methods.getBarSeries2 = function (o) {
    return tool.extend({
        type: 'bar',
        barMaxWidth: 60,
        barMinHeight: 1,
        label: {
            normal: {
                show: false
            }
        }
    }, o);
};
methods.getLineSeries = function (o) {
    return tool.extend({
        type: 'line',
        name: '人数'
    }, o);
};
methods.getPieTooltip = function (o) {
    return tool.extend({
        trigger: 'item'
    }, o);
};
methods.getBarTooltip = function (o) {
    return tool.extend({
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    });
};
const calPercent = (x, t) => {
    return Math.round((x * 100 * 10) / t) / 10;
};
const getPercentMap = (data) => {
    // 计算总和
    let totalArray = [];
    for (let name in data.dataMap) {
        if (!data.dataMap.hasOwnProperty(name)) {
            continue;
        }
        let arr = data.dataMap[name];
        arr.forEach((value, k) => {
            if (!totalArray[k]) {
                totalArray[k] = 0;
            }
            totalArray[k] += value;
        });
    }

    // 计算占比
    let p = {};
    for (let name in data.dataMap) {
        let arr = data.dataMap[name];
        let rr = [];
        arr.forEach((value, k) => {
            rr[k] = calPercent(value, totalArray[k]);
        });
        p[name] = rr;
    }
    return p;
};
const HIDE_BAR_PERCENT = 10;
// 驻留时长、驻留天数、出行方式
methods.getBarCommonOption = function (data, c = {}) {
    let series = [];
    let percentMap = getPercentMap(data);
    let label = {
        normal: {
            show: true,
            formatter: (p) => {
                let name = p.seriesName;
                let x = p.seriesIndex;
                let y = p.dataIndex;
                if (p.value < HIDE_BAR_PERCENT) {
                    return '';
                }
                return data.dataMap[name][y];
            }
        }
    };
    data.legend.forEach((name) => {
        series.push(this.getBarSeries2({
            name,
            data: percentMap[name] || [],
            stack: 'main',
            label
        }));
    });
    return this.getDefaultOption({
        title: {text: c.title},
        tooltip: this.getBarTooltip(),
        legend: this.getCommonLegend({
            data: data.legend
        }),
        grid: {
            left: 25,
            right: 35,
            containLabel: true
        },
        xAxis: this.get100PercentYAxis(),
        yAxis: {
            type: 'category',
            axisTick: {show: false},
            axisLabel: {interval: 0},
            data: data.names
        },
        series
    });
};
// 性别，年龄，职业，消费，信用度等
methods.getBarOption1 = function (data, c = {}) {
    let series = [];
    let percentMap = getPercentMap(data);
    let label = {
        normal: {
            show: true,
            formatter: (p) => {
                let name = p.seriesName;
                let x = p.seriesIndex;
                let y = p.dataIndex;
                if (p.value < 8) {
                    return '';
                }
                return data.dataMap[name][y];
            },
            textStyle: {
                fontSize: this.getLabelFontSize(data.names.length)
            }
        }
    };
    data.legend.forEach((name) => {
        series.push(this.getBarSeries2({
            name,
            data: percentMap[name] || [],
            stack: 'main',
            label
        }));
    });
    let chartWidth = c.chartWidth;
    if (chartWidth === undefined && this.$refs.c2) {
        chartWidth = this.$refs.c2.getWidth();
    }
    let axisParam = EChartUtil.calAxisRotateParam(data.names, {
        chartWidth
    });
    return this.getDefaultOption({
        title: {text: c.title},
        grid: {
            top: 80,
            bottom: 75 + axisParam.pad
        },
        tooltip: this.getBarTooltip(),
        xAxis: EChartUtil.getBarCategoryAxis({
            data: data.names,
            axisLabel: axisParam.label
        }),
        legend: this.getCommonLegend({
            data: data.legend
        }),
        yAxis: this.get100PercentYAxis(),
        series
    });
};
methods.getPieSeries = function (o) {
    return tool.extend(EChartUtil.getPieSeries({
        label: EChartUtil.getPieSeriesLabel()
    }), o);
};
methods.getDataPercent = function (data) {
    let list = tool.extend([], data);
    let total = 0;
    list.forEach((v) => {
        total += v.value;
    });
    list.forEach((v) => {
        v.percent = tool.getPercent(v.value, total);
    });
    return list.sort((a, b) => {
        return (b.value - a.value);
    });
};
methods.show = function () {
    this.$el.style.display = 'block';
};
methods.hide = function () {
    this.$el.style.display = 'none';
};
methods.valueSortFunc = function (a, b) {
    return (b.value - a.value);
};
methods.valueSortFuncDec = function (a, b) {
    return (a.value - b.value);
};
methods.get100PercentYAxis = function () {
    return {
        type: 'value',
        show: true,
        name: '%',
        max: 100
    }
};
methods.parseMaxTipFromDataMap = function (data2, option = {}) {
    let a = [];
    if (!data2) {
        return a;
    }
    let maxItemCount = option.maxItemCount || 4;
    data2.names.forEach((name, index) => {
        if (a.length >= maxItemCount) {
            return;
        }
        let maxVal = -Infinity;
        let maxKey = '';
        let total = 0;
        tool.eacho(data2.dataMap, (val, key) => {
            // 没数
            if (!val[index]) {
                return;
            }
            total += val[index];
            if (maxVal < val[index]) {
                maxVal = val[index];
                maxKey = key;
            }
        });
        name = this.shortName(name);
        let percent = tool.getPercent(maxVal, total);
        if (!maxKey) {
            return;
        }
        a.push({maxVal, maxKey, name, percent});
    });
    return a;
};
methods.shortName = function (name) {
    if (name && name.indexOf && name.indexOf('/') >= 0) {
        return name.split('/')[0];
    }
    return name;
};
methods.combineString = function (...args) {
    let a = [];
    for (let i = 0; i < args.length; i++) {
        if (args[i]) {
            a.push(args[i]);
        }
    }
    return a.join('；') + '。';
};
methods.fetchIndex = function (index, url) {
    let oKey = 'o' + index;
    let dataKey = 'data' + index;
    let funcKey = 'getOption' + index;
    this[oKey] = null;
    this[dataKey] = null;
    return this.commonRequest(url).then((r) => {
        this[oKey] = this[funcKey](r);
        this[dataKey] = r;
        return r;
    }).catch((e) => {
        this[oKey] = 'empty';
        LOG('fetchIndex error:', e);
        return Promise.resolve(e);
    });
};
methods.getSortPercentData = function (data) {
    if (!data) {
        return null;
    }
    let copy = tool.copy(data).sort(this.valueSortFunc);
    if (!copy.length) {
        return null;
    }
    return tool.calPercent(copy);
};
methods.getLineMarkPoint = function (data) {
    let o = EChartUtil.getMinMaxMarkPoint();
    o.symbolSize = 60;
    o.label = {
        normal: {
            textStyle: {
                fontSize: 10
            }
        }
    };
    return o;
};
let computed = {};
computed.condition = function () {
    return this.$store.state.condition;
};
computed.mCondition = function () {
    return this.$store.getters.mCondition;
};
computed.indexClassName = function () {
    if (this.index === undefined) {
        return '';
    }
    return 'slide-index-' + this.index;
};
computed.combinedTip1 = function () {
    let a = [];
    if (this.tip1_1) {
        a.push(this.tip1_1);
    }
    if (this.tip1_2) {
        a.push(this.tip1_2);
    }
    if (!a.length) {
        return '';
    }
    return a.join('；') + '。'
};
let watch = {};
module.exports = {
    props: ['index'],
    data: function () {
        var o = {
            o1: null,
            o2: null,
            o3: null,
            o4: null,
            data1: null,
            data2: null,
            data3: null,
            data4: null
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
        require('mixins/pptx.js')
    ],
    components: {
        'my-chart': require('comp/reporto/my-chart.vue')
    }
};
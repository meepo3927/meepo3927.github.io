let EChartUtil = require('util/echart.js');
let tool = require('util/tool.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};

const formatter = (p) => {
    return [
        EChartUtil.getTooltipDotHtml(p.color),
        p.name + '点：占比' + p.data[2] + '%'
    ].join('');
};
// 修正小数点
const fixFloatNum = (num) => {
    return parseFloat((num * 1).toFixed(2));
};
methods.getHeatMapTooltip = function () {
    return {
        position: 'top',
        formatter
    }
};
methods.getHeatMapGrid = function () {
    return {
        top: 60,
        right: 40,
        bottom: 30,
        left: 20,
        containLabel: true
    };
};
methods.getHeatMapTitle2 = function () {
    return {
        text: '说明：底色越深，游客占比越高',
        right: 35,
        top: 35,
        textStyle: {
            fontSize: 15,
            color: '#777'
        }
    };
};
methods.transformHeatMapData = function (data) {
    let r = {
        x: null,
        y: [],
        s: [],
        dataMap: {}
    };
    data.forEach((v) => {
        let list = [];
        let name = v.sceneryName;
        for (let k in v) {
            let [str, n] = k.split('_');
            if (!n) {
                continue;
            }
            // 修正小数点
            v[k] = fixFloatNum(v[k]);
            list.push({
                time: n,
                value: v[k]
            });
        }
        list.sort((a, b) => {
            return a.time - b.time;
        });
        if (!r.x) {
            r.x = list.map((v) => v.time);
        }
        r.y.push(name);
        r.dataMap[name] = list;
    });
    // 生成矩阵数据
    let min = 999999;
    let max = -999999;
    if (r.x) {
        for (let i = 0; i < r.x.length; i++) {
            for (let j = 0; j < r.y.length; j++) {
                let name = r.y[j];
                let v = r.dataMap[name][i].value;
                let a = [];
                a[0] = i;
                a[1] = j;
                a[2] = v;
                r.s.push(a);

                if (min > v) {
                    min = v;
                }
                if (max < v) {
                    max = v;
                }
            }
        }
    }
    r.min = min;
    r.max = max;
    return r;
};
methods.getHeatMapLabel = function () {
    return {
        normal: {
            textStyle: {
                color: '#000000'
            },
            formatter: (v) => {
                return tool.padDecimal(v.value[2]) + '%';
            }
        }
    };
};
methods.getHeatMapXAxisLabel = function () {
    return {
        formatter: (v) => {
            let subfix = (v >= 12) ? 'PM' : 'AM';
            return v + subfix;
        }
    };
};
methods.getVisualMapColor = function () {
    return ['#63BE7B', '#FCFCFF'];
};
let computed = {};
computed.heatMapTip = function () {
    if (!this.data1) {
        return '';
    }
    let copy = tool.copy(this.data1);
    let a = [];
    let label = this.heatMapTipLabel || '进入';
    copy.sort((a, b) => {
        let map1 = tool.getMaxInMap(a);
        let map2 = tool.getMaxInMap(b);

        return map2.max - map1.max;
    });
    copy.forEach((item) => {
        if (a.length >= 4) {
            return;
        }

        let name = item.sceneryName;
        if (name.indexOf('/') >= 0) {
            name = item.sceneryName.split('/')[0];
        }
        let {key, max} = tool.getMaxInMap(item);
        let [prefix, time] = key.split('_');
        max = fixFloatNum(max);
        a.push([
            name + '游客' + label + '高峰在' + time + '点，',
            label + '游客占比' + tool.padDecimal(max) + '%'
        ].join(''));
    });

    if (!a.length) {
        return '';
    }
    return a.join('；') + '。';
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
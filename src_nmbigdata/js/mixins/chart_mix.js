let EChartUtil = require('util/echart.js');
let tool = require('util/tool');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getPieSeries = function (o) {
    return tool.extend({
        type: 'pie',
        startAngle: 0,
        radius: [35, 60],
        label: EChartUtil.getPieSeriesLabel()
    }, o);
};
methods.getPieTopLegend = function (o, data = []) {
    return tool.extend({
        top: 25,
        data
    }, o);
};
methods.getPieBottomLegend = function (o, data = []) {
    return tool.extend({
        left: 'center',
        
        bottom: 20,
        data
    }, o);
};
methods.getBarSeries = function (o, data = []) {
    return tool.extend({
        type: 'bar',
        barMaxWidth: 60,
        data
    }, o);
};
methods.getBarGrid = function () {
    return {
        left: 50,
        right: 50,
        bottom: 60,
        containLabel: true
    };
};
methods.getBarLegend = function (o) {
    return tool.extend({
        show: true,
        bottom: 20,
        left: 'center'
    }, o);
};
methods.getSankeyOption = function (o) {
    return tool.extend({
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [{
            type: 'sankey',
            layout: 'none',
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: '#aaa'
                }
            },
            lineStyle: {
                normal: {
                    color: 'source',
                    curveness: 0.5
                }
            }
        }]
    }, o);
};
methods.getTreeSeries = function (o) {
    return tool.extend({
        type: 'tree',
        top: '2%',
        bottom: '2%',
        symbolSize: 10,
        label: {
            normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 14
            }
        },
        leaves: {
            label: {
                normal: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            }
        }
    }, o)
};
methods.getTreeRootLeft = function (o) {
    let defaults = '5%';
    if (!o) {
        return defaults;
    }
    if (typeof o === 'string') {
        var name = o;
    } else if (typeof o === 'object') {
        name = o.name;
    }
    if (!name) {
        return defaults;
    }
    let len = tool.strlen(name);
    return len * 7 + 25;
};

let computed = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {
        'my-chart': require('comp/common/my-chart.vue'),
    }
};
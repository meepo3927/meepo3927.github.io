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
methods.getLineGrid = function (o) {
    return tool.extend({
        top: 30,
        left: 20,
        right: 30,
        bottom: 10,
        containLabel: true
    }, o)
};
methods.getChartTitle = function (o) {
    return tool.extend({
    }, o);
};
methods.getAverageMarkLine = function (options = {color: '#777'}) {
    return {
        precision: 0,
        data: [{
            type: 'average',
            name: '平均值',
            label: {
                normal: {
                    position: 'middle',
                    color: options.color,
                    textStyle: {
                        fontSize: 12
                    },
                    formatter: (p) => {
                        return p.name + p.value;
                    }
                },
                emphasis: {
                    textStyle: {
                        fontSize: 16
                    }
                }
            }
        }]
    }
};
methods.getPieSeries = function (o) {
    return tool.extend({
        type: 'pie',
        // startAngle: 0,
        center: ['50%', '60%'],
        radius: [35, 55],
        minAngle: 10,
        label: {
            position: 'outside'
        },
        labelLine: {
            length: 8,
            length2: 3
        }
    }, o);
};
methods.getPieTooltip = function (o) {
    return tool.extend({
        confine: true,
        formatter: (p) => {
            return this.getTooltipDotHtml(p) + p.name + '：' + p.value
                + ' (' + p.percent + '%)';
        }
    }, o);
};
methods.getPieTopLegend = function (o, data = []) {
    return tool.extend({
        top: 25,
        data
    }, o);
};
methods.getPieRightLegend = function (o) {
    return tool.extend({
        top: 'middle',
        left: '75%',
        orient: 'vertical',
        align: 'left'
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
        barMaxWidth: 25,
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
// 地理
methods.getChartGeo = function (o) {
    return tool.extend({
        top: 40,
        left: 6,
        right: 14,
        roam: true,
        label: {
            emphasis: {
                show: false
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#667491',
                borderColor: '#ffffff'
            },
            emphasis: {
                areaColor: '#2a333d',
            }
        }
    }, o)
};

// 地图 圆圈波纹
methods.getGeoCircleBorderOption = function (o, itemColor = '#FF799D') {
    return tool.extend({
        type: 'effectScatter',
        coordinateSystem: 'geo',
        symbolSize: function (val) {
            let v = val[2];
            let MIN = 8;
            let ratio = 5;
            return Math.max(Math.sqrt(v) / ratio, MIN);
        },
        showEffectOn: 'render',
        rippleEffect: {
            brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
            normal: {
                fontWeight: 'lighter',
                formatter: '{b}',
                position: 'right',
                color: '#eee',
                show: true
            }
            
        },
        itemStyle: {
            normal: {
                color: itemColor,
                shadowBlur: 10,
                shadowColor: itemColor
            }
        },
        zlevel: 4
    }, o)
};
// geo lines 数据格式
methods.getGeoFromToData = function (arr) {
    return (arr || []).map((item) => {
        var fromCoord = [
            item.province_clogiitud,
            item.province_clatitude
        ];
        var toCoord = [
            item.scenery_clogiitud,
            item.scenery_clatitude
        ];
        return [{coord: fromCoord}, {coord: toCoord}];
    });
};

let computed = {};
computed.GRID_BAR_TOP_TITLE = function () {
    return 40;
};
computed.GRID_BAR_LEFT = function () {
    return 25;
};
computed.GRID_BAR_BOTTOM = function () {
    return 5;
};
computed.GRID_BAR_RIGHT = function () {
    return 30;
};
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
    mixins: [
        require('mixins/echarts.js')
    ],
    components: {
        'my-chart': require('comp/common/my-chart.vue'),
    }
};
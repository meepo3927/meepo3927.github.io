let tool = require('util/tool');
const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
const planeColor = '#6C97ED';
const ChinaCityNamePositionMap = {
    '呼和浩特': 'left',
    '内蒙古': [10, -16],
    '山西': 'left'
};
const ProvinceCityNamePositionMap = {
    '乌海': 'left',
    '巴彦淖尔': 'left',
    '阿拉善': 'left',
    '包头': 'left',
    '乌兰察布': 'top',
    '安徽': 'left'
};
const getTooltipDotHtml = function (color) {
    if (typeof color === 'object' && color.color) {
        color = color.color;
    }
    let style = [
        'display:inline-block',
        'margin-right: 5px',
        'border-radius: 10px',
        'width: 9px',
        'height:9px',
        'background-color:' + color
    ].join(';')
    return '<span style="' + style + '"></span> ';
};
const methods = {
    getTooltipDotHtml
};
// 柱状图tooltip
methods.getBarTooltip = function() {
    return {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    }
};
// areaStyle.color 渐变
methods.getChartAreaGradient = function (fromColor, toColor) {
    return  {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0, color: fromColor || '#666666'
        }, {
            offset: 1, color: toColor || '#ffffff'
        }]
    }
};
// 折线图：最大最小 markPoint: this.getMinMaxMarkPoint()
methods.getMinMaxMarkPoint = function () {
    return {
        data: [
            {type: 'max', name: '最大值'},
            {type: 'min', name: '最小值'}
        ]
    }
};
// 桑基图
methods.getSankeyChartOption = function (o) {
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
// 飞机轨迹的尾巴
methods.getPlaneTrailSeries = function (o, color = planeColor) {
    return tool.extend({
        type: 'lines',
        zlevel: 2,
        effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#fff',
            symbolSize: 3
        },
        lineStyle: {
            normal: {
                color,
                width: 0,
                curveness: 0.2
            }
        }
    }, o)
};
// 飞机轨迹
methods.getPlaneFlySeries = function (o, color = planeColor) {
    return tool.extend({
        type: 'lines',
        zlevel: 3,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
        },
        lineStyle: {
            normal: {
                // 飞机和线的颜色
                color,
                width: 1,
                opacity: 0.4,
                curveness: 0.2
            }
        }
    }, o);
};
methods.hookChinaCityNamePosition = function (list) {
    return list.map((v) => {
        let position = ChinaCityNamePositionMap[v.name] || 'right';
        v.label = {
            normal: {
                position
            }
        };
        return v;
    });
};
methods.hookProvinceCityNamePosition = function (list) {
    return list.map((v) => {
        let position = ProvinceCityNamePositionMap[v.name] || 'right';
        v.label = {
            normal: {
                position
            }
        };
        return v;
    });
};

module.exports = {
    methods
};
const tool = require('util/tool');
const PLANE_PATH = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
const PLANE_COLOR = '#6C97ED';
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
const EC = {
    getTooltipDotHtml
};
// 饼图
EC.getPieSeries = function (o) {
    return tool.extend({
        type: 'pie',
        // startAngle: 0,
        center: ['50%', '55%'],
        radius: [55, 75],
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
EC.getPieTooltip = function (o) {
    return tool.extend({
        confine: true,
        formatter: (p) => {
            return this.getTooltipDotHtml(p)
                + p.name + '：' + p.value
                + ' (' + p.percent + '%)';
        }
    }, o);
};
// 柱状图tooltip
EC.getBarTooltip = function() {
    return {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    }
};
// 词云
EC.getWordCloudSeries = function (o) {
    return tool.extend({
        type: 'wordCloud',
        gridSize: 4,
        sizeRange: [16, 50],
        rotationRange: [-45, 45],
        shape: 'pentagon',
        drawOutOfBound: false,
        textStyle: {
            normal: {
                color: function () {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        }
    }, o);
};
// areaStyle.color 渐变
EC.getChartAreaGradient = function (fromColor, toColor) {
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
EC.getMinMaxMarkPoint = function () {
    return {
        data: [
            {type: 'max', name: '最大值'},
            {type: 'min', name: '最小值'}
        ]
    }
};
// 桑基图
EC.getSankeyChartOption = function (o) {
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
// 地理
EC.getChartGeo = function (o, options = {}) {
    return tool.extend({
        map: 'china',
        top: '12%',
        left: 20,
        right: 20,
        roam: true,
        label: {
            emphasis: {
                show: false
            }
        },
        itemStyle: {
            normal: {
                areaColor: options.areaColor || '#323C48',
                borderColor: options.borderColor || '#ffffff'
            },
            emphasis: {
                areaColor: options.hoverAreaColor || '#2a333d',
            }
        }
    }, o)
};
// 地图 圆圈波纹
EC.getGeoCircleBorderOption = function (o, options = {}) {
    const lnglatMap = {};
    let data = undefined;
    if (options.data) {
        data = [];
        // 来源地 circle
        options.data.forEach((item) => {
            const mapkey = item.fromLng + ',' + item.fromLat;
            if (lnglatMap[mapkey]) {
                return;
            }
            data.push({
                name: item.fromName,
                value: [item.fromLng, item.fromLat, item.value]
            });
            lnglatMap[mapkey] = item;
        });
        // 目的地 circle 去重
        options.data.forEach((item) => {
            const mapkey = item.toLng + ',' + item.toLat;
            if (lnglatMap[mapkey]) {
                return;
            }
            data.push({
                name: item.toName,
                value: [item.toLng, item.toLat, 1]
            });
            lnglatMap[mapkey] = item;
        });
    }
    const itemColor = options.itemColor || PLANE_COLOR;
    return tool.extend({
        type: 'effectScatter',
        data: data,
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
        tooltip: {
            formatter: (p) => {
                return p.marker + p.name + '：' + p.value[2];
            }
        },
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
// 飞机轨迹的尾巴
EC.getPlaneTrailSeries = function (o, options = {}) {
    let data = undefined;
    if (options.data) {
        data = options.data.map((item) => {
            const fromCoord = [item.fromLng, item.fromLat];
            const toCoord = [item.toLng, item.toLat];
            return [{coord: fromCoord}, {coord: toCoord}];
        });
    }
    return tool.extend({
        type: 'lines',
        data: data,
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
                color: options.color || PLANE_COLOR,
                width: 0,
                curveness: 0.2
            }
        }
    }, o)
};
// 飞机轨迹
EC.getPlaneFlySeries = function (o, options = {}) {
    let data = undefined;
    if (options.data) {
        data = options.data.map((item) => {
            const fromCoord = [item.fromLng, item.fromLat];
            const toCoord = [item.toLng, item.toLat];
            return [{coord: fromCoord}, {coord: toCoord}];
        });
    }
    return tool.extend({
        type: 'lines',
        data: data,
        zlevel: 3,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: PLANE_PATH,
            symbolSize: 15
        },
        lineStyle: {
            normal: {
                // 飞机和线的颜色
                color: options.color || PLANE_COLOR,
                width: 1,
                opacity: 0.4,
                curveness: 0.2
            }
        }
    }, o);
};
EC.getMapPlaneOption = (o, options = {}) => {
    /**
     options.data = list.map(v => {
        return {
            value: v.userNum,
            fromLng: v.province_clogiitud,
            fromLat: v.province_clatitude,
            fromName: v.cityDesc,
            toLng: v.scenery_clogiitud,
            toLat: v.scenery_clatitude,
            toName: v.sceneryName
        }
     });
    */
    const series = [
        EC.getPlaneTrailSeries({}, {data: options.data}),
        EC.getPlaneFlySeries({}, {data: options.data}),
        EC.getGeoCircleBorderOption({}, {data: options.data}),
        {
            type: 'bar',
            data: options.data ? options.data.map(v => v.value) : [],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'right'
                    }
                }
            },
            barWidth: 15
        }
    ];
    return tool.extend({
        title: {
            text: '',
            top: 15,
            left: 20
        },
        backgroundColor: '#404a59',
        tooltip: {
            trigger: 'item'
        },
        grid: {
            top: 60,
            left: 20,
            width: '40%',
            height: '84%',
            containLabel: true
        },
        geo: options.geo || EC.getChartGeo(),
        xAxis: {
            type: 'value',
            position: 'top',
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: false},
            splitLine: {show: false}
        },
        yAxis: {
            data: options.data ? options.data.map(v => v.fromName) : [],
            type: 'category',
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#fff'
                }
            }
        },
        series: series
    }, o);
};
module.exports = EC;
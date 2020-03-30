/**
 * @描述  Echart 功能封装
 * @用法
 */

var GRID_TOP = 20;
var GRID_LEFT = 10;
var GRID_RIGHT = 20;
var GRID_BOTTOM = 10;

var LEGEND_TOP = 50;
var GRID_TOP_WITH_TITLE = GRID_TOP + 40;
var GRID_TOP_WITH_LEGEND = GRID_TOP + LEGEND_TOP;
var GRID_TOP_WITH_TITLE_LEGEND = GRID_TOP_WITH_TITLE + LEGEND_TOP;

var allTitle = {
    // text: '',
    // subtext: '',
    show: true,
    left: GRID_LEFT,
    top: 3,
    itemGap: 5,
    textStyle: {
        fontWeight: 'normal',
        fontFamily: '黑体',
        fontSize: 19
    }
};
var allBasicOption = {
    title: allTitle
};

var extend = function extend(target, obj) {
    if (arguments.length > 2) {
        for (i = 1; i < arguments.length; i++) {
            target = extend(target, arguments[i]);
        }
        return target;
    }
    target = target || {};
    obj = obj || {};
    var toStr = Object.prototype.toString;
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
            continue;
        }
        if (obj[i] === target) {
            continue;
        }
        var type = toStr.call(obj[i]);
        if (type === '[object Array]') {
            target[i] = extend(target[i] || [], obj[i]);
        } else if (type === '[object Object]') {
            target[i] = extend(target[i], obj[i]);
        } else {
            target[i] = obj[i];
        }
    }
    
    return target;
};

var isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
};

var exports = {
    GRID_TOP_WITH_TITLE: GRID_TOP_WITH_TITLE,
    GRID_TOP_WITH_LEGEND: GRID_TOP_WITH_LEGEND,
    GRID_TOP_WITH_TITLE_LEGEND: GRID_TOP_WITH_TITLE_LEGEND
};
var getNullUndefined = function (v, backup) {
    if (v === null || v === undefined) {
        return backup;
    }
    return v;
};
/**
 * 定义grid
 * 
 */
var grid = function (top, right, bottom, left, containLabel) {
    var o = {
        // 默认true
        containLabel: getNullUndefined(containLabel, true)
    };
    o.top = getNullUndefined(top, GRID_TOP)
    o.right = getNullUndefined(right, GRID_RIGHT);
    o.left = getNullUndefined(left, GRID_LEFT);
    o.bottom = getNullUndefined(bottom, GRID_BOTTOM);
    return o;
};

exports.grid = grid;

var parseType = function (options) {
    var series = options.series || [];
    if (series.type) {
        return series.type;
    }
    if (series[0] && series[0].type) {
        return series[0].type;
    }

    return null;
};

var getToolbox = function () {
    var feature = {
        saveAsImage: {
            show: true
        },
        dataView: {
            show: true,
            readOnly: true
        }
    };
    return {
        right: 15,
        feature: feature
    };
};

var getXYDataZoom = function () {
    return [
        {
            show: true,
            start: 0,
            end: 100,
            handleSize: '100%',
            bottom: 10
        },
        {
            type: 'inside',
            start: 0,
            end: 100
        },
        {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            height: '60%',
            handleSize: '100%',
            showDataShadow: false,
            right: 10
        }
    ]
};

/**
 * 应用类型：直角坐标系
 */
exports.getXYOption = function (options, param) {
    options = options || {};
    param = param || {};
    if (options.series && !isArray(options.series)) {
        options.series = [options.series];
    }
    var type = parseType(options);
    if (type === 'line') {
        options.series.forEach((s) => {
            s.showSymbol = false;
        });
    }
    var titleLeft = GRID_LEFT - 5;
    var legendLeft = GRID_LEFT - 4;

    // tooltip
    var tooltip = {
        trigger: 'axis'
    };

    if (type === 'bar') {
        tooltip.axisPointer = {
            type: 'shadow'
        };
    } else if (type === 'scatter') {
        tooltip.axisPointer = {
            show: true,
            type: 'cross',
            lineStyle: {
                type: 'dashed',
                width: 1
            }
        };
    }
    var defaults = {
        title: {
            left: titleLeft
        },
        legend: {},
        tooltip: tooltip,
        toolbox: getToolbox()
    };
    if (param.dataZoom === true) {
        defaults.dataZoom = getXYDataZoom();
    }

    // 计算grid top
    var top = GRID_TOP;

    if (options.title) {
        top += 40;
    }

    // 默认legend
    if (options.legend) {
        defaults.legend = {
            top: LEGEND_TOP,
            left: legendLeft
        };
        if (options.legend.left === 'right') {
            defaults.legend.top = 7;
        }
        if (options.legend.left !== 'center' && options.legend.left !== 'right') {
            top += LEGEND_TOP;
        }
    }

    // 默认grid
    options.grid = extend(grid(top), options.grid);

    // yAxis
    if (options.yAxis && options.yAxis.type === 'value') {
        defaults.yAxis = {
            boundaryGap: [0, 0.1]
        };
    }

    // 全局 -> 当前类型 -> 自定义
    var o = extend({}, allBasicOption, defaults, options);

    return o;
};

exports.getPieOption = (options) => {
    options = options || {};
    var series = [{
        name: '占比分析',
        type: 'pie',
        radius: [35, 70],
        center: ['50%', '55%'],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }];
    if (options.series && !isArray(options.series)) {
        options.series = [options.series];
    }
    var defaults = {
        toolbox: getToolbox(),
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series
    };
    // 全局 -> 当前类型 -> 自定义
    var o = extend({}, allBasicOption, defaults, options);
    return o;
};

var geoBackgroundColor = '#404a59';
let planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
var xiaoyuFunc = function (val) {
    return Math.log(val[2]) * 3;
};

var getGeoSeries1 = function (name, data) {
    var o = {
        type: 'lines',
        zlevel: 1,
        effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#fff',
            symbolSize: 3
        },
        lineStyle: {
            normal: {
                color: '#a6c84c',
                width: 0,
                curveness: 0.2
            }
        }
    };
    if (name) {
        o.name = name;
    }
    if (data) {
        o.data = data;
    }
    return o;
};

var getGeoSeries2 = function (name, data) {
    var o = {
        type: 'lines',
        zlevel: 2,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
        },
        lineStyle: {
            normal: {
                color: '#a6c84c',
                width: 1,
                opacity: 0.4,
                curveness: 0.2
            }
        }
    };
    if (name) {
        o.name = name;
    }
    if (data) {
        o.data = data;
    }
    return o;
};

var getGeoSeries3 = function (name, data) {
    let formatter = function (value) {
        if (value.name === '呼和浩特') {
            return '中国 呼和浩特';
        }
        return '';
    };
    return {
        name: name || '',
        data: data || [],
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
            }
        },
        symbolSize: xiaoyuFunc,
        itemStyle: {
            normal: {
                color: '#a6c84c'
            }
        }
    };
};

var getGeoSeries4 = function (name, data, index) {
    index = index || 0;
    var o = {
        name: name || '',
        data: data || [],
        type: 'bar',
        itemStyle: {
            normal: {
                label: {
                    show: true,
                    position: 'right'
                },
                color: '#a6c84c'
            }
        },
        xAxisIndex: index,
        yAxisIndex: index,
        barWidth: 15,
        center: ['35%', '35%']
    };
    if (index === 1) {
        o.label =  {
            normal: {
                position: 'left'
            }
        };
    }
    return o;
};

var getGeoXOption = function (index, withLine) {
    index = index || 0;
    var o = {
        type: 'value',
        gridIndex: index,
        position: 'top',
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {show: false},
        splitLine: {show: false}
    };
    if (index === 1) {
        o.inverse = true;
    }
    if (withLine === true) {
        o = setAxisLine(o);
    }
    return o;
};

var getGeoYOption = function (data, index) {
    index = index || 0;
    var o = {
        data: data || [],
        type: 'category',
        axisLine: {show: false},
        axisTick: {show: false},
        splitLine: {show: false},
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        gridIndex: index
    }
    if (index === 1) {
        o.position = 'right';
    }
    return o;
};

var setAxisLine = function (x) {
    x = x || {};
    var style = {color: '#fff'};
    x.axisLine = {
        show: true,
        lineStyle: style
    };
    x.axisTick = {
        show: true,
        lineStyle: style
    };
    x.axisLabel = {
        show: true,
        textStyle: style
    };
    return x;
};
var getGeoToolbox = function () {
    var feature = {
        dataView: {
            show: true,
            readOnly: true
        },
    };
    var iconStyle = {
        normal: {
            color: '#fff'
        }
    };
    return {
        right: 15,
        feature,
        iconStyle
    };
};

exports.getGeoOption = function (options, param) {
    options = options || {};
    param = param || {};
    var name = param.name;

    var title = {
        top: GRID_TOP - 5,
        left: GRID_LEFT,
        textStyle: {
            color: '#fff'
        },
        subtextStyle: {
            color: '#eee'
        }
    };
    var grid = [{
        top: 80,
        left: 20,
        width: '40%',
        height: '80%',
        containLabel: true
    }];
    if (param.yData2) {
        grid.push({
            show: true,
            bottom: 80,
            right: 80,
            width: '15%',
            height: '40%',
            borderWidth: 0
        });
    }
    var legend = {
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        textStyle: {
            color: '#fff'
        },
        selectedMode: 'single'
    };
    if (name) {
        legend.data = [name];
    }
    var geo = {
        map: 'china',
        height: '100%',
        label: {
            emphasis: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#404a59'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    };
    let xAxis = [getGeoXOption(0, param.withAxisline)];
    if (param.yData2) {
        xAxis.push(getGeoXOption(1, param.withAxisline));
    }

    let yAxis = [getGeoYOption(param.yData)];
    if (param.yData2) {
        yAxis.push(getGeoYOption(param.yData2, 1));
    }
    let series = [
        getGeoSeries1(name, param.linesData),
        getGeoSeries2(name, param.linesData),
        getGeoSeries3(name, param.geoData),
        getGeoSeries4(name, param.barData)
    ];
    if (param.barData2) {
        series.push(getGeoSeries4(name, param.barData2, 1));
    }
    var defaults = {
        title: title,
        toolbox: getGeoToolbox(),
        backgroundColor: geoBackgroundColor,
        tooltip: {
            trigger: 'item'
        },
        legend: legend,
        grid: grid,
        geo: geo,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
    };
    // 全局 -> 当前类型 -> 自定义
    var o = extend({}, allBasicOption, defaults, options);
    return o;
};

export default exports;
/**
 * @描述  Echart 功能封装
 * @用法
 */
var tool = require('util/tool.js');

const DEFAULT_THEME = 'macarons';


// 默认的Grid
const GRID_TOP = 20;
const GRID_LEFT = 10;
const GRID_RIGHT = 20;
const GRID_BOTTOM = 10;

const crossTooltip = {
    trigger: 'axis',
    axisPointer: {
        type: 'cross'
    }
};

const axisTooltip = {
    trigger: 'axis'
};

var getNullUndefined = function (v, backup) {
    if (v === null || v === undefined) {
        return backup;
    }
    return v;
};

const grid = (top, right, bottom, left, containLabel) => {
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

const getPieOption = (options = {}) => {
    var series = [{
        name: '占比分析',
        type: 'pie',
        radius: ['35%', '70%'],
        center: ['50%', '50%'],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }];
    var defaults = {
        tooltip: {
            confine: true,
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series
    };
    return tool.extend({}, defaults, options);
};

const getLineOption = (options) => {
    let defaults = {
        tooltip: {
            trigger: 'axis'
        },
        grid: grid(),
        series: [{
            type: 'line'
        }]
    };
    return tool.extend({}, defaults, options);
};

const getFunnelOption = (options) => {
    let label = {
        normal: {
            show: true,
            position: 'inside',
            textStyle: {
                fontSize: 14
            }
        }
    };
    let labelLine = {
        normal: {
            length: 10,
            lineStyle: {
                width: 1,
                type: 'solid'
            }
        }
    };
    let series = {
        name: '漏斗图',
        type:'funnel',
        left: '2%',
        top: 10,
        bottom: 10,
        width: '96%',
        minSize: '0%',
        maxSize: '100%',
        gap: 2,
        label,
        labelLine,
        itemStyle: {
            normal: {
                borderColor: '#fff',
                borderWidth: 1
            }
        }
    };
    let defaults = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
        },
        calculable: true,
        series: [series]
    };

    return tool.extend({}, defaults, options);
};

const setChart = (chart, o) => {
    chart.hideLoading();
    chart.setOption(o, true);
    return chart;
};

const getEmptyOption = (o = {}, text) => {
    let defaults = {
        title: {
            text: text || '暂无数据',
            left: 'center',
            top: 'middle',
            textStyle: {
                fontSize: 16
            }
        }
    };
    return tool.extend({}, defaults, o);
};

const getTooltipDotHtml = (color) => {
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

const rotateNeeded = (len, fontSize, chartWidth, listlen) => {
    // LOG('rotateNeeded:' + len + '-' + fontSize + '-' + chartWidth + '-' + listlen);
    let fontWidth = (len / 2) * fontSize;
    // 数字较多
    if (fontWidth * 1.6 > chartWidth) {
        return true;
    }
    // X轴有10项
    if (listlen >= 10) {
        return true;
    }
    if ((fontWidth * 2 > chartWidth) && listlen >= 7) {
        return true;
    }
    return false;
};
const calDataLength = (data) => {
    let max = 0;
    let total = 0;
    data.forEach((v) => {
        let len = tool.strlen(v);
        if (max < len) {
            max = len;
        }
        total += len;
    });
    return {max, total};
};
const calAxisRotateParam = (data, options = {}) => {
    let chartWidth = options.chartWidth || 0;
    let fontSize = options.fontSize || 12;
    // axisLabel
    let label = {
        textStyle: {align: 'center'}
    };
    let length = calDataLength(data);
    if (!rotateNeeded(length.total, fontSize, chartWidth, data.length)) {
        return {label, pad: 0};
    }
    // 每一个都显示
    label.interval = 0;
    // 旋转角度
    let angle = Math.round(data.length * 1.4);
    if (angle < 10) {
        angle = 10;
    } else if (angle > 30) {
        angle = 30;
    }
    label.rotate = angle;
    // 文字和轴线的距离
    let ratio = 17 / angle;
    let margin = Math.round(length.max / ratio) + 5;
    label.margin = margin;
    let pad = Math.round(margin * .62);
    return {label, pad};
};
const getPieTooltip = (o) => {
    return tool.extend({
        trigger: 'item'
    }, o);
};
const getPieSeriesLabel = (o) => {
    return tool.extend({
        normal: {
            formatter: '{b}：{c} ({d}%)'
        }
    }, o);
};
const randPieData = (x) => {
    return x.map((name) => {
        let value = Math.round(Math.random() * 250) + 80
        return {
            name,
            value
        };
    });
};

const getCategoryAxis = (o) => {
    return tool.extend({
        type: 'category',
        boundaryGap: false,
        splitLine: {
            show: true
        }
    }, o);
};
const getBarTooltip = () => {
    return {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    };
};

const getWordCloudSeries = (o) => {
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

module.exports = {
    crossTooltip,
    axisTooltip,
    grid,
    getPieOption,
    getLineOption,
    getFunnelOption,
    setChart,
    getPieTooltip,
    getCategoryAxis,
    getBarTooltip,
    empty: getEmptyOption,
    getTooltipDotHtml,
    calAxisRotateParam,
    getPieSeriesLabel,
    randPieData,
    getWordCloudSeries
};
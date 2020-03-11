/**
 * @描述  Echart 功能封装
 * @用法
 */
var echarts = require('echarts');
require('lib/echarts_theme/vintage');
var themeInstance = require('lib/echarts_theme/roma.js');
require('lib/echarts_theme/shine.js');

var tool = require('util/tool.js');

const DEFAULT_THEME = 'roma';
const THEME_COLOR = '#5FAEE3';

// 默认的Grid
const GRID_TOP = 20;
const GRID_LEFT = 10;
const GRID_RIGHT = 20;
const GRID_BOTTOM = 10;

const init = (elem, options = {}) => {
    let theme = options.theme || DEFAULT_THEME;
    let myChart = echarts.init(elem, theme);
    if (options.o) {
        myChart.setOption(options.o);
    }
    return myChart;
};

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
        grid: grid()
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

const getEmptyOption = (o = {}) => {
    let defaults = {
        title: {
            text: '暂无数据',
            left: 'center',
            top: 'middle'
        }
    };
    return tool.extend({}, defaults, o);
};

module.exports = {
    init,
    crossTooltip,
    axisTooltip,
    grid,
    getPieOption,
    getLineOption,
    getFunnelOption,
    getEmptyOption,
    THEME_COLOR
};
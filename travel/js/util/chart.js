
var tool = require('util/tool');
var Promise = require('lib/promise');
var echarts = require('echarts');
var config = require('global/config');
var EchartUtil = require('util/echart.js');
require('lib/echarts_theme/vintage');
require('lib/echarts_theme/roma.js');
require('lib/echarts_theme/bigshow.js');
const themeInstance = require('lib/echarts_theme/shine.js');
let theme = 'shine';// config.chart.theme;
let themeBackgroundColor = '#f2f2f2';
let minMaxMarkPoint = {
    data: [
        {
            type: 'max', name: '最大值',
            symbolSize: 60
        },
        {
            type: 'min', name: '最小值',
            symbolSize: 40
        }
    ]
};
let averageMarkLine = {
    precision: 0,
    data: [
        {
            type: 'average',
            name: '平均值',
            label: {
                normal: {
                    position: 'middle'
                },
                emphasis: {
                    textStyle: {
                        fontSize: 22
                    },
                    formatter: (p) => {
                        return p.name + '：' + p.value;
                    }
                }
            }
        }
    ]
};

const lineStyle3 = {
    normal: {
        width: 3
    }
};

let attractionSourceFactor = 1;
let grid = (top, right, bottom, left, containLabel = false) => {
    var o = {
        containLabel
    };
    if (top !== null) {
        o.top = top;
    }
    if (right !== null) {
        o.right = right;
    }
    if (bottom !== null) {
        o.bottom = bottom;
    }
    if (left !== null) {
        o.left = left;
    }
    return o;
};
let getTitleOption = (title, subtitle) => {
    return {
        text: title,
        subtext: subtitle,
        itemGap: 5,
        textStyle: {
            fontFamily: '黑体',
            fontSize: 19
        }
    }
};
const getTitleOption2 = function (title, subtitle) {
    return {
        text: title,
        subtext: subtitle,
        textStyle: {
            fontFamily: '黑体',
            fontSize: 16
        }
    };
};
const getTitle = (title, subtitle) => {
    return {
        text: title,
        subtext: subtitle,
        left: 10,
        top: 8,
        itemGap: 8,
        textStyle: {
            fontFamily: '黑体',
            fontSize: 19
        }
    }
};

const getTimeCategory = (arr, key = 'calDate') => {
    arr = arr || [];
    var dateMap = {};
    var process = (v) => {
        let [y, m, d, hour, minite, second] = v.split(',');
        // m = parseInt(m, 10);
        // d = parseInt(d, 10);
        let date = `\n${y}-${m}-${d}`;
        if (dateMap[y + m + d]) {
            date = '';
        }
        dateMap[y + m + d] = 1;
        hour = parseInt(hour, 10) || 0;
        // minite = parseInt(minite, 10) || 0;
        return `${hour}:${minite}${date}`;
    };
    var list = arr.map((item) => {
        var v = item;
        if (key) {
            v = item[key];
        }
        return process(v + '');
    });

    return list;
};

const getCategoryXAxis = (data) => {
    let x = {};
    x.type = 'category';
    x.boundaryGap = false;
    x.data = data;

    return x;
};

const getDateCategoryXAxis = (list = [], key = 'calDate') => {
    let yearMap = {};
    const process = (v) => {
        let [y, m, d] = v.split('-');
        let yearStr = `\n${y}年`;
        if (yearMap[y]) {
            yearStr = '';
        }
        yearMap[y] = 1;
        m = parseInt(m, 10);
        d = parseInt(d, 10);
        let s = `${m}月${d}日${yearStr}`;
        return s;
    };
    let data = list.map((item) => {
        let str = item;
        if (key) {
            str = item[key];
        }
        return process(str);
    });
    let x = getCategoryXAxis(data);
    let len = data.length;
    let intervalNum = parseInt(len / 20, 10);
    let curYear = 0;

    x.axisLabel = {
        interval: function (index, value) {
            if (len < 20) {
                return true;
            }
            if (~value.indexOf('年')) {
                let yearArr = value.match(/(\d+)年/);
                let year = parseInt(yearArr ? yearArr[1] : 0, 10);
                if (year) {
                    curYear = year;
                }
                return true;
            }
            if (curYear && yearMap[curYear + 1]) {
                var hasNextYear = true;
            }
            let monthArr = value.match(/(\d+)月/);
            let month = parseInt(monthArr ? monthArr[1] : 0, 10);
            let dayArr = value.match(/(\d+)日/);
            let day = parseInt(dayArr ? dayArr[1] : 0, 10);

            if (month === 12 && hasNextYear) {

            }
            if (month === 1 && day > 5) {

            }
            if (index % intervalNum === 0) {
                return true;
            }
            return false;
        }
    };
    return x;
};

let getAnalysisAllType = (options = {}) => {
    var male = [];
    var female = [];
    var JSONData = options.data || [];
    JSONData.forEach(function (item) {
        var val = [
            item['arpuType'], item['ageType']
        ];
        if (item['sexTypeDesc'] === '女性') {
            female.push(val);
        } else if (item['sexTypeDesc'] === '男性') {
            male.push(val);
        }
    });
    const tooltipFormatter = (params) => {
        if (!params || !params.length) {
            return '';
        }
        var str = [];
        var o = {};
        for (let i = 0; i < params.length; i++) {
            var v = params[i];
            var data = v.data || v.value || [];
            if (!o[v.seriesName]) {
                o[v.seriesName] = {
                    minAge: 100,
                    maxAge: 0,
                    amount: 0
                };
            }
            let item = o[v.seriesName];
            item.amount = data[0];
            item.minAge = Math.min(data[1], item.minAge);
            item.maxAge = Math.max(data[1], item.maxAge);
        }
        for (let i in o) {
            str.push(i);
            str.push('年龄跨度：' + o[i].minAge + '-' + o[i].maxAge + '岁');
            str.push('月均消费：' + o[i].amount);
        }
        
        return str.join('<br />');
    };
    let markLine = averageMarkLine;
    var o = {
        title: options.title,
        grid: {},
        toolbox: {
            right: 15,
            feature: {
                saveAsImage: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: true
                },
                dataZoom: {},
                brush: {
                    type: ['rect', 'polygon', 'clear']
                }
            }
        },
        brush: {},
        tooltip: {
            formatter: tooltipFormatter
        },
        legend: {
            top: 14,
            selectedMode: 'single',
            data: ['女性', '男性'],
            left: 'center'
        },
        xAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value} 元'
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value} 岁'
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '女性',
                type: 'scatter',
                data: female,
                markPoint: minMaxMarkPoint,
                markLine: markLine
            },
            {
                name: '男性',
                type: 'scatter',
                data: male,
                markPoint: minMaxMarkPoint,
                markLine: markLine
            }
        ]
    };
    if (options.visualMap) {
        o.visualMap = {
            min: 1,
            max: 100,
            dimension: 1,
            orient: 'vertical',
            right: 5,
            top: 'center',
            calculable: true,
            inRange: {
                color: ['#f2c31a', '#24b7f2']
            }
        };
        o.grid.right = 60;
    }
    var o2 = EchartUtil.getXYOption(o);
    return o2;
};
let getTimeInterval = function (dayCount) {
    if (!dayCount) {
        return undefined;
    }
    var day = 1;
    if (dayCount >= 1000) {
        day = 120;
    } else if (dayCount >= 700) {
        day = 60;
    } else if (dayCount >= 150) {
        day = 30;
    } else if (dayCount >= 30) {
        day = 7;
    } else if (dayCount >= 12) {
        day = 3;
    }

    return day * 24 * 3600 * 1000;
};

const getTimeItem = (item, vKey = 'userNum', dateKey = 'calDate') => {
    var date = tool.convertDate(item[dateKey]);
    return {
        name: date,
        value: [date, item[vKey] || 0]
    };
};

const getAnalysisToolbox = () => {
    let feature = {
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
        feature
    };
};

var exports = {};
exports.echartsReady = function (fn) {
    return new Promise(function (resolve) {
        require.ensure([], function (require) {
            // mlayer.msg('echartsReady');
            var echarts = require('echarts');
            fn && fn(echarts);
            resolve(echarts);
        });
    });
};
// 实时监控 景区人流量监控
exports.getHumanTrafficOption = (options = {}) => {
    let data = options.data || [];
    let modeCategory = true;
    data = data.slice(0, data.length - 2);
    var list = data.map(function (item) {
        if (modeCategory) {
            return exports.bigScreenModify(item.peopleNum || item.userNum);
        }
        var TMP_DATE = tool.convertDate(item['calDate']);
        return {
            name: TMP_DATE,
            value: [TMP_DATE, exports.bigScreenModify(item.peopleNum || item.userNum)]
        }
    });
    let xAxis = {
        type: 'time'
    };
    if (modeCategory) {
        xAxis = getCategoryXAxis(getTimeCategory(data));
    }
    let o = {
        toolbox: false,
        title: options.title,
        xAxis,
        yAxis: {
            type: 'value',
            scale: true
        },
        series: [{
            name: '实时人流量',
            type: 'line',
            lineStyle: lineStyle3,
            markPoint: minMaxMarkPoint,
            markLine: averageMarkLine,
            data: list
        }]
    };

    return EchartUtil.getXYOption(o);
};
// 景区实时客流量
exports.getRealtimePeopleOption = (options = {}) => {
    let data = options.data || [];
    data = data.slice(0, data.length - 2);
    var list = data.map(function (item) {
        return item.peopleNum;
    });
    let xAxis = getCategoryXAxis(getTimeCategory(data));
    let o = {
        toolbox: false,
        title: options.title,
        grid: EchartUtil.grid(60, 50, 45),
        xAxis,
        yAxis: {
            type: 'value',
            scale: true
        },
        series: [{
            name: '实时人流量',
            type: 'line',
            lineStyle: lineStyle3,
            markPoint: minMaxMarkPoint,
            markLine: averageMarkLine,
            data: list
        }]
    };

    return EchartUtil.getXYOption(o, {
        dataZoom: true
    });
};
// 实时监控 - 迁入迁出流量分析
exports.getAttractionInOutOption = (options = {}) => {
    let modeCategory = true;
    let titleOption = {};
    if (options.titleOption) {
        titleOption = options.titleOption;
    } else if (options.title || options.subtitle) {
        titleOption = getTitleOption(options.title, options.subtitle);
    }
    var data = options.data || [];
    
    var getSeriesData = (key) => {
        return data.map(function (item) {
            if (modeCategory) {
                return item[key];
            }
            var TMP_DATE = tool.convertDate(item['calDate']);
            return {
                name: TMP_DATE,
                value: [TMP_DATE, item[key]]
            };
        });
    };
    let xAxis = {
        type: 'time'
    };
    if (modeCategory) {
        xAxis = getCategoryXAxis(getTimeCategory(data));
    }
    var o = {
        title: titleOption,
        toolbox: false,
        legend: {
            data: ['迁出流量', '迁入流量'],
            itemGap: 10,
            top: 20,
            left: 'auto',
            right: 10
        },
        grid: EchartUtil.grid(60, 50, 45),
        xAxis,
        yAxis: {
            type: 'value',
            scale: true
        },
        series: [
            {
                name: '迁入流量',
                type: 'line',
                lineStyle: lineStyle3,
                data: getSeriesData('moveInNum')
            },
            {
                name: '迁出流量',
                type: 'line',
                lineStyle: lineStyle3,
                data: getSeriesData('moveOutNum')
            }
        ]
    };

    return EchartUtil.getXYOption(o, {
        dataZoom: true
    });
};
// 实时监控 - 实时客流量 小图
exports.getDynamicLineCityOption = (data, options = {}) => {
    data = data || [];
    var xData = [];
    if (data[0]) {
        xData = getTimeCategory(data[0].vwSceneryUserCurrentDayList, 'calDate');
        // 去掉最后两位数据，因为不准确
        xData = xData.slice(0, xData.length - 2);
    }
    let series = data.map((item) => {
        let list = item['vwSceneryUserCurrentDayList'] || [];
        list = list.slice(0, list.length - 2);
        list = list.sort((a, b) => {
            return (a.calDate > b.calDate) ? 1 : -1;
        });

        let data = list.map((v) => {
            return v.userNum;
        });
        while (data.length < xData.length) {
            let i = data.length;
            data[i] = 0;
        }
        let o = {
            name: item['sceneryName'],
            showSymbol: false,
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data
        };
        return o;
    });
    var xAxis = getCategoryXAxis(xData);
    var o = {
        tooltip: {
            confine: true
        },
        toolbox: false,
        grid: EchartUtil.grid(10, 30),
        xAxis: xAxis,
        yAxis: {
            type: 'value'
        },
        series: series
    };
    return EchartUtil.getXYOption(o);
};
// 实时监控 - 实时客流量 - 放大
exports.getAttractionUserRealtime = (data, scenerys) => {
    var modeCategory = true;
    var xData = [];
    // x轴，以第一个景区为准
    if (data[0]) {
        xData = getTimeCategory(data[0], 'calDate');
    }
    let series = data.map((list, index) => {
        list = list.sort((a, b) => {
            return (a.calDate > b.calDate) ? 1 : -1;
        });
        let data = list.map((v) => {
            return v.peopleNum;
        });
        // 补0
        while (data.length < xData.length) {
            let i = data.length;
            data[i] = 0;
        }
        let sceneryItem = scenerys[index] || {};
        let o = {
            name: sceneryItem.placeName,
            showSymbol: false,
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            markPoint: minMaxMarkPoint,
            markLine: averageMarkLine,
            data
        };
        return o;
    });
    var xAxis = getCategoryXAxis(xData);
    var o = {
        toolbox: false,
        grid: EchartUtil.grid(15),
        xAxis: xAxis,
        yAxis: {
            type: 'value'
        },
        series: series
    };
    return EchartUtil.getXYOption(o);
};
// 城市迁入迁出 , 旧的
exports.getMonitorCityInoutParallelOption = (options = {}) => {
    var data = options.data || [];
    var schema = [{
        name: 'type',
        index: 0,
        text: '人流量类型'
    }];
    var schemeArray = data[0] ? data[0]['vwSceneryCurrentDayList'] : [];
    for (var schemeIndex = 0; schemeIndex < schemeArray.length; schemeIndex++) {
        schema.push({
            name: schemeArray[schemeIndex]['dataTime'],
            index: schemeIndex + 1,
            text: schemeArray[schemeIndex]['dataTime']
        });
    }
    var formatter = function (obj) {
        var value = obj[0].value;
        let str = '';
        for (let i = 1; i < 5; i++) {
            if (schema[i]) {
                str += `${schema[1].text}：${value[1]} <br>`;
            }
        }
        return `
            <div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">
                ${obj[0].seriesName} ${value[0]}日期：
                ${value[7]}
            </div>
            ${str}
        `.trim();
    };
    var convertData = (data) => {
        var checkIn = ['迁入'];
        var checkOut = ['迁出'];
        data.forEach(function (item) {
            checkIn.push(item['checkInNum']);
            checkOut.push(item['checkOutNum']);
        });
        return [checkIn, checkOut];
    };
    let parallelAxis = [
        {
            dim: 0, 
            name: schema[0].text,
            type: 'category',
            data: ['迁入', '迁出']
        }
    ];
    for (let i = 1; i <= 5; i++) {
        if (schema[i]) {
            parallelAxis.push({
                dim: i,
                name: schema[i].text
            });
        }
    }
    return {
        title: getTitleOption('迁入迁出流量分析', ''),
        backgroundColor: '#333',
        legend: {
            bottom: 30,
            data: data.map(item => item.sceneryName),
            itemGap: 20,
            textStyle: {
                color: '#fff',
                fontSize: 14
            }
        },
        tooltip: {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: formatter
        },
        parallelAxis,
        visualMap: {
            show: true,
            min: 0,
            max: 150,
            dimension: 2,
            inRange: {
                color: ['#50a3ba', '#eac736', '#d94e5d']
            }
        },
        parallel: {
            left: '30',
            right: '8%',
            bottom: 80,
            parallelAxisDefault: {
                type: 'value',
                name: 'AQI指数',
                nameLocation: 'end',
                nameGap: 20,
                nameTextStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                axisLine: {
                    lineStyle: {
                        color: '#aaa'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#777'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        },
        series: data.map((item) => {
            return {
                name: item['sceneryName'],
                type: 'parallel',
                lineStyle: {
                    normal: {
                        width: 1,
                        opacity: 0.5
                    }
                },
                data: convertData(item['vwSceneryCurrentDayList'])
            };
        })
    };
};

// 地市数据分析 - 游客驻留时间分布图
exports.getCityStayTimeOption = (options = {}) => {
    const xAxisData = [
        '1小时内', '1-3小时', '3-5小时', '5-7小时',
        '7-9小时', '9小时以上'
    ];
    var data = options.data || [];
    var legendData = data.map((item) => (item.name));
    let o = {
        title: options.title,
        legend: {data: legendData},
        xAxis: {
            type: 'category',
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
        series: data.map((item) => ({
            name: item.name,
            type: 'bar',
            barGap: 0,
            label: {
                normal: {
                    show: false,
                    position: 'top'
                }
            },
            data: [
                item.num0, item.num1, item.num3, item.num5,
                item.num7, item.num9,
            ]
        }))
    };

    return EchartUtil.getXYOption(o);
};
// 地市数据分析 - 景区全年人流量
exports.getCityAnalysisUserCommon = (options = {}) => {
    let JSON_DATA = options.data || [];
    let first = JSON_DATA[0] || {};
    let len = first.scenAreaUserItemList ? first.scenAreaUserItemList.length : 0;
    let interval = getTimeInterval(len);
    let modeCategory = false;
    let xAxis = {
        type: 'time',
        interval: interval
    };
    if (modeCategory) {
        xAxis = getDateCategoryXAxis(first.scenAreaUserItemList);
    }
    let o = ({
        title: options.title,
        legend: {
            data: JSON_DATA.map((item) => (item['sceneryName'])),
        },
        xAxis,
        yAxis: {
            type: 'value',
            scale: true
        },
        series: JSON_DATA.map((item) => ({
            name: item['sceneryName'],
            type: 'line',
            data: item['scenAreaUserItemList'].map((_item) => {
                if (modeCategory) {
                    return _item.userNum;
                }
                return {
                    name: _item['calDate'],
                    value: [_item['calDate'], _item['userNum']]
                };

            })
        }))
    });

    return EchartUtil.getXYOption(o);
};
// 地市数据分析 - 游客构成 - 综合分析
exports.getCityAnalysisUserAllType = (options) => {
    return getAnalysisAllType(options);
};


// 景区数据分析 - 逗留时间统计
exports.getAttractionStayTimeOption = (options = {}) => {
    var JSON_DATA = options.data;
    var first = JSON_DATA[0] || {};
    var datalist = first.sceneryPeopleStayDateList || [];
    var interval = getTimeInterval(datalist.length);

    var o = {
        title: options.title,
        legend: {
            top: 15,
            left: 'center',
            data: JSON_DATA.map((item) => item['stayDateTime']),
        },
        xAxis: {
            type: 'time',
            interval
        },
        yAxis: {
            type: 'value'
        },
        series: JSON_DATA.map((item) => {
            return {
                name: item['stayDateTime'],
                type: 'line',
                data: item['sceneryPeopleStayDateList'].map((list) => ({
                    name: list['calDate'],
                    value: [list['calDate'], list['userNum']]
                }))
            };
        })
    };

    return EchartUtil.getXYOption(o);
};
// 景区数据分析 - 景区人流量统计
exports.getAttractionCountOption = (options = {}) => {
    var datalist = options.data || [];
    let modeCategory = false;

    if (modeCategory) {
        var xAxis = getDateCategoryXAxis(datalist);
    } else {
        var interval = getTimeInterval(datalist.length);
        xAxis = {
            type: 'time',
            interval
        };
    }
    var sdata = datalist.map((item) => {
        if (modeCategory) {
            return item.userNum;
        }
        return {
            name: item['calDate'],
            value: [item['calDate'], item['userNum']]
        };
    });
    var o = {
        title: options.title,
        xAxis,
        yAxis: {
            type: 'value',
            scale: true
        },
        series: [{
            name: '人流量',
            type: 'line',
            data: sdata
        }]
    };
    return EchartUtil.getXYOption(o);
};

const getSourceOptionData = (arr, param = {}) => {
    arr = arr || [];
    arr = arr.sort((a, b) => {
        return a.userNum - b.userNum;
    });
    let list = arr.slice(0);
    if (param.data2) {
        list = arr.concat(param.data2);
    }
    list = list.sort((a, b) => {
        return a.userNum - b.userNum;
    });

    var dataKey = param.dataKey;
    var dataKey2 = param.dataKey2;
    if (param.maxItemCount) {
        list = list.slice(0, param.maxItemCount);
    }

    var first = list[0] || {};

    var linesData = list.map((item) => {
        var fromCoord = [
            item.province_clogiitud,
            item.province_clatitude
        ];
        var toCoord = [
            item.scenery_clogiitud,
            item.scenery_clatitude
        ];
        if (param.direction === 'to') {
            return [{coord: toCoord}, {coord: fromCoord}];
        }
        return [{coord: fromCoord}, {coord: toCoord}];
    });

    var geoData = list.map((item) => {
        var userNum = item.userNum;
        if (param.factor) {
            userNum = bigScreenModify(userNum, param.factor);
        }
        return {
            name: item[dataKey] || item[dataKey2],
            value: [
                item.province_clogiitud,
                item.province_clatitude,
                userNum
            ]
        };
    });
    let MAX_BAR_COUNT = 32;
    if (config.screen.isBig) {
        MAX_BAR_COUNT = 32;
    }
    let start = Math.max(0, arr.length - MAX_BAR_COUNT);
    // 图内 - 左侧排行榜 - 限制个数
    arr = arr.slice(start);
    var barData = arr.map((item) => {
        if (param.factor) {
            return bigScreenModify(item.userNum, param.factor);
        }
        return item.userNum;
    });
    var yData = arr.map((item) => item[dataKey]);
    return {
        name: first.sceneryName,
        linesData: linesData,
        geoData: geoData,
        barData: barData,
        yData: yData
    };
};

// 景区客流来源 - 省外
exports.getAttractionSourceOption = (options = {}) => {
    var optionData = getSourceOptionData(options.data, {
        dataKey: 'provinceName'
    });
    var title = {
        text: options.title,
        subtext: options.subtitle
    };

    return EchartUtil.getGeoOption({
        title: title
    }, optionData);
};
// 景区客流来源 - 省内
exports.getAttractionSource2Option = (options = {}) => {
    var optionData = getSourceOptionData(options.data, {
        dataKey: 'cityDesc'
    });
    var title = {
        text: options.title,
        subtext: options.subtitle
    };
    return EchartUtil.getGeoOption({
        title: title,
        geo: {
            map: '内蒙古'
        }
    }, optionData);
};
const getMapCenter = (arr) => {
    if (!arr) {
        return null;
    }
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (item.scenery_clogiitud && item.scenery_clatitude) {
            return [
                item.scenery_clogiitud,
                item.scenery_clatitude
            ];
        }
    }
    return null;
};
// 景区客流来源 - 区县级别
exports.getAttractionSource3Option = (options = {}) => {
    var optionData = getSourceOptionData(options.data, {
        dataKey: 'cityDesc'
    });
    var title = {
        text: options.title,
        subtext: options.subtitle
    };
    var center = getMapCenter(options.data);
    return EchartUtil.getGeoOption({
        title: title,
        geo: {
            map: '内蒙古',
            center,
            zoom: 6
        }
    }, optionData);
};

// 景区来源 - for attraction_realtime
exports.getAttractionSource1Option = (options) => {
    let titleOption = {
        text: '景区客流来源排行',
        subtext: "内蒙古移动提供大数据支持",
        left: 10,
        top: 10,
        subtextStyle: {
            fontFamily: '黑体',
            fontSize: 30
        },
        itemGap: 5,
        textStyle: {
            fontFamily: '黑体',
            fontSize: 44,
            color: '#fff'
        }
    };
    let hasNMData = options.nmData && (options.nmData.length > 0);
    let NEIMENGGU_DATA = (options.nmData || []).sort((a, b) => {
        return a.userNum - b.userNum;
    });
    let grid = [{
        show: true,
        top: 90,
        height: '68%',
        borderWidth: 0
    }];
    let yData2 = null;
    let barData2 = null;
    if (hasNMData) {
        grid[0].top = 140;
        grid[0].height = '80%';
        yData2 = NEIMENGGU_DATA.map(function (item) {
            return item['cityDesc'];
        });
        barData2 = NEIMENGGU_DATA.map(function (dataItem) {
            return bigScreenModify(dataItem['userNum'], attractionSourceFactor);
        });
    }

    let datalist = options.data || [];

    var optionData = getSourceOptionData(datalist, {
        data2: options.data2,
        dataKey: 'provinceName',
        dataKey2: 'cityDesc',
        factor: attractionSourceFactor
    });

    var sceneryName = optionData.data;

    let o = {
        grid
    };
    let isMini = !!options.mini;
    if (isMini) {
        titleOption.subtextStyle.fontSize = 16;
        titleOption.textStyle.fontSize = 20;
    }
    o.title = titleOption;
    return EchartUtil.getGeoOption(o, {
        withAxisline: true,
        linesData: optionData.linesData,
        name: optionData.name,
        geoData: optionData.geoData,
        yData: optionData.yData,
        yData2,
        barData: optionData.barData,
        barData2
    });
};

// 景区 综合分析
exports.getAttractionCountAllType = (options) => {
    return getAnalysisAllType(options);
};

// 景区数据分析 - 本周游客驻留时间分布图
exports.getAttractionPeopleVisitDate = (options = {}) => {
    var findVisualMapMax = function (data) {
        var result = 0;
        data.forEach(function (object) {
            object.list.forEach(function (item) {
                if (item.userNum > result) {
                    result = item.userNum;
                }
            });
        });
        return result;
    };
    var getVisualMap = function (arr) {
        var r = {
            max: -1,
            min: 99999999
        };
        arr.forEach((v) => {
            if (v[2] > r.max) {
                r.max = v[2];
            }
            if (v[2] > 0 && v[2] < r.min) {
                r.min = v[2];
            }
        });
        return r;
    };
    var getAxisXData = function () {
        var xAxisData = [];
        var startHour = 9;  // 9:00
        var endHour = 19;   // 19:00
        for (var i = startHour; i <= endHour; i++) {
            xAxisData.push(i + ':00');
        }
        return xAxisData;
    };
    var datalist = options.data || [];

    var xAxisData = getAxisXData();

    var emptyList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var yAxisData = [];
    var serisdata = [];
    datalist.forEach(function (element, index) {
        yAxisData.push(element['calDate'] + "(" + element['dateWeek'] + ")");
        var list = element['list'];
        if (list.length > 0) {
            list.forEach(function (listElement, listIndex) {
                if (listIndex >= xAxisData.length) {
                    return;
                }
                serisdata.push([index, listIndex, listElement['userNum']]);
            });
        } else {
            emptyList.forEach(function (emptyElement, emptyIndex) {
                serisdata.push([index, emptyIndex, emptyElement]);
            });
        }
    });
    let splitArea = {
        show: true
    };
    var vMap = getVisualMap(serisdata);

    let o = ({
        title: options.title,
        backgroundColor: themeInstance.backgroundColor,
        toolbox: getAnalysisToolbox(),
        visualMap: {
            min: vMap.min,
            max: vMap.max,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: 5
        },
        tooltip: {
            trigger: 'item',
            position: 'top',
            formatter: (param) => {
                let v = param.data || param.value || [];
                // LOG(param);
                return [
                    param.name,
                    '人数：' + v[2]
                ].join('<br />');
            }
        },
        animation: false,
        grid: grid(60, 15, 20, 120),
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisTick: {
                show: false
            },
            splitArea
        },
        yAxis: {
            type: 'category',
            data: yAxisData,
            axisTick: {
                show: false
            },
            splitArea
        },
        series: [{
            name: '人数',
            type: 'heatmap',
            data: serisdata.map(function (item) {
                return [item[1], item[0], item[2] || '-'];
            }),
            label: {
                normal: {
                    show: true
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    });

    return EchartUtil.getXYOption(o);
};

// 终端品牌占比
exports.getAnalysisTerminalPieOption = (options) => {
    var DATA_LIST = options.data || [];
    var pieSeriesData = [];
    var userNumOther = 0;
    DATA_LIST.sort(function (a, b) {
        return b.userNum - a.userNum;
    }).forEach(function (item, index) {
        if (index < 9) {
            pieSeriesData.push({
                name: item['phoneBrand'],
                value: item['userNum']
            });
        } else {
            userNumOther += item['userNum'];
        }
    });
    if (userNumOther) {
        pieSeriesData.push({
            name: '其他',
            value: userNumOther
        });
    }

    return EchartUtil.getPieOption({
        title: options.title,
        
        series: [{
            name: '终端占比',
            data: pieSeriesData
        }]
    });
};

// 消费层次饼图
exports.getAnalysisConsumptionPieOption = (options) => {
    var JSONData = options.data || [];
    var data = JSONData.map((item) => {
        return {
            name: item['arpuTypeDesc'],
            value: item['userNum']
        };
    });
    return EchartUtil.getPieOption({
        title: options.title,

        series: {
            name: '消费占比',
            data: data
        }
    });
};
// 年龄构成饼图
exports.getAnalysisAgePieOption = (options) => {
    var JSONData = options.data || [];
    var data = JSONData.map((item) => {
        return {
            name: item['ageTypeDesc'],
            value: item['userNum']
        };
    });
    return EchartUtil.getPieOption({
        title: options.title,

        series: {
            name: '年龄占比',
            data: data
        }
    });
};

const transformArrayToMap = (a, o = {}) => {
    // 转换bar数据
    let map = {};
    for (let i = 0; i < a.length; i++) {
        let item = a[i];
        let name = item.name;
        if (!map[name]) {
            map[name] = [];
        }
        
        if (o.arrayIndexKey) {
            var index = parseInt(item[o.arrayIndexKey], 10);
        }
        if (isNaN(index)) {
            map[name].push(item);
        } else {
            map[name][index] = item;
        }
    }

    return map;
};

const legendSortFunc = (a, b) => {
    return parseInt(a, 10) - parseInt(b, 10);
};

// 景区数据分析 - 游客构成 - 流量语音
exports.vwRptNmComeGPRSLevDailyPie = (o, {pieData, barData, name}) => {

    let basicOption = tool.extend({}, EchartUtil.allBasicOption);
    
    // 饼图数据排序
    pieData = pieData.sort((a, b) => {
        return parseInt(a.name) - parseInt(b.name);
    })
    // 饼图系列
    let pieSeries = EchartUtil.getPieSeries({
        name: name,
        radius: [35, 70],
        center: ['16%', '55%'],
        tooltip: {
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        data: pieData
    });

    const barFormatter = (p) => {
        let html = '';
        let hour = '';
        p.forEach((v) => {
            
            hour = v.axisValueLabel;
            html += EchartUtil.getTooltipDotHtml(v.color);
            html += v.seriesName + '：' + v.value + '人';
            html += '<br />';
        });
        var prefix = (hour || '0') + '点<br />';
        return prefix + html;
    };

    // 将一维数组转换成map
    let barMap = transformArrayToMap(barData, {
        arrayIndexKey: 'hour'
    });
    // 空缺的数据填0
    let barSeriesArray = [];
    for (let name in barMap) {
        if (!barMap.hasOwnProperty(name)) continue;
        let arr = barMap[name];
        let availableItem = arr[arr.length - 1];
        for (let h = 0; h < 24; h++) {
            if (arr[h]) continue;
            arr[h] = tool.extend({}, availableItem, {
                hour: h,
                value: 0
            });
        }

        // bar系列
        barSeriesArray.push(EchartUtil.getBarSeries({
            // name增加空格，为了和饼图legend区分
            name: ' ' + name,
            data: arr.map((v) => v.value),
            stack: 'main',
            barGap: 0
        }));
    }
    // 按照name排序
    // name示例：1M , 2-5M , 30M
    barSeriesArray.sort((a, b) => {
        return parseInt(a.name, 10) - parseInt(b.name, 10);
    });

    // x轴是0-23点
    let xAxisData = [];
    for (let i = 0; i < 24; i++) {
        xAxisData.push(i);
    }

    // 饼图legend
    let pieLegendData = pieData.map(v => v.name);

    // 柱图legend
    let barLegendData = barSeriesArray.map((v) => {
        return v.name;
    });
    let defaults = {
        toolbox: EchartUtil.getToolbox(),
        tooltip: {
            trigger: 'item',
            formatter: barFormatter
        },
        legend: [
            {
                left: '4%',
                bottom: 20,
                data: pieLegendData
            },
            {
                show: false,
                top: 20,
                data: barLegendData
            }
        ],
        grid: {
            left: '30%',
            right: 30,
            tooltip: EchartUtil.getBarTooltip()
        },
        xAxis: {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            data: xAxisData,
            axisLabel: {
                formatter: '{value}点'
            }
        },
        yAxis: {
            name: '人',
            type: 'value'
        },
        series: (barSeriesArray).concat([pieSeries])
    };
    return tool.extend(basicOption, defaults, o);
};

// 来市数据分析 - 驻留时间分析
exports.rptSiteLongDailyPie = (o, {data}) => {
    let defaults = {
        series: {
            name: '时间分布',
            data: data,
            label: {
                normal: {
                    formatter: '{b}: {c}人 ({d}%)'
                }
            }
        }
    };
    return EchartUtil.getPieOption(tool.extend(defaults, o));
};
// 来市数据分析 - 客流来源分析 - 国外
exports.vwRPTOuterUserDaily1 = (o, {data}) => {
    var optionData = getSourceOptionData(data, {
        dataKey: 'provinceName'
    });
    const defaults = {
        geo: {
            map: 'world'
        }
    };
    return EchartUtil.getGeoOption(tool.extend(defaults, o), optionData);
};
// 来市数据分析 - 客流来源分析 - 省外
exports.vwRPTOuterUserDaily2 = (o, {data}) => {
    var optionData = getSourceOptionData(data, {
        dataKey: 'provinceName'
    });
    const defaults = {
    };
    return EchartUtil.getGeoOption(tool.extend(defaults, o), optionData);
};
// 来市数据分析 - 客流来源分析 - 省内
exports.vwRPTOuterUserDaily3 = (o, {data}) => {
    var optionData = getSourceOptionData(data, {
        dataKey: 'provinceName'
    });
    const defaults = {
        geo: {
            map: '内蒙古'
        }
    };
    return EchartUtil.getGeoOption(tool.extend(defaults, o), optionData);
};

// 出省数据分析 - 客流量分析
exports.vwRptNmOutProvDaily = (o, {data}) => {
    let interval = getTimeInterval(data.length);
    data = data.sort((a, b) => {
        return (a.name > b.name) ? 1 : -1;
    });
    var sdata = data.map((item) => {
        return {
            name: item.name,
            value: [item.name, item.value]
        };
    });
    var defaults = {
        xAxis: {
            type: 'time',
            interval
        },
        yAxis: {
            type: 'value',
            scale: true
        },
        series: [{
            name: '客流量',
            type: 'line',
            data: sdata
        }]
    };
    return EchartUtil.getXYOption(tool.extend(defaults, o));
};

// 出省数据分析 - 去向分析
exports.vwRptNmOutProvDailyMap = (o = {}, {data}) => {
    var optionData = getSourceOptionData(data, {
        dataKey: 'provinceName',
        direction: 'to'
    });
    return EchartUtil.getGeoOption(o, optionData);
};

// 出省数据分析 - 驻留时间分析
exports.rptNmOutSiteLongPie = (o, {data}) => {
    let defaults = {
        series: {
            name: '时间分布',
            data: data,
            radius: [80, 140],
            center: ['50%' ,'50%'],
            label: {
                normal: {
                    formatter: '{b}: {c}人 ({d}%)'
                }
            }
        }
    };
    return EchartUtil.getPieOption(tool.extend(defaults, o));
};

exports.getTitle = getTitle;
exports.getTitleOption = getTitleOption;
exports.getTitleOption2 = getTitleOption2;
exports.initChart = function (elem, options) {
    var chart = echarts.init(elem, theme);
    if (options) {
        chart.setOption(options);
    }
    return chart;
};
// 饼图
exports.getPieChart = (o, {data, name}) => {
    let defaults = {
        series: {
            name,
            data
        }
    };
    return EchartUtil.getPieOption(tool.extend(defaults, o));
};
const bigScreenModify = (value, factor) => {
    factor = factor || config.factor;
    return Math.ceil(value / factor);
};
exports.bigScreenModify = bigScreenModify;
exports.getThemeColor = function () {
    if (typeof themeInstance === 'undefined') {
        return [];
    }
    return themeInstance.color;
};
exports.getThemeColorByIndex = function (i, arr) {
    return arr[i % arr.length];
};
exports.getBigShowMapOption = (data, data2) => {
    if (data2) {
        data2 = data2.map((v) => {
            v.provinceName = v.cityDesc;
            return v;
        });
    }
    let o = exports.getAttractionSource1Option({
        data: (data || []),
        // data2: data2,
        // nmData: data2 || []
    });
    let geo = {
        left: 1,
        width: '100%',
        itemStyle: {
            normal: {
                // areaColor: '#024CFD',
                // areaColor: '#268DFB',
                areaColor: '#23539B',
                borderColor: '#333'
            },
            emphasis: {
                areaColor: '#4FD4F8'
            }
        }
    };
    let grid = [
        {
            height: 'auto',
            width: '45%',
            left: 40,
            top: 150,
            bottom: 0,
            containLabel: true
        },
        {
            right: 160,
            bottom: 140
        }
    ];
    const barBgColor = '#09E4CD';
    const geoTextColor = '#ffffff';
    let mapCityNameFontSize = 40;
    let leftCityNameFontSize = 40;
    let leftBarWidth = 28;
    let leftBarFontSize = 40;
    if (config.screen.isBig) {
        // mapCityNameFontSize = 16;
        mapCityNameFontSize = 22; // huizhan
        leftCityNameFontSize = 22; // huizhan
        leftBarWidth = 20;
    }
    // 小字模式
    if (exports.mode === 2) {
        mapCityNameFontSize = 16;
        leftCityNameFontSize = 16;
        leftBarWidth = 16;
        leftBarFontSize = 20;
    }
    let label = {
        normal: {
            textStyle: {
                fontSize: mapCityNameFontSize
            }
        }
    };
    // label for 地市名字+点
    let maplabel2 = {
        normal: {
            textStyle: {
                fontSize: mapCityNameFontSize
            }
        }
    };
    let barlabel = {
        normal: {
            position: 'right',
            textStyle: {
                fontSize: leftBarFontSize
            }
        }
    };
    
    let axisLabel = {
        textStyle: {
            fontSize: leftCityNameFontSize
        }
    };
    let xAxis = [
        {
            show: false
        }
    ];
    let yAxis = [
        {
            boundaryGap: true,
            axisTick: {
                show: true,
                alignWithLabel: true
            },
            axisLabel
        },
        {
            axisLabel
        }
    ];
    o = tool.extend(o, {
        title: null,
        toolbox: false,
        legend: null,
        backgroundColor: 'transparent',
        grid,
        geo,
        xAxis,
        yAxis,
        series: [
            {
                label,
                lineStyle: {
                    normal: {
                        color: geoTextColor
                    }
                }
            },
            {
                label,
                lineStyle: {
                    normal: {
                        color: geoTextColor
                    }
                }
            },
            {
                label: maplabel2,
                itemStyle: {
                    normal: {
                        color: geoTextColor
                    }
                }
            },
            {
                label: barlabel,
                barWidth: leftBarWidth,
                itemStyle: {
                    normal: {
                        color: barBgColor
                    }
                }
            }
        ]
    });

    return o;
};
exports.getBigShowInOut = (data) => {
    let o = exports.getAttractionInOutOption({data});
    return tool.extend(o, {
        legend: null,
        grid: EchartUtil.grid(10),
        dataZoom: false
    });
};
exports.getBigShowStayTime = (data) => {
    let o = exports.getCityStayTimeOption({data});
    return tool.extend(o, {
        legend: false,
        toolbox: false,
        grid: EchartUtil.grid(10)
    });
};
exports.getBigShowAllType = (data) => {
    let o = getAnalysisAllType({data});
    return tool.extend(o, {
        toolbox: false,
        legend: false,
        brush: null,
        grid: EchartUtil.grid(20)
    });
};
exports.getBigShowAllType1 = (data) => {
    let o = getAnalysisAllType({data});
    let series = [
        o.series[0]
    ];
    o.series = series;
    return tool.extend(o, {
        toolbox: false,
        legend: false,
        brush: null,
        grid: EchartUtil.grid(20)
    });
};
exports.getBigShowAllType2 = (data) => {
    let o = getAnalysisAllType({data});
    let series = [
        o.series[1]
    ];
    o.series = series;
    return tool.extend(o, {
        toolbox: false,
        legend: false,
        brush: null,
        grid: EchartUtil.grid(20),
        color: [
            '#23539B','#09E4CD','#3C9DE4',
            '#005EFF','#FFFFFF',
            '#8dc1a9','#ea7e53','#eedd78',
            '#73a373','#73b9bc','#7289ab'
        ]
    });
};
exports.getBigShowPieChartOption = (o) => {
    o = tool.extend(o, {
        toolbox: false,
        backgroundColor: 'tranparent',
        series: [{
            radius: [30, 60],
            center: ['50%', '50%']
        }]
    });
    return o;
};

exports.getAttractionPathOption = (o) => {
    let defaults = {
        title: {
            left: 10,
            top: 8,
            itemGap: 8
        },
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
    };
    return tool.extend(defaults, o);
};
exports.getGraphOption = (o, data = {}) => {
    const MAX_SIZE = 500;
    // 过滤
    let nodes = data.data.filter((v) => {
        return (v.symbolSize > 3)
    });
    nodes.forEach((v) => {
        let size = Math.sqrt(v.symbolSize) * 2;
        size = Math.round(size);
        v.symbolSize = Math.min(size, MAX_SIZE);
    });
    let defaults = {
        tooltip: {},
        legend: {
            top: 15
        },
        animationDuration: 3000,
        animationEasingUpdate: 'quinticInOut',
        series: [{
            type: 'graph',
            layout: 'force',
            force: {
                repulsion: 30,
                edgeLength: [400, 600],
                layoutAnimation: true
            },
            focusNodeAdjacency: true,
            roam: true,
            data: nodes,
            links: data.links,
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            lineStyle: {
                normal: {
                    color: 'source',
                    curveness: 0,
                    type: "solid"
                }
            }
        }]
    };
    return tool.extend(defaults, o);
};
exports.getSourceOptionData = getSourceOptionData;
exports.empty = EchartUtil.empty;
module.exports = exports;
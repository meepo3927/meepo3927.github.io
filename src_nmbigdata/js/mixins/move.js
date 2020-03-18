let config = require('global/config');
let tool = require('util/tool.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};

var geoCoordMap = config.geoCoordMap;
var countryData = {};
countryData['呼和浩特'] = [
    [{name:'呼和浩特'}, {name:'上海'}],
    [{name:'呼和浩特'}, {name:'广州'}],
    [{name:'呼和浩特'}, {name:'大连'}],
    [{name:'呼和浩特'}, {name:'厦门'}],
    [{name:'呼和浩特'}, {name:'南昌'}],
    [{name:'呼和浩特'}, {name:'拉萨'}],
    [{name:'呼和浩特'}, {name:'长春'}],
    [{name:'呼和浩特'}, {name:'鄂尔多斯'}],
    [{name:'呼和浩特'}, {name:'重庆'}],
    [{name:'呼和浩特'}, {name:'哈尔滨'}]
];

countryData['包头'] = [
    [{name:'包头'}, {name:'上海'}],
    [{name:'包头'}, {name:'广州'}],
    [{name:'包头'}, {name:'大连'}],
    [{name:'包头'}, {name:'南宁'}],
    [{name:'包头'}, {name:'南昌'}],
    [{name:'包头'}, {name:'拉萨'}],
    [{name:'包头'}, {name:'长春'}],
    [{name:'包头'}, {name:'包头'}],
    [{name:'包头'}, {name:'重庆'}],
    [{name:'包头'}, {name:'常州'}]
];

countryData['鄂尔多斯'] = [
    [{name:'鄂尔多斯'}, {name:'呼和浩特'}],
    [{name:'鄂尔多斯'}, {name:'广州'}],
    [{name:'鄂尔多斯'}, {name:'大连'}],
    [{name:'鄂尔多斯'}, {name:'南宁'}],
    [{name:'鄂尔多斯'}, {name:'南昌'}],
    [{name:'鄂尔多斯'}, {name:'拉萨'}],
    [{name:'鄂尔多斯'}, {name:'长春'}],
    [{name:'鄂尔多斯'}, {name:'包头'}],
    [{name:'鄂尔多斯'}, {name:'重庆'}],
    [{name:'鄂尔多斯'}, {name:'常州'}]
];

var cityData = {};
cityData['呼和浩特'] = [
    [{name:'呼和浩特'}, {name:'鄂尔多斯'}],
    [{name:'呼和浩特'}, {name:'包头'}],
    [{name:'呼和浩特'}, {name:'呼伦贝尔'}],
    [{name:'呼和浩特'}, {name:'乌兰察布'}],
    [{name:'呼和浩特'}, {name:'巴彦淖尔'}],
    [{name:'呼和浩特'}, {name:'锡林浩特'}]
];
cityData['呼伦贝尔'] = [
    [{name:'呼伦贝尔'}, {name:'鄂尔多斯'}],
    [{name:'呼伦贝尔'}, {name:'包头'}],
    [{name:'呼伦贝尔'}, {name:'呼和浩特'}],
    [{name:'呼伦贝尔'}, {name:'乌兰察布'}],
    [{name:'呼伦贝尔'}, {name:'巴彦淖尔'}],
    [{name:'呼伦贝尔'}, {name:'锡林浩特'}]
];
cityData['包头'] = [
    [{name:'包头'}, {name:'鄂尔多斯'}],
    [{name:'包头'}, {name:'呼伦贝尔'}],
    [{name:'包头'}, {name:'呼和浩特'}],
    [{name:'包头'}, {name:'乌兰察布'}],
    [{name:'包头'}, {name:'巴彦淖尔'}],
    [{name:'包头'}, {name:'锡林浩特'}]
];
cityData['鄂尔多斯'] = [
    [{name:'鄂尔多斯'}, {name:'包头'}],
    [{name:'鄂尔多斯'}, {name:'呼伦贝尔'}],
    [{name:'鄂尔多斯'}, {name:'呼和浩特'}],
    [{name:'鄂尔多斯'}, {name:'乌兰察布'}],
    [{name:'鄂尔多斯'}, {name:'巴彦淖尔'}],
    [{name:'鄂尔多斯'}, {name:'锡林浩特'}]
];
geoCoordMap['青城公园'] = [111.67246, 40.813261];
geoCoordMap['万达广场'] = [111.741899, 40.843136];
geoCoordMap['海亮广场'] = [111.676714, 40.821762];
geoCoordMap['南湖湿地公园'] = [111.653511, 40.754903];
geoCoordMap['植物园'] = [111.650528, 40.81865];
geoCoordMap['大召寺'] = [111.660805, 40.805763];
geoCoordMap['蒙古风情园'] = [111.687278, 40.724045];
geoCoordMap['大青山野生动物园'] = [111.628565, 40.883344];
var areaData = {};
areaData['青城公园'] = [
    [{name: '青城公园'}, {name: '万达广场'}],
    [{name: '青城公园'}, {name: '海亮广场'}],
    [{name: '青城公园'}, {name: '南湖湿地公园'}],
    [{name: '青城公园'}, {name: '植物园'}],
    [{name: '青城公园'}, {name: '大召寺'}],
    [{name: '青城公园'}, {name: '大青山野生动物园'}]
];
areaData['海亮广场'] = [
    [{name: '海亮广场'}, {name: '万达广场'}],
    [{name: '海亮广场'}, {name: '南湖湿地公园'}],
    [{name: '海亮广场'}, {name: '青城公园'}],
    [{name: '海亮广场'}, {name: '植物园'}],
    [{name: '海亮广场'}, {name: '大召寺'}],
    [{name: '海亮广场'}, {name: '大青山野生动物园'}]
];
areaData['大召寺'] = [
    [{name: '大召寺'}, {name: '万达广场'}],
    [{name: '大召寺'}, {name: '南湖湿地公园'}],
    [{name: '大召寺'}, {name: '青城公园'}],
    [{name: '大召寺'}, {name: '植物园'}],
    [{name: '大召寺'}, {name: '海亮广场'}],
    [{name: '大召寺'}, {name: '大青山野生动物园'}]
];
areaData['蒙古风情园'] = [
    [{name: '蒙古风情园'}, {name: '万达广场'}],
    [{name: '蒙古风情园'}, {name: '青城公园'}],
    [{name: '蒙古风情园'}, {name: '南湖湿地公园'}],
    [{name: '蒙古风情园'}, {name: '植物园'}],
    [{name: '蒙古风情园'}, {name: '海亮广场'}]
];
areaData['大青山野生动物园'] = [
    [{name: '大青山野生动物园'}, {name: '万达广场'}],
    [{name: '大青山野生动物园'}, {name: '青城公园'}],
    [{name: '大青山野生动物园'}, {name: '南湖湿地公园'}],
    [{name: '大青山野生动物园'}, {name: '植物园'}],
    [{name: '大青山野生动物园'}, {name: '海亮广场'}]
];

var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};
var convertMigData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var fromCoord = [item.formJLongitude, item.formWLatitude];
        var toCoord = [item.toJLongitude, item.toWLatitude];
        if (fromCoord && toCoord) {
            res.push({
                fromName: item.formCityName,
                toName: item.toCityName,
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};
var geo = {
    map: 'china',
    label: {
        emphasis: {
            show: false
        }
    },
    roam: true,
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
var getChartSeries = (city, data) => {
    var lineColor = config.themeColor;
    var line1 = {
        name: city,
        coordinateSystem: 'bmap',
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
                color: lineColor,
                width: 0,
                curveness: 0.2
            }
        },
        data: convertData(data)
    };
    // 轨迹线
    var line2 = {
        name: city,
        type: 'lines',
        coordinateSystem: 'bmap',
        zlevel: 2,
        symbol: ['none', 'arrow'],
        symbolSize: 10,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
        },
        lineStyle: {
            normal: {
                color: lineColor,
                width: 2,
                opacity: 0.6,
                curveness: 0.2
            }
        },
        data: convertData(data)
    };
    var circle = {
        name: city,
        type: 'effectScatter',
        coordinateSystem: 'bmap',
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
        symbolSize: function (val) {
            return val[2] / 100;
        },
        itemStyle: {
            normal: {
                color: lineColor
            }
        },
        data: data.map(function (dataItem) {
            var value = dataItem[1].value || tool.getRandInt(300, 1800);
            return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([value])
            };
        })
    };
    return [line1, line2, circle];
};
var getMigSeries = (city, data) => {
    var lineColor = config.themeColor;
    var line1 = {
        name: city,
        coordinateSystem: 'bmap',
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
                color: lineColor,
                width: 0,
                curveness: 0.2
            }
        },
        data: convertMigData(data)
    };
    // 轨迹线
    var line2 = {
        name: city,
        type: 'lines',
        coordinateSystem: 'bmap',
        zlevel: 2,
        symbol: ['none', 'arrow'],
        symbolSize: 10,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
        },
        lineStyle: {
            normal: {
                color: lineColor,
                width: 2,
                opacity: 0.6,
                curveness: 0.2
            }
        },
        data: convertMigData(data)
    };
    var circle = {
        name: city,
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
            normal: {
                show: false,
                position: 'right',
                formatter: '{b}'
            }
        },
        symbolSize: function (val) {
            let min = 10;
            let max = 50;
            let r = Math.sqrt(val[2]) / 4;
            return Math.max(Math.min(r, max), min);
        },
        itemStyle: {
            normal: {
                color: lineColor
            }
        },
        data: data.map(function (dataItem) {
            var value = dataItem.visitorNum || tool.getRandInt(300, 1800);
            return {
                name: dataItem.toCityName,
                formCityName: dataItem.formCityName,
                value: [dataItem.toJLongitude, dataItem.toWLatitude, value]
            };
        })
    };
    return [line1, line2, circle];
};


let methods = {};
methods.getMigOption = function (config = {}) {
    var city = config.city;
    var option = {
        backgroundColor: '#404a59',
        tooltip : {
            trigger: 'item',
            confine: true,
            formatter: function (arg) {
                // LOG('args:', arg);
                var fromCity = arg.data.formCityName;
                var toCity = arg.name;
                var amount = arg.value ? arg.value[2] : null;
                if (!fromCity || !toCity) {
                    return null;
                }
                return fromCity + '->' + toCity +'：' + amount + '人';
            }
        },
        bmap: {
            center: geoCoordMap['呼和浩特'],
            zoom: config.zoom || 5,
            roam: 'move'
        },
        series: getMigSeries(city, config.data)
    };
    return option;
};

let computed = {};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            city: '呼和浩特'
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
    mixins: [],
    components: {}
};
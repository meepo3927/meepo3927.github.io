<template>
<div class="root-scenery-source">
    <img :src="backSrc1" class="back-1 back-img" ref="backImg1" />
    <img :src="backSrc2" class="back-2 back-img" ref="backImg2" />
    <img :src="backSrc3" class="back-3 back-img" ref="backImg3" />
    <!-- 景区来源 境外 -->
    <div class="chart-source-world ">
        <my-chart :o="oSourceWorld" theme="twelve" />
    </div>
    <!-- 景区来源 省内 -->
    <div class="chart-source-province ">
        <my-chart :o="oSourceProvince" theme="twelve" />
    </div>
    <!-- 景区来源 全国 -->
    <div class="chart-source">
        <my-chart :o="oSourceChina" />
    </div>
    <!-- 人数 -->
    <div class="province-num" v-show="provinceTotal">
        <span>省内来源：<em>{{provinceTotal}}</em>人</span>
    </div>
    <!-- back -->
    <a :href="sceneryUrl" class="l-link" v-show="chartReady">
        <img :src="lSrc" />
    </a>
</div>
</template>

<script>
require('root');
require('lib/geo/china.js');
require('lib/geo/neimenggu.js');
require('lib/geo/world.js');
require('lib/echarts_theme/twelve.js');
const echarts = require('echarts');
const URL = require('util/url.js');
const MDate = require('lib/mdate.js');
const chartUtil = require('util/chart.js');
const EchartUtil = require('util/echart.js');

var DateUtil = MDate.Util;
var userId = Config.user.id;
const MAP_CIRCLE_COLOR = '#00FFFD';
const MAP_AREA_COLOR = 'rgba(37, 90, 168, .7)';
const MAP_LINE_COLOR = '#94d1f1';

const sourceTooltipFormatter = (p) => {
    if (!p.value) {
        return;
    }
    if (p.value && p.value[2]) {
        return '来自' + p.name + '：' + p.value[2] + '人'
    }
    return '来自' + p.name + '：' + p.data + '人'
};

const titleTextStyle = {
    color: "#fff",
    fontFamily: "黑体",
    fontSize: 28,
    fontWeight: "normal"
};
let methods = {};
methods.getParam = function () {
    return [
        this.sceneryId, this.startDate, this.endDate, userId
    ];
};
// 景区来源
methods.renderSource = function () {
    // 全国来源
    Request.getAttractionSource(...this.getParam()).then((result) => {
        this.oSourceChina = this.getSourceChinaOption(result);
    }).catch((e) => {
        this.oSourceChina = 'empty';
        LOG(e);
    });
    // 境外来源
    Request.getAttractionSourceCountry(...this.getParam()).then((result) => {
        this.oSourceWorld = this.getSourceWorldOption(result);
        this.chartReady = true;
    }).catch((r) => {
        this.oSourceWorld = 'empty';
        this.chartReady = true;
    });
    // 省内来源
    Request.getAttractionSource2(...this.getParam()).then((result) => {
        this.oSourceProvince = this.getSourceProvinceOption(result);
    }).catch((r) => {
        this.oSourceProvince = 'empty';
    });
};
// 来源 全国
methods.getSourceChinaOption = function (result) {
    // 内蒙古，remove
    for (let i = result.length - 1; i >= 0; i--) {
        if (result[i].provinceName === '内蒙古') {
            result.splice(i, 1);
        }
    }
    let option = chartUtil.getAttractionSourceOption({
        data: result,
        title: '省外客流来源',
        subtitle: this.subtitle
    });
    option.legend = false;
    option.backgroundColor = {
        image: this.$refs.backImg1,
        repeat: 'no-repeat'
    };
    option.series[1].lineStyle.normal.color = MAP_CIRCLE_COLOR;
    option.series[2].itemStyle.normal.color = MAP_CIRCLE_COLOR;
    option.series[2].label.normal.color = '#FFF';
    option.series[2].symbolSize = (val) => {
        let min = 5;
        let max = 50;
        let size = Math.sqrt(val[2]) * 1;
        return Math.min(Math.max(size, min), max);
    };
    option.series[3].itemStyle.normal.color = new echarts.graphic.LinearGradient(
        0, 0, 1, 0,
        [
            {offset: 0, color: '#83bff6'},
            {offset: 0.5, color: '#188df0'},
            {offset: 1, color: '#188df0'}
        ]
    );
    option.series[3].label = {
        normal: {
            color: '#fff'
        }
    };
    return Tool.extend(option, {
        title: {
            top: 10,
            left: '39.7%',
            textStyle: {
                fontSize: 28
            }
        },
        tooltip: {
            formatter: sourceTooltipFormatter
        },
        geo: {
            left: '1%',
            height: '65%',
            itemStyle: {
                normal: {
                    areaColor: MAP_AREA_COLOR,
                    borderColor: MAP_LINE_COLOR
                }
            }
        },
        toolbox: false
    });
};
// 境外来源
methods.getSourceWorldOption = function (result) {
    let optionData = chartUtil.getSourceOptionData(result, {
        dataKey: 'provinceName'
    });
    let name = optionData.name;
    let title = {
        top: 10,
        left: '39.7%',
        text: '境外客流来源',
        textStyle: titleTextStyle
    };
    let tooltip = {
        trigger: 'item',
        formatter: sourceTooltipFormatter
    };
    let grid = [];
    var geo = {
        map: 'world',
        top: 5,
        height: '83%',
        center: [30.97, 29.71],
        roam: true,
        label: {},
        itemStyle: {
            normal: {
                areaColor: MAP_AREA_COLOR,
                borderColor: MAP_LINE_COLOR
            }
        }
    };
    let xAxis = {
        type: 'value',
        show: false
    };
    let yAxis = {
        type: 'category',
        show: false,
        data: optionData.yData
    };
    let series = [
        EchartUtil.getGeoSeries1(name, optionData.linesData),
        EchartUtil.getGeoSeries2(name, optionData.linesData),
        EchartUtil.getGeoSeries3(name, optionData.geoData)
    ];
    series[1].lineStyle.normal.color = MAP_CIRCLE_COLOR;
    series[2].itemStyle.normal.color = MAP_CIRCLE_COLOR;
    series[2].symbolSize = (val) => {
        let min = 10;
        let max = 60;
        let size = Math.sqrt(val[2]) * 3;
        return Math.min(Math.max(size, min), max);
    };
    let o = {
        backgroundColor: {
            image: this.$refs.backImg3,
            repeat: 'no-repeat'
        },
        title: title,
        tooltip,
        grid: grid,
        geo: geo,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
    }
    return o;
};
// 省内来源
methods.getSourceProvinceOption = function (result) {
    let total = 0;
    result.forEach((v) => {
        total += v.userNum;
    });
    this.provinceTotal = total;
    let optionData = chartUtil.getSourceOptionData(result, {
        dataKey: 'cityDesc'
    });

    let name = optionData.name;
    let title = {
        top: 10,
        left: '39.7%',
        text: '省内客流来源',
        textStyle: titleTextStyle
    };
    let tooltip = {
        trigger: 'item',
        formatter: sourceTooltipFormatter
    };
    let grid = [{
        top: 60,
        left: 20,
        height: '80%',
        containLabel: true
    }];
    var geo = {
        map: '内蒙古',
        top: 76,
        height: '78%',
        roam: true,
        label: {
        },
        itemStyle: {
            normal: {
                areaColor: MAP_AREA_COLOR,
                borderColor: MAP_LINE_COLOR
            }
        }
    };
    let xAxis = {
        type: 'value',
        show: false
    };
    let yAxis = {
        type: 'category',
        show: false,
        data: optionData.yData
    };
    let series = [
        EchartUtil.getGeoSeries1(name, optionData.linesData),
        EchartUtil.getGeoSeries2(name, optionData.linesData),
        EchartUtil.getGeoSeries3(name, optionData.geoData)
    ];
    series[1].lineStyle.normal.color = MAP_CIRCLE_COLOR;
    series[2].itemStyle.normal.color = MAP_CIRCLE_COLOR;
    series[2].symbolSize = (val) => {
        return Math.log(val[2]) * 3;
    };
    let o = {
        backgroundColor: {
            image: this.$refs.backImg2,
            repeat: 'no-repeat'
        },
        title: title,
        tooltip,
        grid: grid,
        geo: geo,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
    }
    return o;
};
methods.dump = function (o) {
    return JSON.parse(JSON.stringify(o));
};
let computed = {};
computed.backSrc1 = function () {
    return this.vImgPath + '/scenery_in_twelve/source_back_1.png';
};
computed.backSrc2 = function () {
    return this.vImgPath + '/scenery_in_twelve/source_back_2.png';
};
computed.backSrc3 = function () {
    return this.vImgPath + '/scenery_in_twelve/source_back_3.png';
};
computed.lSrc = function () {
    return this.vImgPath + '/scenery_in_twelve/l.png';
};
computed.sceneryUrl = function () {
    return Config.basePath + '/scenery_in_twelve?scenery_id=' + this.sceneryId;
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
    this.renderSource();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    var endDate = DateUtil.getDateOffset(new Date(), -1);
    var startDate = DateUtil.getDateOffset(endDate, -7);
    let o = {
        sceneryId: URL.query().scenery_id,
        startDate:  DateUtil.getYMD(startDate),
        endDate: DateUtil.getYMD(endDate),

        oSourceChina: undefined,
        oSourceWorld: undefined,
        oSourceProvince: undefined,

        chartReady: false,

        provinceTotal: 0
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {
        'my-chart': require('comp/common/my-chart.vue')
    }
};
</script>

<style scoped lang="less">
@ww:  480px;
@hh:  360px;
@t-pad:  10px;
.root-scenery-source {
}
.chart-source {
    position: absolute;
    top: @t-pad;
    left: 0;
    width: @ww * 2;
    height: @hh * 3 - @t-pad;
}
.chart-source-world,
.chart-source-province {
    position: absolute;
    left: @ww * 2;
    width: @ww * 2;
    
}
.chart-source-world {
    top: @hh * 1.5 + @t-pad - 1px;
    height: @hh * 1.5 - @t-pad - 2px;
}
.chart-source-province {
    top: @t-pad;
    height: @hh * 1.5;
}
.province-num {
    position: absolute;
    top: 95px;
    left: @ww * 2 + 24px;
    span {
        font-weight: bold;
        color: #00A0E9;
        font-size: 18px;
        em {
            font-size: 24px;
            color: #fff;
        }
    }
}
.my-chart {
    width: 100%;
    height: 100%;
}
.back-img {
    position: absolute;
    top: -10000px;
    left: -10000px;
}
.l-link {
    position: absolute;
    right: 44px;
    bottom: 24px;
    padding: 6px 10px;
    img {
        height: 32px;
    }
}
</style>

<style lang="less">
.body-scenery-source {
    background-color: #000;
}
</style>
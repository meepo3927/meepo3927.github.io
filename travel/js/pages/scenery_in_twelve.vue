<template>
<div class="root-scenery-in-twelve">
    <!-- 背景图 -->
    <img :src="cubeSrc1" class="back-cube-1 back-cube" 
        ref="cube1" />
    <img :src="cubeSrc2" class="back-cube-2 back-cube" 
        ref="cube2" />
    <img :src="cubeSrc3" class="back-cube-3 back-cube" 
        ref="cube3" />

    <!-- 大标题 -->
    <div class="top-title">
        <h1 v-text="topTitle"></h1>
    </div>
    <h2 class="sec-title sec-title-l">游客互联网偏好分析</h2>
    <!-- 实时人数 -->
    <h2 class="sec-title sec-title-m1">景区实时客流量</h2>
    <div class="realtime-user-num" v-if="userNumSpan">
        <span v-for="n in userNumSpan" v-text="n" class="common-verticle-rotate"
            :class="{rotating}"></span>
        <em>人</em>
    </div>
    <div class="chart-realtime">
        <my-chart :o="oRealtimeNum" theme="twelve" />
    </div>

    <h2 class="sec-title sec-title-r1">游客特征分析</h2>
    <a :href="twelveUrl" class="l-link">
        <img :src="lSrc" />
    </a>
    <a :href="sourceUrl" class="r-link">
        <img :src="rSrc" />
    </a>
    <!-- 性别 -->
    <h5 class="subtitle-gender sub-title">性别年龄</h5>
    <div class="chart-gender cell-1">
        <!-- 左 -->
        <div class="col-left">
            <div class="row-man" v-show="manPercent">
                <div class="v-pic"></div>
                <div class="v-num">
                    <h4>男</h4>
                    <span >{{manPercent}}%</span>
                </div>
            </div>
            <div class="row-woman" v-show="womanPercent">
                <div class="v-pic"></div>
                <div class="v-num">
                    <h4>女</h4>
                    <span>{{womanPercent}}%</span>
                </div>
            </div>
        </div>
        <!-- 右 -->
        <div class="col-right">
            <my-chart :o="oAge" theme="twelve" />
        </div>
    </div>
    <!-- 职业分析 -->
    <h5 class="subtitle-carrer sub-title">职业分析</h5>
    <div class="chart-carrer cell-1">
        <my-chart :o="oCarrer" theme="twelve" />
    </div>
    <!-- 旅游类APP -->
    <h5 class="subtitle-travelapp sub-title">景区游客旅游类APP</h5>
    <div class="chart-travelapp cell-1">
        <my-chart :o="oTravelApp" theme="twelve" />
    </div>
    <!-- 词云 -->
    <h5 class="subtitle-hotwords sub-title">游客搜索词云</h5>
    <div class="chart-hot-words cell-1">
        <canvas width="480" height="360" id="hotWordCanvas"></canvas>
        <div id="tags">
            <ul v-if="words">
                <li v-for="(v, i) in words">
                    <a href="javascript:;" v-text="v.text" 
                        :style="{fontSize: v.fontSize + 'px'}"></a>
                </li>
            </ul>
        </div>
    </div>
    <!-- 景区关联分析 -->
    <h2 class="sec-title sec-title-l2">景区关联分析</h2>
    <div class="chart-relation-link cell-1">
        <my-chart :o="oRelation" theme="relation"/>
    </div>
    <!-- 来源去向 -->
    <h2 class="sec-title sec-title-m2">游客来源去向分析</h2>
    <div class="chart-travel-path">
        <my-chart :o="oTravelPath" theme="twelve" />
    </div>
    <!-- 出行方式 -->
    <h5 class="subtitle-traffic-way sub-title">出行方式</h5>
    <div class="chart-traffic-way">
        <ul v-if="trafficWay">
            <li v-for="v in trafficWay">
                <span>{{v.name}} {{v.percent}}%</span>
                <strong><img :src="getTrafficSrc(v.icon)" /></strong>
                <em>{{v.value}}人</em>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
require('root');
require('lib/echarts_theme/twelve.js');
require('lib/echarts_theme/relation.js');
require('lib/tagcanvas.min.js');

const echarts = require('echarts');
const URL = require('util/url.js');
const MDate = require('lib/mdate.js');
const chartUtil = require('util/chart.js');
const EchartUtil = require('util/echart.js');
const MAIN_COLOR = '#00CEC9';
var DateUtil = MDate.Util;
var userId = Config.user.id;

const tagOptions = {
    textColour: '#ffffff',
    outlineColour: '#eeeeee',
    minBrightness: 0.5,
    reverse: true,
    depth: 0.8,
    maxSpeed: 0.03,
    minSpeed: 0.01,
    initial: [0.2, -0.2],
    wheelZoom: false,
    shadowBlur: 2,
    clickToFront: 500,
    fadeIn: 800,
    weight: true,
    weightMode: 'both',
    weightGradient: {0:'#EF7520', 0.3:'#fff'}
};
let methods = {};
methods.getParam = function () {
    return [
        this.sceneryId, this.startDate, this.endDate, userId
    ];
};
methods.getTrafficSrc = function (icon) {
    return this.vImgPath + '/scenery_in_twelve/' + icon + '.png';
};
methods.renderTop = function () {
    Request.getAttractionDetail(this.sceneryId).then((data) => {
        this.sceneryName = data.placeName;
        this.userNum = data.peopleNum;
    });
};
methods.renderHotWords = function (data) {
    let max = 1;
    data.forEach((v) => {
        max = Math.max(max, v.value);
    });
    this.words = data.map((v) => {
        return {
            text: v.name,
            fontSize: Math.round(v.value / max * 30)
        }
    });
    this.$nextTick(this.initHotCanvas);
};
methods.updateNum = function (peopleNum) {
    this.rotating = true;
    clearTimeout(this.rotateTimer);
    this.rotateTimer = setTimeout(() => {
        this.userNum = peopleNum;
        this.rotating = false;
    }, 650);
};
methods.loopRealtime = function () {
    clearTimeout(this.loopRealtimeTimer);
    Request.getAttractionDetail(this.sceneryId).then((data) => {
        let date = new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        this.oRealtimeNum.xAxis.data.push(
            Tool.padZero(hour) + ':' + Tool.padZero(minute)
        );
        let num = data.peopleNum;
        this.updateNum(data.peopleNum);
        this.oRealtimeNum.series[0].data.push(num);
        this.loopRealtimeTimer = setTimeout(this.loopRealtime, 5000);
    }).catch((e) => {
        this.loopRealtimeTimer = setTimeout(this.loopRealtime, 5000);
        LOG(e);
    });
};
methods.renderRealtime = function () {
    Request.getAttractionRealtime1(this.sceneryId).then((result) => {
        let option = chartUtil.getRealtimePeopleOption({
            data: result
        });
        option.backgroundColor = {
            image: this.$refs.cube2,
            repeat: 'no-repeat'
        };
        option.grid.top = 80;
        option.color = [MAIN_COLOR];
        option.series[0].lineStyle.normal.width = 2;
        option.series[0].areaStyle = {
            normal: {
                color: EchartUtil.getChartAreaGradient(MAIN_COLOR, '#000'),
                opacity: .75
            }
        },
        option.dataZoom.splice(2, 1);
        this.oRealtimeNum = option;
        this.loopRealtimeTimer = setTimeout(this.loopRealtime, 5000);
    }).catch((e) => {
        this.oRealtimeNum = 'empty';
    });
};
// 第一列
methods.renderCol1 = function () {
    let p1 = {
        start_date: this.startDate,
        end_date: this.endDate,
        user_id: userId,
        sumType: 0,
        scenery_id: this.sceneryId,
        dim: 'scenery'
    };
    Request.vwRptSceneryNetPreferDay(p1).then((result) => {
        this.oTravelApp = this.getTravelAppOption(result[2]);
        if (result[12]) {
            this.renderHotWords(result[12].chart);
        }
    }).catch(() => {
        this.oTravelApp = 'empty';
    });

    let p2 = {
        // start_date: '20190515',
        // end_date: '20190521',
        start_date: this.startDate.replace(/-/g, ''),
        end_date: this.endDate.replace(/-/g, ''),
        user_id: userId,
        sumType: 0,
        scenery_id: this.sceneryId,
        dim: 'scenery'
    };
    /*
    Request.vwRptSceneryNetPreferDay(p2).then((result) => {
        
    }).catch(() => {
    });
    */
};
// 景区关联, 来源去向
methods.renderRelation = function () {
    let p = {
        start_date: '20190609',
        //start_date: this.startDate.replace(/-/g, ''),
        scenery_ids: this.sceneryId
    };
    Request.getActionJSON('/v2/sceneryRelationAnalyze1', p).then((result) => {
        this.oRelation = this.getRelationOption(result);
    }).catch(() => {
        this.oRelation = 'empty';
    });

    let p2 = {
        start_date: '2019-06-09',
        // start_date: this.startDate,
        cycle: '1',
        scenery_ids: this.sceneryId
    };
    Request.getActionJSON('/v2/scenerySourceLeaveAnalyze', p2).then((result) => {
        this.oTravelPath = this.getSankeyOption(result);
    }).catch(() => {
        this.oTravelPath = 'empty';
    });
};
methods.getTrafficWay = function (list) {
    let iconMap = {
        '汽车': 'bus',
        '火车': 'train',
        '飞机': 'plane'
    };
    let total = 0;
    list.forEach((item) => {
        total += (item.value * 1);
    });
    return list.map((v) => {
        if (total === 0) {
            v.percent = 0;
        } else {
            v.percent = Math.round(v.value * 1000 / total) / 10;
        }
        v.icon = iconMap[v.name];
        return v;
    });
};
methods.renderGender = function (list) {
    let total = 0;
    let man = 0, woman = 0;
    list.forEach((v) => {
        total += (v.value * 1);
        if (~v.name.indexOf('男')) {
            man += (v.value * 1);
        } else if (~v.name.indexOf('女')) {
            woman += (v.value * 1);
        }
    });
    if (total === 0) {
        this.manPercent = 49;
        this.womanPercent = 51;
    } else {
        this.manPercent = Math.round(man * 100 / total);
        this.womanPercent = Math.round(woman * 100 / total);
    }
};
// 人物画像
methods.renderAvatar = function () {
    let p = {
        user_id: userId,
        deal_date: this.startDate,
        scenery_id: this.sceneryId,
        dim: 'scenery'
    };
    Request.vwRptSceneryUserLevDay(p).then((result) => {
        this.renderGender(result[0]);
        this.oAge = this.getAgeOption(result[1]);
        this.oCarrer = this.getCarrerOption(result[3]);
        this.trafficWay = this.getTrafficWay(result[5]);
    }).catch((e) => {
        this.oAge = 'empty';
        this.oCarrer = 'empty';
        LOG(e);
    });

};

methods.getTravelAppOption = function (data) {
    let itemStyle = {
        normal: {
            color: new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [
                    {offset: 0, color: '#111'},
                    //{offset: 0.5, color: '#188df0'},
                    {offset: 1, color: MAIN_COLOR}
                ]
            ),
            barBorderRadius: 50
        }
    };
    let list = data.chart.sort((a, b) => {
        return (a.value - b.value);
    });
    let backgroundColor = {
        image: this.$refs.cube1,
        repeat: 'no-repeat'
    };
    return {
        toolbox: false,
        backgroundColor,
        grid: {
            top: 76,
            left: 35,
            bottom: 5,
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisTick: {show: false},
            axisLabel: {show: false},
            axisLine: {show: false},
            splitLine: {show: false}
        },
        yAxis: {
            type: 'category',
            offset: 20,
            axisTick: {show: false},
            axisLine: {show: false},
            axisLabel: {
                interval: 0
            },
            data: list.map((v) => v.name)
        },
        series: [EchartUtil.getBarSeries({
            name: this.name || '数量',
            data: list.map((v) => v.value),
            label: {
                normal: {
                    show: true,
                    formatter: '{c}人'
                }
            },
            barMaxWidth: 20,
            itemStyle
        })]
    };
};
methods.getRelationOption = function (result) {
    let categories = result.categories;
    result.data = result.data.sort((a, b) => {
        return (a.value > b.value) ? -1 : 1;
    }).slice(0, 12);
    let minSize = result.data[result.data.length - 1].symbolSize;
    let secondSize = 0;
    // 尺寸
    result.data = result.data.map((v, i) => {
        v.symbolSize = v.symbolSize / 3;
        v.symbolSize -= (minSize / 4);
        v.symbolSize = Math.max(20, v.symbolSize);
        if (i > 0 && v.symbolSize > secondSize) {
            secondSize = v.symbolSize;
        }
        return v;
    });
    result.data[0].symbolSize = secondSize * 1.5;
    let option = chartUtil.getGraphOption({
        backgroundColor: {
            image: this.$refs.cube1,
            repeat: 'no-repeat'
        },
        tooltip: {
            confine: true
        },
        series: [{
            //layout: 'circular',
            name: '景区关联',
            categories,
            force: {
                repulsion: 200,
                edgeLength: [100, 180],
                layoutAnimation: true
            }
        }]
    }, result);

    return option;
};
methods.getSankeyOption = function (data) {
    let links = data.links;
    let sourceMap = {};
    for (let i = links.length - 1; i >= 0; i--) {
        let item = links[i];
        sourceMap[item.source] = 1;
        if (item.source === item.target) {
            links.splice(i, 1);
        }
    }

    let nodes = data.nodes.map(v => {
        let position = 'left';
        if (sourceMap[v.name]) {
            position = 'right';
        }
        v.label = {
            normal: {position}
        };
        return v;
    });
    let backgroundColor = {
        image: this.$refs.cube3,
        repeat: 'no-repeat'
    };
    return {
        backgroundColor,
        color: [
            '#3694EE', '#4CBEBF', '#E7C557',
            MAIN_COLOR, '#FF7739', '#94C84A', '#3694EE', '#4CBEBF', '#E7C557'
        ],
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: {
            type: 'sankey',
            layout: 'none',
            label: {
                normal: {
                    color: '#eee'
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: '#fff'
                }
            },
            lineStyle: {
                normal: {
                    color: '#159EE1',
                    opacity: 0.5,
                    curveness: 0.5
                }
            },
            top: 60,
            left: 30,
            right: 60,
            bottom: 30,
            data: nodes,
            links: data.links
        }
    };
};
methods.getAgeOption = function (data) {
    const COLOR_ARR = [
        '#20BF64',
        '#0BB3E0', '#0BB3E0',
        '#159EE1',
        '#E4CD2C',
        '#DC573C'
    ];
    data = data.filter((v) => {
        return (v.value) && (v.name);
    });
    data.sort((a, b) => {
        if (~a.name.indexOf('下')) {
            return 1;
        } else if (~b.name.indexOf('下')) {
            return -1;
        }
        return (a.name > b.name) ? -1 : 1;
    });
    let max = 1;
    data.forEach((item) => {
        max = Math.max(max, item.value);
    });
    const dataCallback = (v, i) => {
        return {
            value: v.value,
            itemStyle: {
                normal: {
                    color: COLOR_ARR[i]
                }
            }
        };
    };
    const barMaxWidth = 15;
    let option = {
        tooltip: {},
        xAxis: {
            type: 'value',
            show: false
        },
        grid: {
            left: 10,
            top: 30,
            bottom: 0,
            containLabel: true
        },
        yAxis: {
            type: 'category',
            axisLine: {show: false},
            axisTick: {show: false},
            data: data.map(v => v.name)
        },
        series: [{
            type: 'bar',
            itemStyle: {
                normal: {color: '#074183'}
            },
            barGap:'-100%',
            barCategoryGap:'40%',
            barMaxWidth,
            data: data.map(v => max * 1.2),
            animation: false,
            silent: true
        },{
            type: 'bar',
            barMaxWidth,
            label: {
                normal: {
                    show: false,
                    position: 'right',
                    formatter: '{c}人'
                }
            },
            data: data.map(dataCallback)
        }]
    };
    return option;
};
methods.getCarrerOption = function (data) {
    let backgroundColor = {
        image: this.$refs.cube1,
        repeat: 'no-repeat'
    };
    return {
        backgroundColor,
        color: ['#00CCC7'],
        tooltip: {
            trigger: 'item'
        },
        grid: {
            left: 0,
            right: 10
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0
            },
            data: data.map(v => v.name)
        },
        yAxis: {
            show: false,
            type: 'value'
        },
        series: {
            type: 'bar',
            barMaxWidth: 24,
            label: {
                normal: {
                    position: 'top',
                    formatter: '{c}人',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: [18, 18, 0, 0]
                }
            },
            data: data.map(v => v.value)
        }
    };
};
methods.initHotCanvas = function () {
    TagCanvas.Start('hotWordCanvas', 'tags', tagOptions);
};
methods.renderAll = function () {
    this.renderTop();
    this.renderRealtime();
    this.renderCol1();
    this.renderRelation();
    this.renderAvatar();
};
methods.dump = function (o) {
    return JSON.parse(JSON.stringify(o));
};
let computed = {};
computed.subtitle = function () {
    return '';
};
computed.topTitle = function () {
    if (!this.sceneryName) {
        return '';
    }
    return this.sceneryName + '分析大屏';
};
computed.userNumSpan = function () {
    if (this.userNum) {
        let arr = (this.userNum + '').split('');
        if (arr.length) {
            return arr;
        }
    }
};
computed.cubeSrc1 = function () {
    return this.vImgPath + '/scenery_in_twelve/cube_1.png';
};
computed.cubeSrc2 = function () {
    return this.vImgPath + '/scenery_in_twelve/cube_2.png';
};
computed.cubeSrc3 = function () {
    return this.vImgPath + '/scenery_in_twelve/cube_3.png';
};
computed.lSrc = function () {
    return this.vImgPath + '/scenery_in_twelve/l.png';
};
computed.rSrc = function () {
    return this.vImgPath + '/scenery_in_twelve/r.png';
};
computed.twelveUrl = function () {
    return Config.basePath + '/twelve';
};
computed.sourceUrl = function () {
    return Config.basePath + '/scenery_source?scenery_id=' + this.sceneryId;
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
    this.renderAll();
};
const beforeDestroy = function () {
    clearTimeout(this.loopRealtimeTimer);
};
const dataFunc = function () {
    var endDate = DateUtil.getDateOffset(new Date(), -1);
    var startDate = DateUtil.getDateOffset(endDate, -7);
    let o = {
        sceneryName: '',
        userNum: '',
        sceneryId: URL.query().scenery_id,
        startDate:  DateUtil.getYMD(startDate),
        endDate: DateUtil.getYMD(endDate),
        oRealtimeNum: undefined,
        oTravelApp: undefined,
        oRelation: undefined,
        oCarrer: undefined,
        oAge: undefined,
        oTravelPath: undefined,
        trafficWay: [],
        words: undefined,
        womanPercent: '',
        manPercent: '',

        rotating: false
    };
    return o;
};
module.exports = {
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
.root-scenery-in-twelve {
    height: 100%;
}
.back-cube {
    position: absolute;
    z-index: 100;
    top: -10000px;
    left: -10000px;
}
.back-cube-1 {
}
.top-title {
    position: absolute;
    top: 0;
    left: 50%;
    width: 680px;
    margin-left: -380px;
    background: url("../../images/scenery_in_twelve/top_title_bg.png") no-repeat center center;
    background-size: 100% 100%;
    color: #fff;
    h1 {
        font-weight: normal;
        width: 100%;
        text-align: center;
        font-size: 36px;
        height: 91px;
        line-height: 83px;
        margin: 0;
    }
}
.cell-1 {
    width: @ww;
    height: @hh - 2px;
}
.sec-title-m1 {
    top: 116px;
    left: @ww;
}
.chart-realtime {
    position: absolute;
    width: @ww * 2;
    height: @hh * 2 - 120px;
    top: 120px;
    left: @ww;
}
.sec-title-r1 {
    top: 5px;
    left: @ww * 3;
}
.subtitle-gender {
    top: 60px;
    left: @ww * 3;
}
.chart-gender {
    position: absolute;
    top: 80px;
    left: @ww * 3;
    height: @hh - 80px;
    padding-top: 20px;
    padding-left: 25px;
}
.chart-gender .col-left {
    padding-top: 30px;
    float: left;
    width: 33%;
    .row-man, .row-woman {
        .v-pic {
            display: inline-block;
            width: 82px;
            height: 82px;
            vertical-align: -18px;
        }
        .v-num {
            margin-left: 10px;
            color: #fff;
            display: inline-block;
            text-align: center;
            h4 {
                margin-top: 5px;
                margin-bottom: 12px;
            }
            span {}
        }
    }
    .row-man {
        padding-top: 1px;
        .v-pic {
            background: url("../../images/scenery_in_twelve/man.png") no-repeat center center;
            background-size: 100% 100%;
        }
    }
    .row-woman {
        padding-top: 1px;
        margin-top: 10px;
        .v-pic {
            background: url("../../images/scenery_in_twelve/woman.png") no-repeat center center;
            background-size: 100% 100%;
        }
    }
}
.chart-gender .col-right {
    float: left;
    width: 65%;
    height: 94%;
}
.subtitle-travelapp {
    top: @hh + 30px;
    left: 0;
}

.chart-travelapp {
    position: absolute;
    top: @hh;
    left: 0;
}
.subtitle-hotwords {
    top: 60px;
    left: 0;
}
.chart-hot-words {
    position: absolute;
    top: 60px;
    left: 0;
    height: @hh - 60px;
    overflow: hidden;
    font-size: 0;
}
.chart-relation-link {
    position: absolute;
    top: @hh * 2 + 40px;
    left: 0;
    height: @hh - 40px;
}
.subtitle-carrer {
    top: @hh + 30px;
    left: @ww * 3;
}
.chart-carrer {
    position: absolute;
    top: @hh;
    left: @ww * 3;
}
.subtitle-traffic-way {
    top: @hh * 2 + 20px;
    left: @ww * 3;
}
.chart-traffic-way {
    position: absolute;
    top: @hh * 2 + 70px;
    left: @ww * 3;
    width: @ww;
    height: @hh - 71px;
    background: url("../../images/scenery_in_twelve/cube_1.png") no-repeat 0 0;
}

.chart-traffic-way ul {
    padding: 15px 1px 1px 30px;
    & > li {
        display: block;
        border-bottom: 1px dashed #ddd;
        padding: 1px 0 15px 15px;
        margin: 15px 30px 30px 10px;
    }
    & > li:nth-child(1) {
        color: #A94243;
    }
    & > li:nth-child(2) {
        color: #F27A03;
    }
    & > li:nth-child(3) {
        color: #4B91B1;
        border-bottom: none;
        margin-bottom: 0;
    }
    
    & > li > span {
        display: inline-block;
        width: 100px;
    }
    & > li > strong {
        margin-left: 30px;
        vertical-align: -20px;
        display: inline-block;
        width: 100px;
        text-align: center;
        img {
        }
    }
    & > li > em {
        margin-left: 70px;
        color: #eee;
    }
}
.sec-title-m2 {
    top: @hh * 2;
    left: @ww;
}
.chart-travel-path {
    position: absolute;
    width: @ww * 2;
    height: @hh;
    top: @hh * 2;
    left: @ww;
}
.sec-title-l {
    top: 5px;
    left: 10px;
}
.sec-title-l2 {
    top: @hh * 2;
    left: 10px;
}
.sec-title {
    position: absolute;
    height: 40px;
    line-height: 35px;
    font-size: 24px;
    font-weight: normal;
    color: #fff;
    background: url("../../images/scenery_in_twelve/sub_title_bottom.png") no-repeat left bottom;
    z-index: 20;
}
.sub-title {
    position: absolute;
    width: @ww;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: normal;
    background: url("../../images/scenery_in_twelve/sub_title_bg.png") no-repeat center center;
    text-align: center;
    color: #fff;
    z-index: 20;
}
.realtime-user-num {
    position: absolute;
    width: 420px;
    top: 120px;
    left: 3 * @ww - 470px;
    text-align: right;
    color: #fff;
    z-index: 20;
    span {
        display: inline-block;
        font-weight: bold;
        font-size: 36px;
        width: 38px;
        height: 53px;
        line-height: 52px;
        background: url("../../images/scenery_in_twelve/num_bg.png") no-repeat 0 0;
        text-align: center;
        margin-right: 8px;
    }
    em {
        font-size: 24px;
        vertical-align: 3px;
    }
}
.l-link,
.r-link {
    position: absolute;
    right: 2px;
    padding: 6px 10px;
    z-index: 30;
    img {
        height: 32px;
    }
}
.l-link {
    top: 2px;
}
.r-link {
    bottom: 2px;
}
.my-chart {
    width: 100%;
    height: 100%;
}
#tags {
    opacity: 0;
}
</style>

<style lang="less">
.body-scenery-in-twelve {
    background-color: #000;
}
</style>
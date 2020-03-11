<template>
<center-layer class="community-chart-layer">
    <div class="center-layer-inner">
        <a href="javascript:;" @click="close" class="my-close-btn" title="关闭">
            <i class="iconfont icon-guanbi"></i>
        </a>

        <!-- 头部 -->
        <div class="v-head clearfix">
            <h2>
                <i class="iconfont icon-xiaoqu"></i> {{lacName}}
            </h2>
            <ul v-if="kpiList">
                <li v-for="(v, i) in kpiList">
                    <div class="v-content">
                        <div v-text="v.value"></div>
                        <label v-text="v.name"></label>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 图表 -->
        <div class="v-body">
            <h3>业务特征</h3>
            <div class="chart-row chart-row-1">
                <div class="chart-1"><my-chart :o="o1" theme="community"/></div>
                <div class="chart-2"><my-chart :o="o2" theme="community"/></div>
                <div class="chart-3"><my-chart :o="o3" theme="community"/></div>
            </div>
            <h3>时间特征</h3>
            <div class="chart-row chart-row-2">
                <div class="chart-4"><my-chart :o="o4" theme="community"/></div>
                <div class="chart-5"><my-chart :o="o5" theme="community"/></div>
            </div>
        </div>
    </div>
</center-layer>
</template>

<script>
let methods = {};
methods.close = function () {
    this.$emit('close');
};
methods.fetchRender = function () {
    let p = {lacId: this.cid};
    this.o1 = null;
    this.o2 = null;
    this.o3 = null;
    this.o4 = null;
    this.o5 = null;
    this.lacName = '';
    this.vRequest.fetch2('/broadband/attackAndDefenseGuide', p).then((data) => {
        // KPI
        const baseInfo = data.lacBaseInfo || {};
        this.lacName = baseInfo.LAC_NAME;
        this.kpiList = [
            {"name": "潜在家宽", "value": baseInfo.POTENTIAL_HOME_BD},
            {"name": "DOU", "value": baseInfo.DOU + 'G'},
            {"name": "家庭ARPU", "value": baseInfo.HOME_ARPU + '元'},
            {"name": "个人ARPU", "value": baseInfo.PERSON_ARPU + '元'}
        ];
        // 资费排行
        if (data.feeRank) {
            this.o1 = this.getOption1(data.feeRank);
        } else {
            this.o1 = 'empty';
        }
        // 年龄
        if (data.ageComposition) {
            this.o2 = this.getOption2(data.ageComposition);
        } else {
            this.o2 = 'empty';
        }
        // 职业
        if (data.jobComposition) {
            this.o3 = this.getOption3(data.jobComposition);
        } else {
            this.o3 = 'empty';
        }
        
        // 周
        if (data.lacWeekUserNum) {
            this.o4 = this.getOption4(data.lacWeekUserNum);
        } else {
            this.o4 = 'empty';
        }

        // 日
        if (data.lacDayUserNum) {
            this.o5 = this.getOption5(data.lacDayUserNum);
        } else {
            this.o5 = 'empty';
        }
    }).catch(() => {
        this.o5 = this.o4 = this.o3 = this.o2 = this.o1 = 'empty';
    });

};
methods.getOption1 = function (data) {
    data.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1;
    });
    return {
        color: ['#333', '#8DC6FF'],
        title: {
            text: '资费排行'
        },
        xAxis: {
            type: 'value',
            show: false
        },
        grid: {
            top: this.GRID_BAR_TOP_TITLE,
            left: this.GRID_BAR_LEFT,
            right: this.GRID_BAR_RIGHT + 5,
            bottom: this.GRID_BAR_BOTTOM,
            containLabel: true
        },
        yAxis: {
            type: 'category',
            axisTick: {show: false},
            data: [5,4,3,2,1]
        },
        series: [this.getBarSeries({
            data: [0,0,0,0,0],
            label: {
                show: true,
                position: 'right',
                formatter: (p) => {
                    //LOG(p);
                    return data[p.dataIndex].name;
                }
            }
        }),this.getBarSeries({
            data: data.map(v => v.value),
            label: {
                show: true,
                position: 'right',
                formatter: (p) => {
                    return p.value + '%';
                }
            }
        })]
    }
};
methods.getOption2 = function (data) {
    return {
        title: {
            text: '年龄构成'
        },
        tooltip: this.getPieTooltip(),
        series: this.getPieSeries({
            data
        })
    }
};
methods.getOption3 = function (data) {
    return {
        title: {text: '职业构成'},
        
        tooltip: this.getBarTooltip(),
        xAxis: {
            type: 'category',
            data: data.map(v => v.name),
            axisLabel: {
                interval: 0,
                rotate: 20,
                align: 'center',
                margin: 22
            }
        },
        grid: {
            top: this.GRID_BAR_TOP_TITLE + 20,
            left: this.GRID_BAR_LEFT,
            right: this.GRID_BAR_RIGHT - 8,
            bottom: this.GRID_BAR_BOTTOM,
            containLabel: true
        },
        yAxis: {
            type: 'value',
            name: '(人)'
        },
        series: this.getBarSeries({
            data: data.map(v => v.value),
            label: {
                show: true
            }
        })
    }
};
methods.getOption4 = function (data) {
    return {
        title: {text: '小区每周客流分析'},
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: this.GRID_BAR_TOP_TITLE + 20,
            left: this.GRID_BAR_LEFT,
            right: this.GRID_BAR_RIGHT,
            bottom: this.GRID_BAR_BOTTOM + 10,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.map(v => v.name)
        },
        yAxis: {
            type: 'value',
            name: '(人)'
        },
        series: {
            type: 'line',
            markPoint: this.getMinMaxMarkPoint(),
            markLine: this.getAverageMarkLine(),
            areaStyle: {
                color: this.getChartAreaGradient(this.vConfig.themeColor)
            },
            smooth: true,
            data: data.map(v => v.value)
        }
    }
};
methods.getOption5 = function (data) {
    return {
        title: {text: '小区每日客流分析'},
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: this.GRID_BAR_TOP_TITLE + 20,
            left: this.GRID_BAR_LEFT,
            right: this.GRID_BAR_RIGHT + 15,
            bottom: this.GRID_BAR_BOTTOM + 10,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            name: '(时)',
            data: data.map(v => v.name)
        },
        yAxis: {
            type: 'value',
            name: '(人)'
        },
        series: {
            type: 'line',
            smooth: true,
            markPoint: this.getMinMaxMarkPoint(),
            markLine: this.getAverageMarkLine(),
            areaStyle: {
                color: this.getChartAreaGradient(this.vConfig.themeColor)
            },
            data: data.map(v => v.value)
        }
    }
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
let watch = {};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        o1: null,
        o2: null,
        o3: null,
        o4: null,
        o5: null,
        lacName: '',
        kpiList: undefined
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['cid'],
    mounted,
    mixins: [
        require('mixins/echarts_mix.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
@chart-pad:  5px;
.center-layer-inner {
    position: relative;
    width: 84vw;
}
.my-close-btn {
    position: absolute;
    top: 12px;
    right: 8px;
    padding: 12px;
    i {
        font-size: 22px;
    }
}
.v-head {
    border-bottom: 1px solid @theme-color;
    background-color: #fff;
    padding: 10px 8px 4px 25px;
    border-radius: 6px 6px 0 0;
    height: 77px;
}
.v-head > h2 {
    font-size: 20px;
    float: left;
    i {
        color: @theme-color;
        font-size: 22px;
    }
}
.v-head > ul {
    float: left;
    margin-left: 50px;
    margin-right: 20px;
    li {
        display: inline-block;
        width: 12vw;
        padding: 10px 1px;
        & > .v-content {
            text-align: center;
            border-right: 2px solid @theme-color;
            & > div {
                color: #F36A5C;
                font-size: 16px;
                font-weight: bold;
            }
            & > label {
                white-space: nowrap;
                font-size: 13px;
            }
        }
        &:nth-child(1) > .v-content {
            border-left: 2px solid @theme-color;
        }
    }
}
.v-body {
    padding: 10px;
    background-color: #F7F7F7;
    h3 {
        font-size: 16px;
        border-left: 4px solid @theme-color;
        height: 14px;
        line-height: 14px;
        padding-left: 12px;
        margin: 10px 0 12px 20px;
    }
    .chart-row {
        margin: 0 20px 15px 20px;
        font-size: 0;
    }
    .chart-1, .chart-2, .chart-3 {
        display: inline-block;
        width: 33.3%;
        height: 240px;
    }
    .chart-1 {
        padding-right: @chart-pad * 2;
    }
    .chart-2 {
        padding-left: @chart-pad;
        padding-right: @chart-pad;
    }
    .chart-3 {
        padding-left: @chart-pad * 2;
    }
    .chart-4, .chart-5 {
        display: inline-block;
        width: 50%;
        height: 240px;
    }
    .chart-4 {
        padding-right: 7px;
    }
    .chart-5 {
        padding-left: 7px;
    }
}

</style>

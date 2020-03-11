<template>
<div class="page-action-analysis m-container">
    <page-title main="策略库" sub="分场景的行为分析" />
    <!-- tab按钮 -->
    <tab-btn-group class="mt30" list="查询条件" />
    <!-- 筛选区域 -->
    <div class="panel p20">
        <div class="m-row-mid-auto">
            <div class="pl5">日期：</div>
            <div class="pl20">
                <vue-date class="form-control date-input" v-model="date" />
            </div>
            <div class="pl25">热门区域：</div>
            <div class="pl20">
                <select class="form-control area-sel" v-model="areaName">
                    <option v-for="o in areaOptions" v-text="o.name"></option>
                </select>
            </div>
            
            <div class="pl15">
                <button class="btn btn-primary" type="button"
                    @click="fetchRender">查询</button>
            </div>
        </div>
    </div><!-- panel -->

    <!-- 图表1 -->
    <div class="panel panel-info">
        <div class="panel-heading">
            <span>该区域当日手机上网流量分析</span>
            <em v-text="areaInfo"></em>
        </div>
        <div class="panel-body clearfix chart-section-1">
            <div class="v-left">
                <div class="chart-1"><my-chart :o="o1" /></div>
            </div>
            <div class="v-right">
                <div class="chart-2"><my-chart :o="o2" /></div>
            </div>
        </div>
    </div>
    <!-- 图表2 -->
    <div class="panel panel-info">
        <div class="panel-heading">
            <span>该区域当日语音通话分析</span>
            <em v-text="areaInfo"></em>
        </div>
        <div class="panel-body clearfix chart-section-2">
            <div class="v-left">
                <div class="chart-1"><my-chart :o="o3" /></div>
            </div>
            <div class="v-right">
                <div class="chart-2"><my-chart :o="o4" /></div>
            </div>
        </div>
    </div>

    <!-- 图表3 -->
    <div class="panel panel-info">
        <div class="panel-heading">
            <span>该区域当日APP/网站访问分析</span>
            <em v-text="areaInfo"></em>
        </div>
        <div class="panel-body clearfix chart-section-3">
            <div class="v-left">
                <div class="chart-1"><my-chart :o="o5" /></div>
            </div>
            <div class="v-right">
                <div class="chart-2"><my-chart :o="o6" /></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
const request = require('util/request.js');
const calendar = require('util/calendar.js');
const tool = require('util/tool.js');
const getToolBox = () => {
    return {
        right: 30,
        feature: {
            saveAsImage: {},
            dataView: {}
        }
    }
};
let methods = {};
methods.getAreaInfo = function () {
    return this.areaName + ' ' + this.date;
};
methods.getOption1 = function (data) {
    if (!data.length) {
        return 'empty';
    }
    data.sort((a, b) => {
        return (a.level > b.level) ? 1 : -1
    });
    return {
        legend: {
            data: data.map(v => v.name),
            bottom: 15
        },
        tooltip: this.getPieTooltip(),
        toolbox: getToolBox(),
        series: this.getPieSeries({
            radius: [60, 90],
            center: ['50%', '45%'],
            data,
            label: {
                normal: {
                    formatter: '{b}:{c}人\n({d}%)'
                }
            }
        })
    }
};
methods.getOption2 = function (data) {

    return {
        tooltip: this.getBarTooltip(),
        legend: {
            bottom: 15,
            data: data.dataFields
        },
        toolbox: getToolBox(),
        grid: {
            left: 15,
            right: 35,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            name: '时',
            data: data.data0
        },
        yAxis: {
            name: '人数',
            type: 'value'
        },
        series: data.dataFields.map((v, i) => {
            let j = i + 1;
            return this.getBarSeries({
                name: v,
                stack: 'all',
                data: data['data' + j]
            })
        })
    }
};
methods.getOption5 = function (data) {
    data.sort((a, b) => {
        return (a.sum_num > b.sum_num) ? 1 : -1
    });
    return {
        title: {
            text: '热门APP排行',
            top: 5,
            left: 'center'
        },
        tooltip: this.getBarTooltip(),
        toolbox: getToolBox(),
        grid: {
            left: 15,
            bottom: 25,
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '人数'
        },
        yAxis: {
            type: 'category',
            data: data.map(v => v.busi_title)
        },
        series: this.getBarSeries({
            name: '访问人数',
            data: data.map(v => v.sum_num)
        })
    }
};
methods.getOption6 = function (data) {
    data.sort((a, b) => {
        return (a.sum_num > b.sum_num) ? 1 : -1
    });
    return {
        title: {
            text: '热门网站排行',
            top: 5,
            left: 'center'
        },
        tooltip: this.getBarTooltip(),
        toolbox: getToolBox(),
        grid: {
            left: 15,
            bottom: 25,
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '人数'
        },
        yAxis: {
            type: 'category',
            data: data.map(v => v.busi_title)
        },
        series: this.getBarSeries({
            name: '访问人数',
            data: data.map(v => v.sum_num)
        })
    }
};
methods.fetchRender = function () {
    this.areaInfo = this.getAreaInfo();
    let p = this.ajaxParam;
    let req1 = request.fetch2('/areaBehavior/pieGPRS', p);
    this.o1 = null;
    this.setPromise('pieGPRS', req1).then((data) => {
        this.o1 = this.getOption1(data);
    }).catch(() => {
        this.o1 = 'empty';
    });

    let req2 = request.fetch2('/areaBehavior/barGPRS', p);
    this.o2 = null;
    this.setPromise('barGPRS', req2).then((data) => {
        this.o2 = this.getOption2(data);
    }).catch(() => {
        this.o2 = 'empty';
    });

    let req3 = request.fetch2('/areaBehavior/pieGSM', p);
    this.o3 = null;
    this.setPromise('pieGSM', req3).then((data) => {
        this.o3 = this.getOption1(data);
    }).catch(() => {
        this.o3 = 'empty';
    });

    let req4 = request.fetch2('/areaBehavior/barGSM', p);
    this.o4 = null;
    this.setPromise('barGSM', req4).then((data) => {
        this.o4 = this.getOption2(data);
    }).catch(() => {
        this.o4 = 'empty';
    });

    let req5 = request.fetch2('/areaBehavior/hotAPP', p);
    this.o5 = null;
    this.setPromise('hotAPP', req5).then((data) => {
        this.o5 = this.getOption5(data);
    }).catch(() => {
        this.o5 = 'empty';
    });

    let req6 = request.fetch2('/areaBehavior/hotWeb', p);
    this.o6 = null;
    this.setPromise('hotWeb', req6).then((data) => {
        this.o6 = this.getOption6(data);
    }).catch(() => {
        this.o6 = 'empty';
    });
};
let computed = {};
computed.ajaxParam = function () {
    return {
        calDate: this.date.replace(/-/g, ''),
        areaName: this.areaName
    };
};

let watch = {};
const created = function () {};
const mounted = function () {
    this.vRequest.fetch2('/heatArea/query').then((data) => {
        this.areaOptions = data;
        this.areaName = data[0].name;
        this.fetchRender();
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        date: calendar.getOffsetStr(new Date, -1),
        areaName: '',
        areaOptions: [],
        areaInfo: '',
        o1: null,
        o2: null,
        o3: null,
        o4: null,
        o5: null,
        o6: null
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
    mixins: [
        require('mixins/request_mix.js'),
        require('mixins/echarts_mix.js')
    ],
    beforeDestroy,
    components: {
        'tab-btn-group': require('comp/tab_btn_group.vue')
    }
};
</script>

<style scoped lang="less">
@chart-height-1:   320px;
.page-hot-content {
}
select.type-sel {
    width: 120px;
}
.date-input {
    width: 120px;
}
.panel-heading {
    & > span {
        font-size: 16px;
        color: #333;
    }
    & > em {
        color: #777;
        font-size: 13px;
        font-style: normal;
    }
}
.chart-section-1,
.chart-section-2 {
    & > .v-left {
        float: left;
        width: 33%;
    }
    & > .v-right {
        float: left;
        width: 66%;
    }
    .chart-1 {
        height: @chart-height-1;
    }
    .chart-2 {
        height: @chart-height-1;
    }
}
.chart-section-3 {
    & > .v-left {
        float: left;
        width: 49%;
    }
    & > .v-right {
        float: left;
        margin-left: 1%;
        width: 49%;
    }
    .chart-1, .chart-2 {
        height: @chart-height-1 + 100px;
    }
}
</style>

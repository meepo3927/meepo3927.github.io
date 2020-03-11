<template>
<div class="page-terminal-count m-container">
    <page-title main="知识图谱" sub="终端销量" />
    <!-- tab按钮 -->
    <tab-btn-group class="mt30" list="筛选条件" />
    <!-- 筛选区域 -->
    <div class="panel p20">
        <div class="m-row-mid-auto">
            <div class="pl5">日期：</div>
            <div class="pl15">
                <vue-date format="YYYY-MM" class="form-control date-input" 
                    v-model="startDate" />
            </div>
            <div class="ph15" >至</div>
            <div class="">
                <vue-date format="YYYY-MM" class="form-control date-input" 
                    v-model="endDate" />
            </div>

            <div class="pl25">
                <button class="btn btn-primary" type="button"
                    @click="fetchRender">查询</button>
            </div>
        </div>
    </div><!-- 筛选 -->
    <div class="chart-section clearfix">
        <div class="v-left">
            <div class="chart-1"><my-chart :o="o1" /></div>
        </div>
        <div class="v-right">
            <div class="chart-2"><my-chart :o="o2" /></div>
        </div>
    </div>
</div>
</template>

<script>
const calendar = require('util/calendar.js');
const tool = require('util/tool.js');

let methods = {};
methods.getOption1 = function (data) {
    data = data.map(v => {
        return {
            name: v.termBrand.trim(),
            value: v.termBrandXl
        }
    });
    return {
        title: {
            text: '终端销量占比',
            top: 25,
            left: 'center'
        },
        backgroundColor: '#ffffff',
        tooltip: this.getPieTooltip(),
        series: this.getPieSeries({
            data,
            label: {
                normal: {
                    formatter: '{b}:{c} ({d}%)'
                }
            }
        })
    }
};
methods.getOption2 = function (data) {
    return {
        title: {
            text: '终端销量趋势',
            top: 25,
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: data.dataFields,
            bottom: 20
        },
        backgroundColor: '#ffffff',
        grid: {
            top: 80,
            left: 25,
            right: 35,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.data0
        },
        yAxis: {
            type: 'value',
            name: '销量'
        },
        series: data.dataFields.map((v, i) => {
            let j = i + 1;
            return {
                name: v,
                type: 'line',
                data: data['data' + j]
            }
        })
    }
};
methods.fetchRender = function () {
    let p = {
        startMonth: this.startDate,
        endMonth: this.endDate
    };
    let req1 = this.vRequest.fetch2('/terminalSales/pie', p);
    this.o1 = null;
    this.setPromise('terminalSellCount', req1).then((data) => {
        if (!data.length) {
            this.o1 = 'empty';
        } else {
            this.o1 = this.getOption1(data);
        }
    }).catch((e) => {
        this.o1 = 'empty';
        LOG(e);
    });

    let req2 = this.vRequest.fetch2('/terminalSales/trend', p);
    this.o2 = null;
    this.setPromise('terminalSellTrend', req2).then((data) => {
        this.o2 = this.getOption2(data);
    }).catch((e) => {
        this.o2 = 'empty';
        LOG(e);
    });
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
    this.fetchRender();
    window.Tool = tool;
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        startDate: calendar.getOffsetStr(new Date, -6, 'month', 'YYYY-MM'),
        endDate: calendar.getOffsetStr(new Date, -1, 'month', 'YYYY-MM'),

        o1: null,
        o2: null
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
        require('mixins/echarts_mix.js'),
        require('mixins/request_mix.js')
    ],
    beforeDestroy,
    components: {
        'tab-btn-group': require('comp/tab_btn_group.vue')
    }
};
</script>

<style scoped lang="less">
.page-terminal-count {
    
}
.date-input {
    width: 120px;
}
.chart-section {
    font-size: 0;
    .v-left {
        float: left;
        width: 50%;
        padding-right: 8px;
    }
    .v-right {
        float: left;
        width: 50%;
        padding-left: 8px;
    }
    .chart-1,
    .chart-2 {
        height: 380px;
    }
}
</style>

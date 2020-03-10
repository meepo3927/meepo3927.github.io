<template>
<div class="index-layer-child-2">
    <!-- <h4 v-text="myTitle"></h4> -->
    <div class="m-row mt10">
        <div class="col-1">
            <grid-box-2>
                <div class="v-line-1">
                    <i class="iconfont icon-renqun"></i>
                    <span>日均游客</span>
                </div>
                <div class="v-line-2">
                    <em v-text="peopleTotalText"></em>
                    <span v-text="peopleTotalUnit"></span>
                </div>
            </grid-box-2>
        </div>
        <div class="col-2">
            <div class="chart-1"><my-chart :o="o" /></div>
        </div>
    </div>
</div>
</template>

<script>
const tool = require('util/tool.js');

let methods = {};
methods.fetchRender = function () {
    let p = {cityId: this.$store.getters.cityId};
    // 图表
    let req = this.vRequest.fetch2('/monitor/sceneryPeople', p);
    this.o = null;
    this.peopleTotal = 0;
    this.setPromise('fetchRender', req).then((data) => {
        this.o = this.getOption(data);
        this.peopleTotal = this.getTotal(data);
    }).catch((e) => {
        this.o = 'empty';
    });
};
methods.getTotal = function (data) {
    let num = 0;
    data.forEach((item) => {
        num += item.value * 1;
    });
    return num;
};
methods.getOption = function (data) {
    return {
        tooltip: {
            trigger: 'axis'
        },
        color: [this.vConfig.themeColor],
        grid: {
            top: 30,
            bottom: 25,
            left: 10,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {},
            boundaryGap: false,

            data: data.map(v => v.name)
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            }
        },
        series: {
            type: 'line',
            label: {
                show: true,
                position: 'top'
            },
            smooth: true,
            lineStyle: {
                color: '#ffffff',
                width: 2,
                opacity: .6
            },
            areaStyle: {
                color: '#00cec9',
                opacity: .6
            },
            data: data.map(v => v.value)
        }
    };
};
let computed = {};
computed.myTitle = function () {
    return this.titlePrefix + '景区热度';
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        titlePrefix: '全市'
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
    mixins: [
        require('mixins/index_layer.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.index-layer-child-2 {
    
}
.m-row {
    margin-left: 40px;
}
.col-1 {
    padding-top: 45px;
    width: 30%;
}
.col-2 {
    padding-left: 10px;
    width: 50%;
}
</style>

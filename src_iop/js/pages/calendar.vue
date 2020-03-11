<template>
<div class="page-calendar m-container">
    <page-title main="知识图谱" sub="日历助手" />
    <div class="head-box text-center mt10">
        <button class="btn btn-default" @click="goPrevMonth" title="上个月">
            <i class="fa fa-angle-left"></i>
        </button>
        <span v-text="dateStr"></span>
        <button class="btn btn-default" @click="goNextMonth" title="下个月">
            <i class="fa fa-angle-right"></i>
        </button>
    </div>
    <button class="btn btn-success back-btn" @click="backMonth">回到当月</button>
    <div class="clearfix"></div>
    <div class="calendar-grid-box mt25">
        <calendar-grid v-model="date" />
    </div>
</div>
</template>

<script>
const CalendarUtil = require('util/calendar.js');
let methods = {};
methods.goPrevMonth = function () {
    this.date = CalendarUtil.getOffsetStr(this.date, -1 ,'month');
};
methods.goNextMonth = function () {
    this.date = CalendarUtil.getOffsetStr(this.date, 1 ,'month');
};
methods.backMonth = function () {
    this.date = CalendarUtil.getYMD();
};
let computed = {};
computed.dateStr = function () {
    let arr = this.date.split('-');
    return arr[0] + '年' + arr[1] + '月';
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        date: CalendarUtil.getYMD()
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
        'calendar-grid': require('comp/calendar-grid.vue')
    }
};
</script>

<style scoped lang="less">
.page-calendar {
}
.head-box {
    & > span {
        font-size: 24px;
        margin: 0 40px;
    }
    & > button {
        vertical-align: top;
        padding-left: 15px;
        padding-right: 15px;
        i {
            font-size: 20px;
        }
    }
}
.back-btn {
    float: right;
    margin-top: -34px;
}
</style>

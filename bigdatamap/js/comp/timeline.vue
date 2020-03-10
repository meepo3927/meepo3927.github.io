<template>
<div class="v-timeline">
    <div class="x-wrapper">
        <a href="javascript:;" @click="start" v-if="paused"><i class="fa fa-play"></i></a>
        <a href="javascript:;" @click="pause" v-else><i class="fa fa-pause"></i></a>

        <div class="bar">
            <div class="bar-inner" :style="{width}">
                <em></em>
                <span v-text="dateStr"></span>
                <i class="fa fa-caret-down"></i>
            </div>
        </div>

        <div class="t-1 v-t">居住地</div>
        <div class="t-2 v-t">工作地</div>
        <div class="t-3 v-t">居住地</div>
    </div>
</div>
</template>

<script>
const tool = require('util/tool.js');
// 7点和9点    17点到19点
const fromTime1 = new Date();
const fromTime2 = new Date();
const endTime1 = new Date();
const endTime2 = new Date();

fromTime1.setHours(7);
fromTime1.setMinutes(0);
fromTime1.setSeconds(0);
endTime1.setHours(9);
endTime1.setMinutes(0);
endTime1.setSeconds(0);
fromTime2.setHours(17);
fromTime2.setMinutes(0);
fromTime2.setSeconds(0);
endTime2.setHours(19);
endTime2.setMinutes(0);
endTime2.setSeconds(0);

let diffTime1 = endTime1.getTime() - fromTime1.getTime();
let diffTime2 = endTime2.getTime() - fromTime2.getTime();

const getDateStr = (date) => {
    return tool.padZero(date.getHours()) + ':' + tool.padZero(date.getMinutes());
};
let methods = {};
methods.start = function () {
    this.$emit('start');
};
methods.pause = function () {
    this.$emit('pause');
};
methods.calPosition = function () {
    if (!this.value) {
        return 0;
    }
    let val = this.value[0];
    let d = this.value[1];
    if (d === 1) {
        if (val < 0) {
            return 100;
        }
        return Math.min(50, val / 2);
    }

    return Math.min(Math.max(100 - val / 2, 50), 100);
};
methods.calDateTime = function () {
    if (!this.value) {
        return fromTime1.getTime();
    }
    let val = this.value[0];
    let d = this.value[1];

    if (d === 1) {
        if (val < 0) {
            return endTime2.getTime();
        }
        let percent = Math.min(val / 100, 1);
        return fromTime1.getTime() + percent * diffTime1;
    } else {
        let percent = Math.min((100 - val) / 100, 1);
        percent = Math.max(0, percent);
        return fromTime2.getTime() + percent * diffTime2;
    }
};
let computed = {};
computed.width = function () {
    return this.calPosition() + '%';
};
computed.dateStr = function () {
    let v = this.calDateTime();
    let date = new Date();
    date.setTime(v);
    let str = getDateStr(date);
    //LOG(str + ' __ ' + this.value + ' __ ' + this.calPosition());
    return str;
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['value', 'paused'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@black-back-color: rgba(0, 0, 0, .3);
@active-color:  #00CEC9;
@active-back:   rgba(0, 206, 201, .6);
@btn-size:      12px;
.v-timeline {
    position: absolute;
    left: 30px;
    bottom: 30px;
    z-index: 10020;
    padding-left: 50px;
}
.x-wrapper > a {
    position: absolute;
    top: -20px;
    left: -5px;

    display: inline-block;
    width: 44px;
    height: 44px;
    line-height: 45px;
    text-align: center;
    background-color: @black-back-color;
    border-radius: 50%;
    border: 1px solid @active-color;

    i.fa {
        color: #fff;
        font-size: 18px;
        &.fa-play {
            margin-left: 4px;
        }
    }
}
.bar {
    width: 500px;
    height: 6px;

    background-color: @black-back-color;
    border-radius: 2px;
    border: 1px solid #ccc;
    .bar-inner {
        background-color: @active-back;
        // width: 30%;
        height: 100%;
        text-align: right;
        position: relative;
        // 圆块
        em {
            float: right;
            background-color: @active-color;
            border: 1px solid #fff;
            border-radius: 50%;

            width: @btn-size;
            height: @btn-size;
            margin-right: -4px;
            margin-top: -4px;
        }
        // 数字
        span {
            width: 60px;
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            text-align: center;
            display: inline-block;
            color: #fff;
            position: absolute;
            top: -45px;
            right: -29px;
            background-color: rgba(0, 0, 0, .5);
            border-radius: 6px;
        }
        i.fa {
            color: #000;
            position: absolute;
            top: -17px;
            right: -2px;
        }
    }
}
.v-t {
    color: #fff;
    position: absolute;
    white-space: nowrap;
    top: 12px;
    font-size: 16px;
    &.t-1 {}
    &.t-2 {
        left: 50%;
    }
    &.t-3 {
        left: 91.2%;
    }
}
</style>

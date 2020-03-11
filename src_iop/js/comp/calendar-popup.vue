<template>
<center-layer anim="true" v-if="dataReady">
<div class="calendar-popup">
    <!-- 头 -->
    <div class="my-head">
        <h4>日程提醒</h4>
        <a href="javascript:;" class="close-btn" title="关闭" @click="closeMe">
            <i class="fa fa-remove"></i>
        </a>
    </div>
    <!-- 内容 -->
    <div class="my-content">
        <div class="my-title">
            <img :src="alarmImg" />
            <span>你好，今天是{{todayStr}}</span>
        </div>
        <ul v-if="list">
            <li v-for="v in list">
                <div class="li-title">
                    <label>标题：</label>
                    <span v-text="v.title"></span>
                </div>
                <div class="li-content">
                    <label>内容：</label>
                    <span v-text="v.content"></span>
                </div>
            </li>
        </ul>
        <div class="btn-box">
            <button class="btn btn-warning" @click="notToday">今天不再提醒</button>
        </div>
    </div>
</div>
</center-layer>
</template>

<script>
const Cover = require('util/cover.js');
let methods = {};
methods.closeMe = function () {
    this.list = null;
    if (this.myCover) {
        this.myCover.remove();
        this.myCover = null;
    }
};
methods.notToday = function () {
    this.vRequest.fetch2('/calendar/enableUserSet');
    this.closeMe();
};
let computed = {};
computed.dataReady = function () {
    return (this.list && this.list.length);
};
computed.alarmImg = function () {
    return this.vImgPath + '/alarm_clock.png';
};
computed.todayStr = function () {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return year + '年' + month + '月' + day + '日';
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.vRequest.fetch2('/calendar/getCalendar').then((data) => {
        if (data && data.length) {
            this.list = data;
        }
    });
};
const beforeDestroy = function () {
    this.closeMe();
};
const dataFunc = function () {
    let o = {
        list: undefined
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
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref.less";
.calendar-popup {
    border: 3px solid #F2F2F2;
    border-radius: 8px;
    background-color: #fff;
}
.my-head {
    background-color: @theme-color;
    color: #fff;
    padding: 10px 4px 8px 10px;
    height: 42px;
    border-radius: 6px 6px 0 0;
    h4 {
        margin: 0;
    }
    .close-btn {
        float: right;
        margin-top: -32px;
        color: #fff;
        font-size: 20px;
        padding: 8px;
    }
}
.my-content {
    padding: 20px;
    .my-title {
        img {
            height: 28px;
        }
        span {
            font-size: 18px;
            margin-left: 10px;
            vertical-align: -3px;
        }
    }
    ul {
    }
    ul > li {
        margin-top: 15px;
        border-top: 1px solid #CCC;
        padding-top: 25px;
        font-size: 16px;
        & > div > label {
            display: inline-block;
            width: 91px;
            text-align: right;
            vertical-align: top;
        }
        & > div > span {
            width: 320px;
            word-wrap: break-word;
            word-break: break-all;
            display: inline-block;
            margin-left: 5px;
        }
        .li-title {
            span {
                font-weight: bold;
            }
        }
        .li-content {
            margin-top: 10px;
        }
    }
    .btn-box {
        text-align: center;
        padding: 16px 0 0 0;
    }
}
</style>

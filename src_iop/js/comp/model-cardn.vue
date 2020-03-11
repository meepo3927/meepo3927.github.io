<template>
<li class="model-card">
    <h4 v-text="v.modelName"></h4>
    <span class="corner-text" v-text="v.modelType"></span>
    <!--
    <div class="update-time">
        <i class="fa fa-clock-o"></i> {{updateTime}}
    </div>
    -->
    <div class="cycle-text" v-text="cycleText"></div>
    <div class="link-box">
        <a href="javascript:;" @click="openUrl">查看模型详情</a>
    </div>
</li>
</template>

<script>
const calendar = require('util/calendar.js');
const curDate = new Date();
const DD = 24 * 3600 * 1000;
let methods = {};
methods.openUrl = function () {
    let url = './model_single.html?id=' + this.v.modelId;
    Tool.winOpen(url);
};
let computed = {};
computed.v = function () {
    return this.data || {};
};
computed.updateTime = function () {
    if (!this.v.updateTime) {
        return '';
    }
    let myDate = calendar.parseDate(this.v.updateTime);
    let diff = curDate.getTime() - myDate.getTime();
    let day = Math.round(diff / DD);
    if (day <= 0) {
        return '今天更新';
    } else if (day <= 30) {
        return day + '天前更新';
    } else {
        return Math.ceil(day / 30) + '月前更新';
    }
};
computed.cycleText = function () {
    const map = {
        '日': 'Day',
        '月': 'Month'
    };
    const t = this.v.timeLimit;
    const str = map[t] || '';
    return (t || '月') + '模型 (' + str + ')';
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['data'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@cate-color-1:  #64DD17;
@cate-color-2:  #1A6352;
@cate-color-3:  #1976D2;
@cate-color-4:  #F06292;
@cate-color-5:  #EC881D;

.model-card {
    vertical-align: top;
    background-color: #fff;
    border-radius: 4px;
    font-size: 14px;
    display: inline-block;
    width: 24%;
    margin-right: 1%;
    margin-bottom: 15px;
    box-shadow: 0 3px 4px #ccc;
    padding: 5px 15px;
    position: relative;

    border-top: 6px solid #64DD17;
}
h4 {
    white-space: nowrap;
    margin-right: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
}
span.corner-text {
    position: absolute;
    top: 10px;
    right: 10px;
    display: inline-block;
    padding: 4px 8px;
    text-align: center;
    background-color: #E6E6E6;
    border-radius: 4px;
}
.update-time {
    margin-top: 12px;
    color: #666;
    //color: #34A438;
    i {
        font-size: 16px;
    }
}
.cycle-text {
    color: #666;
}
.link-box {
    margin-top: 8px;
    padding-bottom: 8px;
    a {
        color: #00BEA4;
    }
}
</style>

<template>
<div class="c c4">
    <div class="input-box">
        <input type="text" class="form-control" 
            :value="v[0]" 
            @input="onInput($event)"
            @blur="checkValue" />
        <i class="fa fa-info-circle" ref="icon"></i>
    </div>
    <!-- 日期选择 -->
    <div class="datetime-box mt5">
        <vue-date class="form-control"  placeholder="开始日期" 
            :value="v[1]"
            @input="onBeginDateInput" />
        <span>至</span>
        <vue-date class="form-control" placeholder="结束日期"
            :value="v[2]"
            @input="onEndDateInput" />
    </div>
    <!-- 时间段选择 -->
    <div class="time-box mt5">
        <v-chosen class="x-chosen" :options="hourOptions"
            @input="onBeginTimeInput" 
            :value="v[3]" />
        <span>至</span>
        <v-chosen class="x-chosen" :options="hourOptions"
            @input="onEndTimeInput" 
            :value="v[4]" />
    </div>
    <div class="text-error mt10" 
        v-html="errmsg" v-if="errmsg"></div>
</div>
</template>

<script>
import tool from 'util/tool';
const ERRMSG = {
    value: '请填写阈值',
    beginDate: '请选择开始时间',
    endDate: '请选择结束时间'
};
var methods = {};
methods.onInput = function (e) {
    this.$set(this.v, '0', e.target.value);
};
methods.onBeginDateInput = function (val) {
    this.$set(this.v, '1', val);
    if (val && (this.errmsg === ERRMSG.beginDate)) {
        this.errmsg = '';
    }
};
methods.onEndDateInput = function (val) {
    this.$set(this.v, '2', val);
    if (val && (this.errmsg === ERRMSG.endDate)) {
        this.errmsg = '';
    }
};
methods.onBeginTimeInput = function (val) {
    this.$set(this.v, '3', val);
};
methods.onEndTimeInput = function (val) {
    this.$set(this.v, '4', val);
};
methods.checkValue = function () {
    if (this.v[0] && this.errmsg === ERRMSG.value) {
        this.errmsg = '';
    }
};
methods.check = function () {
    if (!this.v[0]) {
        this.errmsg = ERRMSG.value;
        return false;
    }
    if (!this.v[1]) {
        this.errmsg = ERRMSG.beginDate;
        return false;
    }
    if (!this.v[2]) {
        this.errmsg = ERRMSG.endDate;
        return false;
    }
    this.errmsg = '';
    return true;
};
var computed = {};
computed.hourOptions = function () {
    let arr = [];
    for (let i = 0; i <= 23; i++) {
        let str = tool.padZero(i);
        arr.push({
            text: str + '时',
            value: str
        });
    }
    return arr;
};
var mounted = function () {
    if (this.value && this.value.length) {
        this.v = this.value;
    } else {
        this.v = ['', '', '', '00', '23'];
    }
    $(this.$refs.icon).popover({
        html: true,
        placement: 'left',
        trigger: 'hover',
        title: '提示',
        content: [
            '<div class="x-content">',
                '当选择条件<em>在...之间</em>、<em>不在...之间</em>、<em>包含</em>、<em>不包含</em>时，阈值支持以空格分隔，例如关键字搜索中，条件选择[包含]，阈值填写[购物 旅游]，则当关键词是[购物]或者[旅游]时，此规则都会生效。',
                '<br /> <br />',
                '当选择条件<em>包含</em>、<em>不包含</em>时，阈值默认使用通配符进行模糊匹配，例如关键字搜索，条件选择[包含]，阈值填写[流量]，则只要关键词包含[流量]两个字(比如流量包、4G流量)，此规则就会生效。',
            '</div>'
        ].join('')
    });
};
let watch = {};
watch.value = function (v) {
    if (v && v.length) {
        this.v = v;
    }
};
export default {
    data: function () {
        return {
            v: []
        };
    },
    watch,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [require('./mix.js')]
};
</script>

<style scoped lang="less">
@width: 130px;
.c {
    width: 100%;
    min-width: 300px;
}
input[type=text] {
    display: inline-block;
}
.input-box input[type=text] {
    width: @width;
}
.datetime-box input[type=text] {
    width: @width;
}
.x-chosen {
    width: @width;
}
.fa {
    font-size: 24px;
    vertical-align: -4px;
    margin-left: 8px;
}
</style>
<template>
<div class="calendar-grid">
    <div class="calendar-cell style-head" v-for="v in weeks" v-text="v"></div>
    <div class="calendar-cell style-cube" v-for="(v, i) in list" 
        title="点击添加该日行程"
        @click="onCellClick(v)"
        :class="getCellClass(v, i)">
        <!-- 号码，节日 -->
        <span class="v-num" v-text="v.day" ></span>
        <span class="v-holiday-name" v-text="getHoliday(v)"></span>
        <!-- (部分)列表 -->
        <ul v-if="v.shortData" class="short-list">
            <li v-for="(record, j) in v.shortData" :title="'点击查看详情：' + record.title">
                <a href="javascript:;" v-text="record.title" 
                    @click.stop="onRecordClick(record, v)"></a>
            </li>
        </ul>
        <span class="v-rest" v-if="v.isRest">休</span>
        <a href="javascript:;" class="more-btn" v-if="getMoreVisible(v)"
            @click.stop="showMore(v)">查看全部</a>

        <!-- 全部 浮层 -->
        <div class="all-layer" v-if="getMoreVisible(v)" v-show="v.allVisible" 
            title=""
            @click.stop>
            <h4 v-text="getCellDateStr(v)"></h4>
            <a href="javascript:;" class="close-btn" @click.stop="allClose(v)">
                <i class="fa fa-times-circle"></i>
            </a>
            <ul class="all-list" >
                <li v-for="(record, j) in v.data" :title="'点击查看详情：' + record.title">
                    <a href="javascript:;" v-text="record.title" 
                        @click.stop="onRecordClick(record, v)"></a>
                </li>
            </ul>
        </div>
    </div>

    <form-layer v-if="layerVisible" @close="layerClose"
        :cell="activeCell"
        :data="formData"
        :mode="formMode"
        @update="layerUpdate"
        @change-mode="layerChangeMode" />
</div>
</template>

<script>
const CalendarUtil = require('util/calendar.js');
const WeekStr = '一二三四五六日';
const SHORT_NUM = 2;
const today = new Date();
const todayStr = CalendarUtil.getYMD(today);
let methods = {};
methods.onCellClick = function (cell) {
    this.formMode = 'create';
    this.activeCell = cell;
    this.layerVisible = true;
};
methods.onRecordClick = function (item, cell) {
    this.formMode = 'browse';
    this.formData = item;
    this.activeCell = cell;
    this.layerVisible = true;
};
methods.showMore = function (item) {
    item.allVisible = true;
};
methods.allClose = function (item) {
    item.allVisible = false;
};
methods.layerUpdate = function (item) {
    for (let i = 0; i < this.list.length; i++) {
        let v = this.list[i];
        if (v.year === item.year && v.month === item.month && v.day === item.day) {
            if (item.data) {
                item.shortData = item.data.slice(0, SHORT_NUM);
            }
            this.list.splice(i, 1, item);
            break;
        }
    }
};
methods.layerChangeMode = function (mode) {
    this.formMode = mode;
};
methods.layerClose = function () {
    this.layerVisible = false;
    this.activeCell = null;
    this.formData = null;
};
methods.fetch = function () {
    let p = {
        month: this.value.substr(0, 7)
    };
    let req = this.vRequest.fetch2('/calendar/getCalendarList', p);
    this.setPromise('fetch', req).then((data) => {
        this.renderData(data.tip);
        this.renderRest(data.holiday);
    }).catch((e) => {
        LOG('Fetch Error:', e);
    });
};
methods.getCellDateStr = function (item) {
    return CalendarUtil.buildStrCN(item);
};
methods.getMoreVisible = function (item) {
    return (item.data) && (item.data.length > SHORT_NUM)
};
methods.renderData = function (arr) {
    let list = this.list || [];
    let map = {};
    arr.forEach((item) => {
        map[item.date] = map[item.date] || [];
        map[item.date].push(item);
    });
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let dateStr = CalendarUtil.buildStr(item);
        if (!map[dateStr]) {
            continue;
        }
        item.data = map[dateStr];
        item.shortData = map[dateStr].slice(0, SHORT_NUM);
        list.splice(i, 1, item);
    }
};
methods.renderRest = function (arr) {
    let map = {};
    arr.forEach((v) => {
        map[v.calDate] = v.code;
    });
    this.list.forEach((item) => {
        // YYYY-MM-DD
        let str = CalendarUtil.buildStr(item);
        if (map[str]) {
            item.isRest = true;
        }
    });
};
methods.renderCell = function () {
    let date = this.getDateInstance();
    this.list = CalendarUtil.getCalendarArray(date, (p) => {
        p.allVisible = false;
        p.isRest = false;
        return p;
    }).list;
};
methods.getDateInstance = function () {
    return CalendarUtil.parseDate(this.value);
};
methods.getCellClass = function (item, i) {
    let arr = [];
    if (item.tag) {
        arr.push('tag-' + item.tag);
    }
    if (item.data && item.data.length) {
        arr.push('has-item');
    }
    if (item.isRest) {
        arr.push('is-rest');
    }
    let date = CalendarUtil.getDateByYMD(item.year, item.month, item.day);
    let str = CalendarUtil.getYMD(date);
    if (str === todayStr) {
        arr.push('tag-today');
    }

    return arr;
};
methods.getHoliday = function (item) {
    return CalendarUtil.getHoliday(item)
};
let computed = {};
computed.shortNum = function () {
    return SHORT_NUM;
};
let watch = {};
watch.value = function (v) {
    if (v) {
        this.renderCell();
        this.fetch();
    }
};
const created = function () {};
const mounted = function () {
    window.CalendarGrid = this;
    if (this.value) {
        this.renderCell();
        this.fetch();
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        weeks: WeekStr.split('').map(v => {
            return '星期' + v
        }),
        list: [],
        activeCell: null,
        formMode: '',
        formData: null,
        layerVisible: false
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: {
        value: String
    },
    mounted,
    mixins: [
        require('mixins/request_mix.js')
    ],
    beforeDestroy,
    components: {
        'form-layer': require('comp/calendar-form-layer.vue')
    }
};
</script>

<style scoped lang="less">
@active-color:  #3498DB;
@border-color:  #E4E4E4;
@head-height:   42px;
@cell-height:   108px;
@num-area-size: 26px;
@num-font-size: 14px;

@record-back-color:  #3C88AE;
@record-height:      24px;
.calendar-grid {

}
.calendar-cell {
    display: inline-block;
    vertical-align: middle;
    width: 14.28%;
    border: 1px solid @border-color;
    border-left-width: 0;
    background-color: #fff;

    position: relative;
    height: @cell-height;
    padding: 6px 8px;
    .more-btn {
        float: right;
        margin-right: 6px;
    }
    & > span.v-holiday-name {
        display: inline-block;
        margin-top: 4px;
        margin-left: 4px;
    }
    & > span.v-rest {
        position: absolute;
        left: 10px;
        bottom: 2px;
    }
    & > span.v-num {
        display: inline-block;
        width: @num-area-size;
        height: @num-area-size;
        line-height: @num-area-size;
        border-radius: 50%;
        text-align: center;
        font-size: @num-font-size;

        float: right;
    }
    &.style-head {
        background-color: #EFF3F5;
        text-align: center;
        height: @head-height;
        font-size: 18px;
        padding-top: 8px;
    }
    &.style-cube {
        cursor: pointer;
    }
    &.is-rest { // 休息日
        background-color: #f2f2f2;
    }
    &.has-item { // 有行程
        background-color: #E9F3E7;
    }
    &.tag-today {
        span.v-num {
            color: #fff;
            background-color: @active-color;
        }
    }
    &.tag-prev,
    &.tag-next {
    }
    &:nth-child(n+8) {
        border-top: none;
    }
    &:nth-child(7n+1) {
        border-left-width: 1px;
    }
}
.record-item-block() {
    display: block;
    height: @record-height;
    line-height: @record-height;
    padding: 0 8px;
    white-space: nowrap;
    border-radius: 4px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;

    color: #fff;
    background-color: #BCBCBC;
}
.short-list {
    width: 100%;
    margin-top: 8px;
    & > li {
        margin: 0 6px 2px 6px;
    }
    & > li > a {
        .record-item-block();
        background-color: @record-back-color;
        &:hover {
            background-color: darken(@record-back-color, 15%);
        }
    }
}
.all-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    cursor: default;
    z-index: 50;

    min-width: 200px;

    background-color: #fff;
    border: 1px solid #bcbcbc;
    & > .close-btn {
        float: right;
        margin: -25px 15px 0 0;
        i {
            font-size: 18px;
            color: #777;
        }
    }
    & > h4 {
        margin: 0;
        padding: 8px 12px;
        background-color: #F2F2F2;
        font-size: 16px;
    }
}
.all-list {
    margin: 0 10px;
    & > li {
        margin: 5px 0;
    }
    & > li > a {
        .record-item-block();
        background-color: @record-back-color;
        &:hover {
            background-color: darken(@record-back-color, 15%);
        }
    }
}
</style>

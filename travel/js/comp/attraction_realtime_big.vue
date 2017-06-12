<template>
<center-layer width="96%" height="94%" anim="true" @ready="layerReady" ref="clayer">
<div class="big-chart-layer vertical-flex" :class="{'full-mode': isFullMode}" ref="blayer">
    <close-box @close="$emit('close')" @max="windowMax" @restore="windowRestore" :full="isFullMode"></close-box>

    <!-- 头 -->
    <div class="x-head">
        <span class="x-title" v-text="title"></span>
        <div class="btn-group mb10 ver-top ml10">
            <button type="button" class="btn" :class="{active: active === 1}"
                @click="render(1)">景点流量监控</button>
            <button type="button" class="btn" :class="{active: active === 2}"
                @click="render(2)">迁入/迁出流量分析</button>

            <button type="button" class="btn" :class="{active: active === 3}"
                @click="render(3)">景区客流来源排行</button>
        </div>
    </div>
    <div class="x-body" v-if="active === 1">
        <div class="m-row w-auto col-mid info-row">
            <div class="col-1 m-col">
                <img :src="vImgPath + '/logo_o.png'" :style="imgStyle" />
            </div>
            <div class="col-2 m-col">
                <p class="p-title" :style="pStyle">景区实时人数</p>
                <div class="user-num" :style="numStyle" v-html="userNum"></div>
                <p class="p-copyright" :style="pStyle">内蒙古移动提供大数据支持</p>
            </div>
        </div>
    </div>
    <!-- 尾 -->
    <div class="x-foot" :class="['active-' + active]">
        <div class="my-chart" ref="one" v-if="active === 1"></div>
        <div class="my-chart" ref="two" v-if="active === 2"></div>
        <div class="my-chart" ref="three" v-if="active === 3"></div>
    </div>
</div>
</center-layer>
</template>

<script>
import chartUtil from 'util/chart';
import request from 'util/request';
var tool = require('util/tool');

const docHtml = document.documentElement;
const docBody = document.body;
const getHeight = () => {
    return docHtml.clientHeight || docBody.clientHeight;
};
const getUserNum = (list) => {
    let len = list.length;
    for (let i = len - 3; i >= 0; i--) {
        let item = list[i] || {};
        if (item.userNum !== undefined) {
            return item.userNum;
        }
    }
    return 0;
};
var methods = {};
methods.layerReady = function () {
    let defaultActive = 1;
    if (this.$parent.$refs.realtimeChart) {
        let rc = this.$parent.$refs.realtimeChart;
        if (rc.active) {
            defaultActive = rc.active;
        }
    }
    this.render(defaultActive);
};
methods.getBoxHeight = function () {
    return $(this.$refs.blayer).height();
};
methods.getMyChart = function (el, options = {}) {
    if (options.chart) {
        this.charts.c = options.chart;
        return options.chart;
    }
    if (this.charts.c) {
        this.charts.c.dispose();
        this.charts.c = null;
    }
    this.charts.c = chartUtil.getLoadingChart(el);
    return this.charts.c;
};
methods.render1 = function (options = {}) {
    var chart = this.getMyChart(this.$refs.one, options);
    request['getAttractionRealtime1'](this.id).then((result) => {
        chart.hideLoading();
        this.userNum = getUserNum(result);
        chart.setOption(chartUtil.getHumanTrafficOption({
            title: {
                text: '景区人流量监控',
                subtext: this.areaName
            },
            data: result
        }));
    }, () => {
        chart.hideLoading();
    });
};
methods.render2 = function (options = {}) {
    var chart = this.getMyChart(this.$refs.two, options);

    request['getAttractionRealtime2'](this.id).then((result) => {
        chart.hideLoading();
        chart.setOption(chartUtil.getAttractionInOutOption({
            title: '景区迁入/迁出人数监控',
            subtitle: this.areaName,
            data: result
        }));
    }, () => {
        chart.hideLoading();
    });
};
methods.render3 = function (options = {}) {
    var chart = this.getMyChart(this.$refs.three, options);
    require.ensure([], () => {
        require('lib/geo/china.js');
        require('lib/geo/neimenggu.js');
        this.realRender3(chart);
    });
};
methods.realRender3 = function (chart) {
    request.getAttractionSource1(this.id).then((data) => {
        request.getAttractionSource12(this.id).then((data2) => {
            chart.hideLoading();
            let o = chartUtil.getAttractionSource1Option({
                data: data || [],
                nmData: data2 || []
            });
            chart.setOption(o);
        });
    }, () => {
        chart.hideLoading();
    });
};
methods.setHeight = function () {
    this.h = this.getBoxHeight();
};
var computed = {};
computed.imgStyle = function () {
    let s = {};
    let v = this.h * 0.27;
    s.height = v + 'px';
    s.width = v + 'px';
    return s;
};
computed.pStyle = function () {
    let s = {};
    s.fontSize = (this.h * 0.03) + 'px';
    return s;
};
computed.numStyle = function () {
    let s = {};
    s.fontSize = (this.h * 0.14) + 'px';
    return s;
};
var watch = {};
const created = function () {
    this.$on('handle-resize', this.setHeight);
    this.$on('window-resize', this.setHeight);
};
var mounted = function () {};
const beforeDestroy = function () {
    this.$off('window-resize', this.setHeight);
    this.$off('handle-resize', this.setHeight);
};
let destroyed = function () {};
let dataFunc = function () {
    var o = {
        userNum: '&nbsp;',
        h: getHeight()
    };
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [
        require('comp/bind_resize_mix.js'),
        require('comp/with_cover_mix.js'),
        require('comp/chart_layer_mix.js'),
        require('comp/realtime_big_mix.js'),
        require('comp/chart_layer/window_mix.js')
    ],
    methods,
    computed,
    props: [],
    created,
    mounted,
    beforeDestroy,
    destroyed,
    components: {
        'close-box': require('comp/chart_layer/close-box.vue')
    }
};
</script>

<style scoped lang="less">
.my-chart {
    height: 100%;
    padding: 8px 10px;
}
.x-body {
    top: 13%;
}
.info-row {
    margin-left: auto;
    margin-right: auto;
    .col-2 {
        padding-left: 12px;
        .p-title {
        }
        .user-num {
            color: darken(#ff425d, 5%);
            margin: 7px 0 7px 0;
        }
        .p-copyright {
        }
        .p-title,
        .p-copyright {
            padding-left: 8px;
            line-height: 1.4;
            color: #666;
            font-weight: 600;
        }
    }
}
.x-foot.active-1 {
    // top: 290px;
    top: 40%;
}
</style>
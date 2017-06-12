<template>
<center-layer width="96%" height="94%" anim="true" @ready="layerReady" ref="clayer">
<div class="big-chart-layer vertical-flex" :class="{'full-mode': isFullMode}">
    <close-box @close="$emit('close')" @max="windowMax" @restore="windowRestore" :full="isFullMode"></close-box>

    <!-- 头 -->
    <div class="x-head">
        <span class="x-title" v-text="title"></span>
        <div class="btn-group mb10 ver-top ml10">
            <button type="button" class="btn" :class="{active: active === 1}"
                @click="render(1)">景点流量监控</button>
            <button type="button" class="btn" :class="{active: active === 2}"
                @click="render(2)">迁入/迁出流量分析</button>
        </div>
    </div>

    <div class="x-left o-scroll">
        <ul class="option-list">
            <li v-for="item in options" @click="optionClick(item)" :class="{active: item.active}" 
                :style="getItemStyle(item)">
                <i class="fa" :class="[item.active ? 'fa-check-circle' : 'fa-circle-o']"></i>
                <span v-text="item.sceneryName"></span>
            </li>
        </ul>
    </div>
    <!-- 尾 -->
    <div class="x-foot with-left">
        <div class="my-chart" ref="one" v-if="active === 1"></div>
        <div class="my-chart" ref="two" v-if="active === 2"></div>
    </div>
</div>
</center-layer>
</template>

<script>
import chartUtil from 'util/chart';
import request from 'util/request';
var tool = require('util/tool');
var methods = {};
methods.optionClick = function (item, options = {}) {
    item.active = !item.active;
    let option = null;
    if (this.active === 1) {
        this.itemActive1[item.sceneryId] = item.active;
        let param = this.selectedOptions;
        option = chartUtil.getAttractionUserRealtime(param);
        this.charts.c.setOption(option, true); // not Merge
        this.$emit('render-option', this.active, param);
    } else if (this.active === 2) {
        this.itemActive2 = item.placeID;
        this.options.forEach((v) => {
            if (v === item) {
                v.active = true;
                return;
            }
            if (v.placeID && v.placeID === item.placeID) {
                v.active = true;
                return;
            }
            v.active = false;
        });

        var chart = options.chart || chartUtil.getLoadingChart(this.$refs.two);
        this.charts.c = chart;
        request.getAttractionRealtime2(item.placeID).then((result) => {
            let param = result;
            chart.hideLoading();
            option = chartUtil.getAttractionInOutOption({
                titleOption: chartUtil.getTitleOption2(item.sceneryName, '景区迁入/迁出人数监控'),
                data: result
            });

            chart.setOption(option);
            this.$emit('render-option', this.active, item);
        });
    }
};

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
methods.processOptions = function (result) {
    return result.map((v, i) => {
        let n = {};
        for (let p in v) {
            n[p] = v[p];
        }

        // 第一个默认选中
        n.active = (i === 0) ? true : false;

        // 根据之前操作选中
        if (this.active === 1) {
            let b = this.itemActive1[v.sceneryId];
            if (b !== undefined) {
                n.active = b;
            }
        } else if (this.active === 2) {
            if (this.itemActive2) {
                n.active = (v.placeID === this.itemActive2);
            }
        }

        if (n.placeName) {
            n.sceneryName = n.placeName;
        }
        return n;
    });
};
methods.getItemStyle = function (item) {
    let index = this.selectedOptions.indexOf(item);
    if (index < 0) {
        return null;
    }
    let o = {};
    let c = chartUtil.getThemeColorByIndex(index, this.themeColor);
    if (c) {
        o.color = c;
    }
    return o;
};
methods.render1 = function (options = {}) {
    var chart = options.chart || chartUtil.getLoadingChart(this.$refs.one);
    this.charts.c = chart;
    request['getCityRealtime1'](this.id).then((result) => {
        if (this.active !== 1) {
            return;
        }
        // build options
        this.options = [];
        this.options = this.processOptions(result);
        chart.hideLoading();
        let option = chartUtil.getAttractionUserRealtime(this.selectedOptions);
        chart.setOption(option, true);
        this.$emit('render-option', this.active, this.selectedOptions);
    }, () => {
        chart.hideLoading();
    });
};
methods.render2 = function (options = {}) {
    this.options = [];
    request['getAttractionsOfCity'](this.id).then((result) => {
        if (this.active !== 2) {
            return;
        }

        this.options = this.processOptions(result);
        let defaultOption = this.options[0];
        this.options.forEach((v) => {
            if (v.active) {
                defaultOption = v;
            }
        });
        this.optionClick(defaultOption, options);
    }, () => {
        mlayer.msg('没有获取到景区');
    });
};
var computed = {};
computed.selectedOptions = function () {
    let a = [];
    this.options.forEach((v) => {
        v.active && a.push(v);
    });
    return a;
};
var watch = {};
const created = function () {
    this.themeColor = chartUtil.getThemeColor();

    let realtimeChart = this.$parent.$refs.realtimeChart;
    if (realtimeChart) {
        let param1 = realtimeChart.param1 || [];
        param1.forEach((id) => {
            this.itemActive1[id] = true;
        });

        let param2 = realtimeChart.param2 || {};
        if (param2.placeID) {
            this.itemActive2 = param2.placeID;
        }
    }
};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
    var o = {
        itemActive1: {},
        itemActive2: '',
        options: []
    };
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [
        require('comp/with_cover_mix.js'),
        require('comp/chart_layer_mix.js'),
        require('comp/realtime_big_mix.js'),
        require('comp/chart_layer/window_mix.js')
    ],
    created,
    methods,
    computed,
    props: [],
    mounted,
    destroyed,
    components: {
        'close-box': require('comp/chart_layer/close-box.vue')
    }
};
</script>

<style scoped lang="less">
.my-chart {
    height: 100%;
}
@left-width: 190px;
.x-left {
    width: @left-width;
}
.x-foot {
    left: @left-width + 10;
}
</style>
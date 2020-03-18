<template>
<center-layer :width="layerWidth" :height="layerHeight" 
    anim="true" @ready="layerReady" ref="clayer">
<div class="analysis-layer" >

    <a href="javascript:;" class="close-btn" @click="$emit('close')">
        <i class="fa fa-times"></i>
    </a>
    <div class="x-wrapper" >
        <!-- 头 -->
        <div class="x-head">
            <h4 v-text="title"></h4>
            <ul class="head-nav">
                <li :class="{active: active === 1}" @click="render(1)">
                    <i class="fa fa-line-chart"></i> 景点流量监控
                </li>
                <li :class="{active: active === 2}" @click="render(2)">
                    <i class="fa fa-refresh"></i> 迁入/迁出流量分析
                </li>
            </ul>

        </div>
        <!-- 内容 -->
        <div class="x-body">
            <!-- 左侧 -->
            <div class="list-wrapper " >
                <ul class="option-list" ref="listWrapper">
                    <li v-for="item in list" @click="onSceneryClick(item)" 
                        :class="{active: item.active}" 
                        :style="getItemStyle(item)">
                        <i class="fa" :class="[item.active ? 'fa-check-circle' : 'fa-circle-o']"></i>
                        <span v-text="item.placeName"></span>
                    </li>
                </ul>
            </div>
            <!-- 右侧 -->
            <div class="x-right">
                <my-chart :o="o" v-if="active === 1" key="c1" />
                <my-chart :o="o" v-if="active === 2" key="c2" />
            </div>
        </div>
    </div>
</div>
</center-layer>
</template>

<script>
import chartUtil from 'util/chart';
import request from 'util/request';
import 'slimScroll';
import tool from 'util/tool.js';
const themeColor = chartUtil.getThemeColor();

var methods = {};
methods.init = function () {
    // 请求景区列表
    return request.getAttractionsOfCity(this.id).then((result) => {
        this.list = this.processOptions(result);
        return this.list;
    }).catch((e) => {
        mlayer.msg('查询到景区失败');
        //LOG(e);
    });
};
methods.sceneryClick1 = function (item) {
    // 记录状态
    this.itemActive1[item.placeID] = item.active;
    this.render1();
};
methods.sceneryClick2 = function (item) {
    // 记录状态
    this.itemActive2 = item.placeID;
    // 其他景区取消
    this.list.forEach((v) => {
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
    this.render2();
};
methods.onSceneryClick = function (item) {
    if (this.active === 1) {
        item.active = !item.active;
        if (this.selectedOptions.length === 0) {
            mlayer.msg('至少选择一个景区');
            item.active = true;
            return;
        }
        this.sceneryClick1(item);
    } else if (this.active === 2) {
        item.active = true;
        this.sceneryClick2(item);
    }
};

methods.layerReady = function () {
    let defaultActive = 1;
    this.init().then((list) => {
        // 默认选中第一个景区
        let item = list[0];
        this.itemActive1[item.placeID] = true;
        item.active = true;
        this.render(defaultActive);
    });
};
methods.processOptions = function (arr) {
    return arr.map((v, i) => {
        let item = {
            placeID: v.placeID,
            placeName: v.placeName,
            active: false
        };
        return item;
    });
};
methods.getItemStyle = function (item) {
    let index = this.selectedOptions.indexOf(item);
    if (index < 0) {
        return null;
    }
    let o = {};
    let color = chartUtil.getThemeColorByIndex(index, themeColor);
    if (color) {
        o.color = color;
    }
    return o;
};
methods.render1 = function (options = {}) {
    // refresh自动刷新
    if (options.mode !== 'refresh') {
        this.o = null;
    }
    this.list.forEach((item, i) => {
        item.active = !!this.itemActive1[item.placeID]
    });
    let ss = this.selectedOptions;
    let p = {
        places: ss.map(v => v.placeID).join(',')
    };
    request.getRealtimeDayPeople(p).then((data) => {
        this.o = chartUtil.getAttractionUserRealtime(data, ss);
    }).catch((e) => {
        this.o = 'empty';
        LOG(e)
    });
};
methods.render2 = function (options = {}) {
    // refresh自动刷新
    if (options.mode !== 'refresh') {
        this.o = null;
    }
    var scenery;
    if (this.itemActive2) {
        this.list.forEach((item, i) => {
            if (item.placeID === this.itemActive2) {
                item.active = true;
                scenery = item;
            } else {
                item.active = false;
            }
        });
    } else {
        this.list.forEach((item, i) => {
            item.active = (i === 0);
        });
    }
    scenery = scenery || this.list[0];

    request.getAttractionRealtime2(scenery.placeID).then((result) => {
        let  titleOption = chartUtil.getTitleOption2(
            scenery.placeName,
            '迁入/迁出流量分析'
        );
        this.o = chartUtil.getAttractionInOutOption({
            titleOption,
            data: result
        });
    }).catch((r) => {
        this.o = 'empty';
    });
};
var computed = {};
computed.selectedOptions = function () {
    return this.list.filter((item) => {
        return !!item.active;
    });
};
var watch = {};
const created = function () {
};
var mounted = function () {
    $(this.$refs.listWrapper).slimScroll({
        width: '240px',
        height: '100%'
    });
};
const beforeDestroy = function () {};
let dataFunc = function () {
    var o = {
        itemActive1: {},
        itemActive2: undefined,
        list: []
    };
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [
        require('mixins/realtime_big.js')
    ],
    created,
    methods,
    computed,
    props: [],
    mounted,
    beforeDestroy,
    components: {
    }
};
</script>

<style scoped lang="less">
@left-width: 240px;
@left-pad:   20px;
.list-wrapper {
    width: @left-width;
    position: absolute;
    left: @left-pad;
    top: 20px;
    bottom: 20px;
}
.x-body > .x-right {
    height: 100%;
    margin-left: @left-width + @left-pad;
    padding: 20px;
}
</style>
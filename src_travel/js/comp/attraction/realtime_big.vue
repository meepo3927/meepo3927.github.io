<template>
<center-layer :width="layerWidth" :height="layerHeight" 
    anim="true" @ready="layerReady" ref="clayer">
<div class="analysis-layer" ref="blayer">

    <a href="javascript:;" class="close-btn" @click="$emit('close')">
        <i class="fa fa-times"></i>
    </a>
    <div class="x-wrapper" >
        <!-- 头 -->
        <div class="x-head">
            <h4 v-text="title" :class="[titleClassName]"></h4>
            <ul class="head-nav">
                <li class="mr5" v-for="(v, i) in titleConfig" 
                    :class="{active: (i + 1) === active}"
                    @click="render(i + 1)">
                    <i class="fa" :class="[v.icon]"></i> {{v.name}}
                </li>
            </ul>
        </div>
        <!-- 内容 -->
        <div class="x-body">
            <!-- 实时人数 -->
            <div class="row-box" v-if="active === 1">
                <div class="m-row w-auto col-mid info-row" >
                    <div class="col-1 m-col">
                        <img :src="vImgPath + '/logo_o.png'" :style="imgStyle" />
                    </div>
                    <div class="col-2 m-col">
                        <p class="p-title" :style="pStyle">景区实时人数</p>
                        <div class="user-num" :style="numStyle" v-html="peopleNum"></div>
                        <p class="p-copyright" :style="pStyle">内蒙古移动提供大数据支持</p>
                    </div>
                </div>
            </div>
            <div class="box-1" v-if="active === 1">
                <my-chart :o="o" key="c1" />
            </div>
            <div class="box-2" v-if="active === 2">
                <my-chart :o="o" key="c2" />
            </div>
            <div class="box-3" v-if="active === 3">
                <my-chart :o="o" key="c3" />
            </div>
        </div>
    </div>

</div>
</center-layer>
</template>

<script>
import 'lib/geo/china.js';
import 'lib/geo/neimenggu.js';
import chartUtil from 'util/chart';
import request from 'util/request';

const docHtml = document.documentElement;
const docBody = document.body;
const getHeight = () => {
    return docHtml.clientHeight || docBody.clientHeight;
};
const getUserNum = (list) => {
    let len = list.length;
    for (let i = len - 3; i >= 0; i--) {
        let item = list[i] || {};
        if (item.peopleNum !== undefined) {
            return item.peopleNum;
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
// tab1 实时人数
methods.fetchPeopleNum = function () {
    let sceneryId = this.id;
    let interval = 6 * 1000;
    request.getAttractionDetail(sceneryId).then((data) => {
        this.peopleNum = data.peopleNum;
        this.peopleNumTimer = setTimeout(this.fetchPeopleNum, interval);
    }).catch(() => {
        if (isNaN(this.peopleNum)) {
            this.peopleNum = '计算中';
        }
        this.peopleNumTimer = setTimeout(this.fetchPeopleNum, interval);
    });
};
methods.render1 = function (options = {}) {
    if (options.mode !== 'refresh') {
        this.o = null;
    }
    let sceneryId = this.id;
    request.getAttractionRealtime1(sceneryId).then((result) => {
        this.o = chartUtil.getRealtimePeopleOption({
            title: {
                text: '景区实时客流量',
                subtext: this.areaName
            },
            data: result
        });
    }).catch((r) => {
        this.o = 'empty';
    });
};
methods.render2 = function (options = {}) {
    if (options.mode !== 'refresh') {
        this.o = null;
    }

    request['getAttractionRealtime2'](this.id).then((result) => {
        this.o = chartUtil.getAttractionInOutOption({
            title: '迁入/迁出实时人数',
            subtitle: this.areaName,
            data: result
        });
    }).catch((r) => {
        this.o = 'empty';
    });
};
methods.render3 = function (options = {}) {
    if (options.mode !== 'refresh') {
        this.o = null;
    }
    
    this.realRender3();
};
methods.realRender3 = function () {
    let p1 = request.getAttractionSource1(this.id);
    let p2 = request.getAttractionSource12(this.id);
    p1.then((data1) => {
        p2.then((data2) => {
            this.o = chartUtil.getAttractionSource1Option({
                data: data1 || [],
                nmData: data2 || []
            });
        }).catch(() => {
            this.o = chartUtil.getAttractionSource1Option({
                data: data1 || []
            });
        })
    }).catch((e) => {
        this.o = 'empty';
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
computed.titleConfig = function () {
    return [
        {
            name: '景区流量监控',
            icon: 'fa-line-chart'
        },
        {
            name: '迁入/迁出流量分析',
            icon: 'fa-refresh'
        }
        /*
        {
            name: '景区客流来源排行',
            icon: 'fa-bar-chart-o'
        }
        */
    ];
};
var watch = {};
const created = function () {
    this.$on('handle-resize', this.setHeight);
    this.$on('window-resize', this.setHeight);
};
var mounted = function () {
    this.fetchPeopleNum();
};
const beforeDestroy = function () {
    clearTimeout(this.peopleNumTimer);
    this.$off('window-resize', this.setHeight);
    this.$off('handle-resize', this.setHeight);
};

let dataFunc = function () {
    var o = {
        peopleNum: '&nbsp;',
        h: getHeight()
    };
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [
        require('mixins/realtime_big.js')
    ],
    methods,
    computed,
    props: [],
    created,
    mounted,
    beforeDestroy,
    components: {
        'close-box': require('comp/chart_layer/close-box.vue')
    }
};
</script>

<style scoped lang="less">
@import "../../ref.less";
@chart-padding: 20px;
.x-body {
    padding: @chart-padding;
}
.info-row {
    width: 100%;
    border-radius: @common-radius;
    height: 100%;
    background-color: #fff;
}
.info-row .col-1 {
    text-align: right;
    width: 49%;
}
.info-row .col-2 {
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
.row-box {
    padding-bottom: @chart-padding / 2;
    height: 50%;
}
.box-1 {
    padding-top: @chart-padding / 2;
    height: 50%;
}
.box-2,
.box-3 {
    height: 100%;
}
</style>
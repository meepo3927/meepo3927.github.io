<template>
<div class="six-part six-part-5 inner-main">
    <div class="six-part-banner">
        <img :src="getBannerImg(4)" />
        <h3 v-text="sixTitle[4]"></h3>
        <h4 v-text="sixSubTitle[4]"></h4>
    </div>

    <!-- section 1 -->
    <div class="main-section mt15">
        <div class="six-intro-text" v-text="sixWholeDesc[4]"></div>

        <!-- 地图 -->
        <v-amap ref="map" slider="1" class="map-holder"
            @click="onMapClick"
            @radius-change="onRadiusChange" />
        <div class="category-box mt15">
            <!-- 选择分类 -->
            <div class="m-row-mid-auto category-row">
                <label for="">
                    <i class="fa fa-gift fa-static-width"></i>
                    广告商品分类：
                </label>
                <div class="pl5">
                    <select class="form-control" v-model="cate">
                        <option v-for="(v, i) in categories" 
                            v-text="v.text" :value="v.value"></option>
                    </select>
                </div>
            </div>

            <!-- 人数 -->
            <div class="col-num mt5" v-show="peopleCount !== ''">
                <i class="fa fa-user fa-static-width"></i>
                潜在客户数量： <span class="v-num">{{catePeopleCount}} {{percentText}}</span>
                <i class="fa fa-users fa-static-width ml40"></i>
                全部人群数量： <span class="v-num">{{peopleCount}}</span>

                <span class="text-muted ml50">（潜在客户：属性标签与商品有关联的客户）</span>
            </div>
        </div>
        <ul class="nav nav-tabs mt20" >
            <li :class="{active: tabIndex === 0}">
                <a href="javascript:;" @click="swichTab(0)">客群</a>
            </li>
            <li :class="{active: tabIndex === 1}">
                <a href="javascript:;" @click="swichTab(1)">偏好</a>
            </li>
        </ul>
        <div class="tab-content" v-if="tabIndex === 0">
            <div class="tab-content-wrapper" v-if="point">
                <div class="chart-1 grey-chart "><my-chart :o="o1" /></div>
            </div>
            <span v-else v-text="clickMapTip"></span>
        </div>
        <div class="tab-content" v-if="tabIndex === 1">
            <div class="tab-content-wrapper" v-if="point">
                <div class="chart-2 grey-chart "><my-chart :o="o2" /></div>
            </div>
            <span v-else v-text="clickMapTip"></span>
        </div>
    </div>
</div>
</template>

<script>
const tool = require('util/tool.js');

let methods = {};
methods.onMapClick = function (point) {
    this.point = point;
    this.$refs.map.drawMarkerCircle(point, {
        autoZoom: true
    });

    this.fetchRender();
};
methods.onRadiusChange = function () {
    if (!this.point) {
        return;
    }
    this.$refs.map.drawMarkerCircle(this.point, {
        autoZoom: true
    });
    this.fetchRender();
};
methods.swichTab = function (i) {
    if (i === this.tabIndex) {
        return;
    }
    this.tabIndex = i;
    if (this.tabIndex === 0) {
        this.fetchRender1();
    } else {
        this.fetchRender2();
    }
};
methods.fetchRender = function () {
    this.fetchRenderNum();
    if (this.tabIndex === 0) {
        this.fetchRender1();
    } else {
        this.fetchRender2();
    }
};
methods.fetchRenderNum = function () {
    // 人数
    let p = this.getRequestParam();
    p.func = 'custLabelNumByDis';
    let req = this.vRequest.fetch3('/rest/custService', p);
    this.pointData = null;
    this.peopleCount = '查询中';
    this.setPromise('custLabelNumByDis', req).then((result) => {
        // 分类人数
        this.pointData = result;

        // 总人数
        let all = 0;
        tool.eacho(result, (v, k) => {
            if (k.substr(0, 3) === 'h00') {
                all += v;
            }
        });
        this.peopleCount = all;
    });
};
methods.fetchRender1 = function () {
    // 图表1
    let p = this.getRequestParam();
    p.func = 'goodsTypeCustNumRank';
    const req = this.vRequest.fetch3('/rest/adService', p);
    this.o1 = null;
    this.setPromise('fetchRender1', req).then((data) => {
        this.o1 = this.getGoodsOption(data);
    }).catch(() => {
        this.o1 = 'empty';
    });
};
methods.fetchRender2 = function () {
    let p = this.getRequestParam();
    p.func = 'appOpenRank';
    const req = this.vRequest.fetch3('/rest/adService', p);
    this.o2 = null;
    this.setPromise('fetchRender2', req).then((data) => {
        this.o2 = this.getAppOption(data);
    }).catch((e) => {
        this.o2 = 'empty';
        LOG(e);
    });
};
methods.getGoodsOption = function (data) {
    data = data.sort((a, b) => {
        return (a.totalNum - b.totalNum);
    });
    return this.getHorizontalBar({
        title: {
            text: 'TOP10商品分类人群数量'
        },
        xAxis: {
            axisLabel: {show: false},
            axisTick: {show: false}
        },
        yAxis: {
            data: data.map(v => v.labelName)
        },
        series: [{
            data: data.map(v => v.totalNum)
        }]
    });
};
methods.getAppOption = function (data) {
    data.sort((a, b) => {
        return a.times - b.times;
    });
    return this.getHorizontalBar({
        title: {
            text: 'TOP10APP打开次数'
        },
        xAxis: {
            axisTick: {show: false},
            axisLabel: {show: false}
        },
        yAxis: {
            data: data.map(v => v.appName)
        },
        series: [{
            name: '打开次数',
            data: data.map(v => v.times)
        }]
    });
};
let computed = {};
computed.catePeopleCount = function () {
    if (this.peopleCount === '查询中') {
        return '查询中';
    }
    if (!this.pointData || !this.cate) {
        return 0;
    }
    let key = this.cate.toLowerCase() + 'Num';
    if (this.pointData[key]) {
        return this.pointData[key];
    }
    return 0;
};
computed.percentText = function () {
    if (isNaN(this.catePeopleCount) || isNaN(this.peopleCount) || this.peopleCount == 0) {
        return '';
    }
    let percent = Math.round(this.catePeopleCount * 10000 / this.peopleCount) / 100;
    return'（' + percent + '%）';
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.vRequest.goodsTypes().then((arr) => {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (!arr[i]) {
                arr.splice(i, 1);
            }
        }
        this.categories = arr.map((v) => {
            return {
                text: v.typeName,
                value: v.typeCode
            };
        });
        this.cate = arr[0].typeCode;
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        cate: null,
        categories: [],
        pointData: null,
        peopleCount: '',
        o1: null,
        o2: null,
        tabIndex: 0
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
    mixins: [
        require('mixins/six_part.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@chart-height: 320px;
.six-part-5 {
}
.map-holder {
    height: 460px;
}
.section-content {
    padding: 12px 2px;
}
.category-row > label {
    font-size: 18px;
}
.nav-tabs > li > a {
    width: 80px;
}
.col-icon {
    background-color: #4693db;
    border-radius: 50%;
    display: inline-block;
    height: 64px;
    width: 64px;
    text-align: center;
    i.fa {
        color: #fff;
        font-size: 36px;
        margin-top: 15px;
    }
}
.col-num {
    padding-top: 5px;
    font-size: 18px;
    .v-num {
        vertical-align: -1px;
    }
    .text-muted {
        font-size: 13px;
    }
}
.count-tip {
    margin-left: 30px;
}
.chart-1,
.chart-2 {
    height: @chart-height;
}
</style>

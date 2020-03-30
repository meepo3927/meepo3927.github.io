<template>
<div class="six-part six-part-4 inner-main">
    <div class="six-part-banner">
        <img :src="getBannerImg(3)" />
        <h3 v-text="sixTitle[3]"></h3>
        <h4 v-text="sixSubTitle[3]"></h4>
    </div>

    <!-- section 1 -->
    <div class="main-section mt15">
        <div class="six-intro-text">针对传统选址周期长、成本高，选址缺乏目的性，选址效果难保证等痛点，整合内蒙位置数据、用户属性和偏好数据、公开的POI数据区域商业数据，以匿名和聚合的方式为商家提供低成本、灵活、高效、精确的门店选址决策服务，改善经营效能，提升门店竞争力。对时段和区域内客流规模、变化规律、客户特征进行精准洞察， 帮助商户在店铺选址和精准营销中提供高价值的参考信息。可提供选定备选区域、选定目标客户群和定制特殊区域三类选址方式。</div>

        <!-- 地图 -->
        <v-amap ref="map" slider="1" class="map-holder"
            @click="onMapClick"
            @radius-change="onRadiusChange" />
        <!-- tab切换 -->
        <ul class="nav nav-tabs mt20">
            <li v-for="(v, i) in tabs" :class="{active: i === tabIndex}">
                <a href="javascript:;" v-text="v" @click="switchTab(i)"></a>
            </li>
        </ul>
        <!-- 客群 -->
        <div class="tab-content tab-content-0" v-if="tabIndex === 0">
            <div class="chart-wrapper" v-if="point">
                <div class="chart-1" key="o1"><my-chart :o="o1" /></div>
                <div class="chart-1" key="o2"><my-chart :o="o2" /></div>
                <div class="chart-1" key="o3"><my-chart :o="o3" /></div>
            </div>
            <span v-else v-text="clickMapTip"></span>
        </div>
        <!-- 偏好 -->
        <div class="tab-content tab-content-1" v-if="tabIndex === 1">
            <div class="chart-wrapper" v-if="point">
                <div class="chart-2" key="o4"><my-chart :o="o4" /></div>
                <div class="chart-2" key="o5"><my-chart :o="o5" /></div>
                <div class="chart-2" key="o6"><my-chart :o="o6" /></div>
            </div>
            <span v-else v-text="clickMapTip"></span>
        </div>
        <!-- 出行 -->
        <div class="tab-content tab-content-2" v-if="tabIndex === 2">
            <div class="chart-wrapper" v-if="point">
                <div class="chart-3" key="o7"><my-chart :o="o7" /></div>
                <div class="chart-3" key="o8"><my-chart :o="o8" /></div>
            </div>
            <span v-else v-text="clickMapTip"></span>
        </div>
    </div>
</div>
</template>

<script>
const tool = require('util/tool.js');

const NAVI_HASH = {
    amapMapUseNum: '高德地图',
    baiduMapUseNum: '百度地图',
    sosomapUseNum: '腾讯地图',
    googleMapUseNum: '谷歌地图',
    iphoneMapUseNum: '苹果地图',
    otherMapUseNum: '其他地图'
};
const PHONE_HASH = {
    iphoneUseNum: 'IPhone',
    hwPhoneUseNum: '华为',
    miPhoneUseNum: '小米',
    oppoPhoneUseNum: 'OPPO',
    vivoPhoneUseNum: 'VIVO',
    othrPhoneUseNum: '其他'
};
const NEWS_HASH = {
    todayFrpaUseNum: '今日头条',
    sohuNewsUseNum: '搜狐新闻',
    sohuFsUseNum: '搜狐快站',
    neteNewsUseNum: '网易新闻',
    nnbUseNum: '新闻联播',
    qqBrowUseNum: 'QQ浏览器'
};
const TRAFFIC_HASH = {
    driveOutColNum: '驾车',
    bustrOutColNum: '公交',
    elecarOutColNum: '电动车',
    bikeOutColNum: '自行车',
    walkOutColNum: '步行'
};

let methods = {};
methods.switchTab = function (i) {
    if (i === this.tabIndex) {
        return;
    }
    this.tabIndex = i;
    if (this.point) {
        this.fetchRender();
    }
};
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
methods.getMapInfo = function (num) {
    var info = [];
    info.push('<p style="padding-top: 10px;">商圈总人数：' + num + '</p>');
    return info;
};
methods.fetchRender = function () {
    let point = this.point;
    // 显示总人数
    const totalReq = this.vRequest.totalCustDisNum(point, this.$refs.map.radius);
    this.setPromise('totalReq', totalReq).then((data) => {
        this.$refs.map.showMapInfo(this.getMapInfo(data.totalNum), point);
    }).catch(() => {
    });
    let func = 'fetchRender' + this.tabIndex;
    this.$nextTick(this[func]);
};
// 客群
methods.fetchRender0 = function () {
    let p = this.getRequestParam();
    p.func = 'custLabelNumByDis';
    const req = this.vRequest.fetch3('/rest/custService', p);
    this.o1 = this.o2 = this.o3 = null;
    this.setPromise('fetchRender', req).then((data) => {
        this.o1 = this.getGenderOption(data);
        this.o2 = this.getAgeOption(data);
        this.o3 = this.getCarrerOption(data);
    }).catch((e) => {
        this.o1 = this.o2 = this.o3 = 'empty';
    });
};
// 偏好
methods.fetchRender1 = function () {
    let p = this.getRequestParam();
    p.func = 'rptByDistance';
    const req = this.vRequest.fetch3('/rest/storeLocation', p);
    this.o4 = this.o5 = this.o6 = null;
    this.setPromise('fetchRender', req).then((data) => {
        this.o4 = this.getNaviOption(data);
        this.o5 = this.getPhoneOption(data);
        this.o6 = this.getNewsOption(data);
    }).catch((e) => {
        this.o4 = this.o5 = this.o6 = 'empty';
        LOG(e);
    });
};
// 出行
methods.fetchRender2 = function () {
    let p = this.getRequestParam();
    p.func = 'rptByDistance';
    const req = this.vRequest.fetch3('/rest/storeLocation', p);
    this.o7 = this.o8 = null;
    this.setPromise('fetchRender', req).then((data) => {
        this.o7 = this.getOutTimeOption(data);
        this.o8 = this.getTrafficOption(data);
    }).catch((e) => {
        this.o7 = this.o8 = 'empty';
        LOG(e);
    });
};
methods.getNaviOption = function (data) {
    let mapData = tool.filterHashData(NAVI_HASH, data, {
        sort: true, filter: false
    });
    return this.getHorizontalBar({
        title: {
            text: '交通导航'
        },
        xAxis: {
            axisLabel: {show: false}
        },
        yAxis: {
            data: mapData.map(v => v.name)
        },
        series: [{
            name: '打开次数',
            data: mapData.map(v => v.value)
        }]
    });
};
methods.getPhoneOption = function (data) {
    let f = tool.filterHashData(PHONE_HASH, data, {
        sort: 2
    });
    return this.getVerticalBar({
        title: {text: '设备品牌'},
        xAxis: {
            data: f.map(v => v.name)
        },
        series: [{
            data: f.map(v => v.value)
        }]
    });
};
methods.getNewsOption = function (data) {
    let f = tool.filterHashData(NEWS_HASH, data, {
        sort: true, filter: false
    });
    return this.getHorizontalBar({
        title: {text: '新闻阅读'},
        xAxis: {
            axisLabel: {show: false}
        },
        yAxis: {
            data: f.map(v => v.name)
        },
        series: [{
            name: '打开次数',
            data: f.map(v => v.value)
        }]
    });
};
methods.getOutTimeOption = function (data) {
    return this.getHorizontalBar({
        title: {text: '出行时间'},
        xAxis: {
            axisLabel: {show: false}
        },
        yAxis: {
            data: [
                '21-24时', '18-21时', '15-18时',
                '12-15时', '9-12时', '6-9时', '0-6时'
            ]
        },
        series: [{
            name: '人数',
            data: [
                data.outCol2124Hou, data.outCol1821Hou,
                data.outCol1518Hou, data.outCol1215Hou,
                data.outCol912Hou, data.outCol09hou,
                data.outCol06hou
            ]
        }]
    });
};
methods.getTrafficOption = function (data) {
    let r = tool.filterHashData(TRAFFIC_HASH, data, {
        sort: 2, filter: false
    });
    return this.getVerticalBar({
        title: {
            text: '交通工具'
        },
        xAxis: {
            data: r.map(v => v.name),
            axisLabel: {
                interval: 0
            }
        },
        series: [{
            name: '人数',
            data: r.map(v => v.value)
        }]
    });
};
let computed = {};
computed.tabs = function () {
    return ['客群', '偏好', '出行']
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        tabIndex: 0
    };
    for (let i = 1; i <= 8; i++) {
        o['o' + i] = null;
    }
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
.six-part-4 {
}
.map-holder {
    height: 460px;
}
.nav-tabs > li > a {
    width: 80px;
}

.chart-wrapper {
    font-size: 0;
}

// 图表
.chart-1 {
    display: inline-block;
    height: @chart-height;
    &:nth-child(1) {
        width: 30%;
    }
    &:nth-child(2) {
        width: 34%;
        padding-left: 20px;
    }
    &:nth-child(3) {
        width: 35%;
        padding-left: 30px;
    }
}
.chart-2 {
    display: inline-block;
    height: @chart-height;
    width: 33.3%;
}
.chart-3 {
    display: inline-block;
    height: @chart-height;
    width: 50%;
    &:nth-child(1) {
        padding-right: 30px;
    }
    &:nth-child(2) {
        padding-left: 30px;
    }
}
</style>

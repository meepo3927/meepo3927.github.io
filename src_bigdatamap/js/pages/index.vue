<template>
<div class="page-index" :class="rootClass">
    <div class="only-home-view" v-show="isHomeView">
        <h1 >
            <img :src="getImageUrl('/white_logo.png')" /> 内蒙古东方万里大数据平台
        </h1>

        <!-- 总人数 -->
        <div class="nm-total-layer">
            <corner-box>
                <div class="m-row-auto">
                    <div class="col-1">
                        <span><i class="iconfont icon-renqun"></i></span>
                    </div>
                    <div class="col-2">
                        <div class="v-line-1">
                            <strong v-text="nmTotalText"></strong>
                            <span v-show="nmTotalText">人</span>
                        </div>
                        <div class="v-line-2" v-text="nmMonthText"></div>
                    </div>
                </div>
            </corner-box>
        </div>

        <!-- 交通方式 -->
        <ul class="transport-mode-list" v-if="transData">
            <li v-for="(v, i) in transData" :class="getTransClass(i)">
                <div class="v-num" v-text="getTransNumText(v)"></div>
                <div class="line-2">
                    <i class="iconfont" :class="getTransIcon(v)"></i>
                    <span>乘坐{{v.transDesc}}人数</span>
                </div>
            </li>
        </ul>
    </div>
    <div class="main-wrapper">
        <!-- 地图 -->
        <div class="circle-wrapper">
            <v-bmap class="map-wrapper" ref="map" :maptype="mapType"
                @set-city="enterCity"
                @tilesloaded="tilesloaded"
                @moving="onMoving" />
        </div>
        <!-- arrow -->
        <div id="imgview"></div>
        <!-- percent 文字 -->
        <div id="cname"></div>
    </div>
    <!-- 工具条 -->
    <div class="toolbar" v-if="isCityView">
        <ul>
            <li class="li-1">
                <a href="javascript:;" @click="backHome" title="返回首页">
                    <i class="fa fa-home"></i>
                </a>
            </li>
            <li class="li-2">
                <a href="javascript:;" title="显隐分析浮层" @click="layerToggle">
                    <i class="iconfont icon-07_tongjifenxi"></i>
                </a>
            </li>
        </ul>
    </div>
    <!-- 浮层 -->
    <my-layer v-if="isCityView" :visible="layerVisible"
        @setstep="setStep" 
        @hide-click="layerHideClick" />
    <!-- 四角阴影 -->
    <div class="corner-cover" v-show="cornerCoverVisible"></div>
    <!-- 左下导航条-->
    <corner-nav class="corner-nav"
        :list="cornerNav"
        :action="cornerAction"
        @click="onCornerClick"
        @enter="onCornerEnter" />
    <!-- 时间轴 -->
    <v-timeline v-if="timelineVisible" @pause="onTimelinePause" @start="onTimelineStart"
        :value="timelineValue"
        :paused="timelinePaused"  />
    <!-- 切换地图 -->
    <div class="maptype-switch" v-if="isCityView"
        :class="['type-' + this.mapType]">
        <button type="button" @click="switchMapType"></button>
        <span v-text="mapTypeButtonText"></span>
    </div>
</div>
</template>

<script>
require('root');
require('lib/echarts-gl.min.js');
const context = require('global/tomap/context.js');
const LR = require('global/tomap/LR.js');
const $ = require('jquery');
const Store = require('global/store.js');
const loadImg = require('util/loadimg.js');
const Calendar = require('util/calendar.js');
const tool = require('util/tool.js');
const URL = require('util/url.js');

const rotateDuration = 6500;
const animDuration = 3000;
const IS_DEBUG = (URL.query().debug === '3');
let methods = {};
methods.switchMapType = function () {
    if (this.mapType === 'default') {
        this.mapType = 'satellite';
    } else {
        this.mapType = 'default';
    }
};
methods.layerHideClick = function () {
    this.layerVisible = false;
};
methods.layerToggle = function () {
    this.layerVisible = !this.layerVisible;
};
methods.tilesloaded = function () {
    // 地市的轮廓和名字
    this.map.drawBorders();
    this.mapInstance = this.map.map;
    if (IS_DEBUG) {
        this.startAnim();
    }
};
methods.onResize = function () {
    clearTimeout(this.resizeTimer);
    if (this.isHomeView) {
        this.resizeTimer = setTimeout(() => {
            this.map.reCenter();
        }, 150);
    };
};
methods.onCornerClick = function (item, i) {
    if (this.cornerClick) {
        this.cornerClick(item, i);
    }
};
methods.onCornerEnter = function (item, i) {
    if (this.cornerEnter) {
        this.cornerEnter(item, i);
    }
};
methods.onTimelineStart = function () {
    if (this.timelineStartCallback) {
        this.timelineStartCallback();
    }
};
methods.onTimelinePause = function () {
    if (this.timelinePauseCallback) {
        this.timelinePauseCallback();
    }
};
// 拉近视角
methods.enterEarth = function () {
    this.$refs.earth.set({
        animationDurationUpdate: animDuration,
        globe: {
            viewControl: {
                distance: 50
            }
        }
    });
    setTimeout(() => {
        $(this.$refs.gl).fadeOut(3000);
        setTimeout(this.startAnim, 1000);
    }, animDuration - 1000);
};
// 定位到中国
methods.initEarth = function () {
    this.$refs.earth.set({
        globe: {
            viewControl: {
                targetCoord: this.vConfig.geoCoordMapArray['呼和浩特']
            }
        }
    });
    setTimeout(() => {
        this.enterEarth();
    }, rotateDuration - 1500);
};
// 绘制地图chart
methods.renderEarth = function () {
    let worldImgSrc = this.getImageUrl('/earth/world.jpg');
    let backImgSrc = this.getImageUrl('/earth/starfield.jpg');
    let o = {
        backgroundColor: '#000',
        animationDurationUpdate: rotateDuration,
        globe: {
            baseTexture: worldImgSrc,
            heightTexture: worldImgSrc,
            displacementScale: 0.04,
            shading: 'realistic',
            environment: backImgSrc,
            realisticMaterial: {
                roughness: 0.9
            },
            postEffect: {
                enable: true
            },
            viewControl: {
                autoRotate: false,
                distance: 170
            },
            light: {
                main: {
                    intensity: 1,
                    shadow: true
                },
                ambientCubemap: {
                    texture: this.getImageUrl('/earth/pisa.hdr'),
                    diffuseIntensity: 0.2
                }
            }
        }
    };
    this.o = o;
    let arr = [worldImgSrc, backImgSrc];
    loadImg(arr, () => {
        setTimeout(this.initEarth, 600);
    });
};

// 回到首页
methods.backHome = function () {
    if (this.view === 'home') {
        return;
    }
    this.view = 'home';
    this.stageBackHome();
};
// 进入地市
methods.enterCity = function (city) {
    // 只有这些数据
    const CITYID_WHITE_LIST = [471, 472];
    if (CITYID_WHITE_LIST.indexOf(city.id * 1) < 0) {
        return this.$msg('暂未开放');
    }
    Store.commit('setCity', city);
    this.layerVisible = true;
    this.view = 'city';
    this.stageCleanHome();
    this.stageEnterCity();
    let point = this.vConfig.geoCoordMap[city.name];
    setTimeout(() => {
        this.map.centerAndZoom(new BMap.Point(point.lng, point.lat), 13);
    }, 50);
};
methods.getLastMonth = function () {
    let d = new Date();
    let m = d.getMonth();
    if (m === 0) {
        return 12;
    }
    if (m < 10) {
        return '0' + m;
    }
    return m;
};
methods.startAnim = function () {
    this.stopAnim();
    let req = this.sourceRequest;
    this.month = this.getLastMonth();
    if (!this.transData) {
        this.setPromise('sourceByTransportMode', req).then((data) => {
            //this.month = curMonth.getMonth() + 1;
            this.lrArrowIndex = 0;
            this.lrStart(data);
            this.transData = data;
        }).catch(() => {
        });
    } else {
        this.lrArrowIndex = 0;
        this.lrStart(this.transData);
    }
};
methods.stopAnim = function () {
    this.lrCleanArrow();
};
methods.onMoving = function () {
    this.lrDraw();
};

methods.getCenter = function () {
    let p = this.map.map.getCenter();
    LOG(p.lng + ',' + p.lat);
};
methods.getTransClass = function (i) {
    let n = i + 1;
    let arr = ['item-' + n];
    if (i === this.lrArrowIndex) {
        arr.push('active');
    }
    return arr;
};
methods.getTransNum = function (item) {
    let num = 0;
    item.transData.forEach((v) => {
        num += v.userNum
    });
    return num;
};
methods.getTransNumText = function (item) {
    return tool.addNumDot(this.getTransNum(item))
};
methods.getTransIcon = function (item) {
    let map = {
        '飞机': 'icon-feiji',
        '火车': 'icon-huoche',
        '汽车': 'icon-qiche-copy'
    };
    return map[item.transDesc];
};
let computed = {};
computed.rootClass = function () {
    let arr = ['view-' + this.view];

    if (this.timelineVisible) {
        arr.push('timeline-visible');
    }
    return arr;
};
computed.isCityView = function () {
    return (this.view === 'city')
};
computed.isHomeView = function () {
    return (this.view === 'home');
};
computed.nmTotalText = function () {
    if (!this.nmTotalNum) {
        return '';
    }
    return tool.addNumDot(this.nmTotalNum);
};
computed.nmTotalNum = function () {
    if (!this.transData) {
        return 0;
    }
    let num = 0;
    this.transData.forEach((v) => {
        v.transData.forEach((v2) => {
            num += v2.userNum;
        });
    });
    return num;
};

computed.nmMonthText = function () {
    if (!this.month) {
        return '';
    }
    return '内蒙古' + this.month + '月来访人数'
};
computed.cornerAction = function () {
    return !!(this.cornerEnter || this.cornerClick);
};
computed.mapTypeButtonText = function () {
    if (this.mapType === 'satellite') {
        return '矢量地图';
    } else {
        return '卫星地图';
    }
};
computed.cornerCoverVisible = function () {
    return (this.mapType === 'satellite')
};

let watch = {};
const created = function () {
    //let prevMonth = Calendar.getOffsetDate(new Date, -1, 'month');
    //let curMonth = new Date();
    let p = {
        date: '201807'
    };
    this.sourceRequest = this.vRequest.fetch2('/sourceByTransportMode', p);
};
const mounted = function () {
    $(document.body).addClass('vm-ready');
    window.VM = this;
    window.addEventListener('resize', this.onResize);
    this.startAnim();
    this.map = this.$refs.map;
};
const beforeDestroy = function () {
    this.stopAnim();
};
const dataFunc = function () {
    let o = {
        o: null,
        cornerNav: undefined,
        transData: undefined,
        month: '',
        view: 'home',
        mapType: 'satellite',
        layerVisible: true,
        cornerEnter: undefined,
        cornerClick: undefined
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
        require('mixins/stage.js'),
        require('mixins/lr_arrow.js')
    ],
    beforeDestroy,
    components: {
        'my-layer': require('comp/index-layer.vue'),
        'v-bmap': require('comp/bmap.vue'),
        'v-arrow': require('comp/arrow.vue'),
        'my-chart': require('comp/common/my-chart.vue'),
        'corner-nav': require('comp/corner-nav.vue'),
        'v-timeline': require('comp/timeline.vue'),
        'corner-box': require('comp/corner-box.vue')
    }
};
</script>

<style scoped lang="less">
@import "../ref";
@circle-size:     880px;

.page-index {
    // perspective: 800px;
    // perspective-origin: 50% 50%;
    h1 {
        position: absolute;
        z-index: 10090;
        top: 30px;
        left: 30px;
        color: #fff;
        img {
            width: 61px;
            height: 60px;
        }
    }
    .corner-nav {
        bottom: 30px;
        left: 40px;
    }
}
.page-index.timeline-visible {
    .corner-nav {
        bottom: 66px;
    }
}
.page-index.view-home {
    .circle-wrapper {
        margin: auto;
        margin-top: ~'calc(50vh - 440px)';
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, .7);
        // background-color: rgb(52, 73, 94);
        // opacity: 0.8;
        box-shadow: 0px 35px 14px 1px rgba(1, 14, 17, .8);
    }
    .map-wrapper {
        margin-left: ~'calc(440px - 50vw)';
    }
}
.page-index.view-city {
    #cname {
        visibility: hidden;
    }
    .circle-wrapper {
        width: 100%;
        height: 100%;
    }
}
.main-wrapper {
    // transform: rotateX(60deg) translateZ(150px);
    // transform-style: preserve-3d;
    // transform-origin: center bottom;
    // width: 90vw;
    padding-top: 1px;
    width: 100vw;
    position: relative;
    height: 100vh;
    z-index: 1;
}
.circle-wrapper {
    width: @circle-size;
    height: @circle-size;
    border-radius: 50%;
}
.map-wrapper {
    width: 100vw;
    height: 100%;
}
.test-layer {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 10000;
}
.gl-chart {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 50000;
}
.toolbar {
    position: fixed;
    z-index: 10070;
    top: @layer-top - 3px;
    right: 15px;
    ul > li,
    ul > li > a {
        display: block;
        border-radius: 50%;
        border: 1px solid @theme-color;
        text-align: center;
    }
    ul > li {
        padding: 6px;
        margin-bottom: 15px;
    }
    ul > li > a {
        width: 44px;
        height: 44px;
        line-height: 44px;
        color: #fff;
        background-color: rgba(0, 0, 0, .5);
        i {
            font-size: 28px;
        }
        &:hover {
            background-color: @theme-color;
            color: rgba(0, 0, 0, .5);
        }
    }
    ul > li.li-1 > a {
        line-height: 50px;
    }
}
.nm-total-layer {
    width: 394px;
    height: 120px;
    z-index: 5000;
    position: absolute;
    top: 30px;
    right: 50px;
    background-image: url("../../images/index/grid_bg_1.png");
    background-repeat: no-repeat;
    background-position: center center;
    .m-row-auto {
        color: @orange-color;
        margin-top: 25px;
        .col-1 {
            width: 140px;
            padding-left: 50px;
            padding-top: 4px;
            span {
                display: inline-block;
                width: 60px;
                height: 60px;
                background-color: rgba(249, 194, 17, .3);
                text-align: center;
                line-height: 62px;
                border: 1px solid @orange-color;
                i {
                    font-size: 42px;
                }
            }
        }
        .col-2 {
            padding-left: 0px;
            .v-line-1 {
                line-height: 36px;
                margin-left: -5px;
                strong {
                    font-size: 40px;
                    font-weight: normal;
                    font-family: 'Arial';
                }
                span {
                    font-size: 18px;
                    vertical-align: 2px;
                }
            }
            .v-line-2 {
                font-size: 16px;
            }
        }
    }
}
.transport-mode-list {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -220px;
    margin-left: (@circle-size / 2);
    z-index: 5000;
    & > li {
        background: url("../../images/index/traffic_block_bg.png") no-repeat 0 0;
        width: 290px;
        height: 100px;
        position: relative;
        color: @orange-color;
        padding: 5px;
        margin-bottom: 100px;
        opacity: .3;
        transition: opacity 1.5s ease 0s;
        &:nth-last-child(1) {
            margin-bottom: 0;
        }
        &.active {
            opacity: 1;
        }
        &.item-2 {
            margin-left: 30px;
        }
        & > .v-num {
            font-family: 'Arial';
            font-size: 22px;
            position: absolute;
            top: 5px;
            left: 215px;
        }
        & > .line-2 {
            margin-top: 20px;
            i {
                font-size: 44px;
                margin-left: 24px;
                line-height: 50px;
            }
            span {
                font-size: 16px;
                color: @theme-color;
                margin-left: 20px;
                vertical-align: 12px;
            }
        }
    }
}
.maptype-switch {
    position: absolute;
    right: 40px;
    bottom: 30px;
    padding: 8px;
    border-radius: 8px;
    background-color: rgba(33, 33, 33, .5);
    z-index: 8000;
    span {
        background-color: #76BAFF;
        position: absolute;
        right: 8px;
        bottom: 8px;
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
    }
    button {
        border: none;
        display: block;
        width: 86px;
        height: 60px;
        padding: 0;
        background: url("../../images/map/maptype.png") no-repeat;
        opacity: .8;
    }
    &.type-default > button {
        background-position: 0 -60px;
    }
    &.type-satellite > button {
        background-position: 0 0;
    }
}

</style>

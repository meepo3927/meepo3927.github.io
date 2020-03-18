<template>
<div class="banner-slide">
    <div class="carousel slide" id="bannerCarousel" ref="carousel">
        <ol class="carousel-indicators">
            <li data-target="#bannerCarousel" v-for="(v, i) in list"
                :data-slide-to="i"
                :class="{active: i === 0}"></li>
        </ol>
        <div class="carousel-inner" >
            <div class="item " v-for="(v, i) in list" :class="{active: i === 0}"
                @click="onItemClick(v)">
                <img :src="getSrc(v)" />
                <div class="text-content">
                    <div class="v-title">
                        <strong>"{{v.title}}"</strong>——{{v.subtitle}}
                    </div>
                    <p v-text="v.intro"></p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
const $ = require('jquery');
require('bootstrap');

let methods = {};
methods.onItemClick = function (item) {
    this.$emit('click', item);
};
methods.initSlide = function () {
    $(this.$refs.carousel).carousel({
        interval: 3500
    });
};
methods.getSrc = function (item) {
    return this.vImgPath + '/banner/' + item.name + '.png';
};
let computed = {};
computed.list = function () {
    return [
        {
            name: 'travel',
            title: '远方',
            subtitle: '旅游大数据平台',
            intro: '旅游大数据平台，采用数据流处理技术，实时监控各地旅游景区客流量，包括实时迁入迁出人数，通过离线数据分析景区客流趋势、人群分布、人群特征等。'
        },
        {
            name: 'publico',
            title: "风云",
            subtitle: '数据监控舆情动态',
            intro: '通过整合移动用户上网行为数据，结合大数据平台文本挖掘技术进行舆情监控，包括特定区域和特定人群，可快速、准确、灵活的监测互联网上的舆论信息，全面掌握互联网舆情动态，为正确的舆论引导提供依据。'
        },
        {
            name: 'civil',
            title: '征途',
            subtitle: '绘制纵横交通网络',
            intro: '通过位置信令数据的整合，分析人群迁徙动向，包括点对点迁徙和旅途中转情况，横向观察多级人群流向，纵向分析单点客流变化，交通规律一目了然，使得路径优化有迹可循。'
        },
        {
            name: 'report',
            title: '速析',
            subtitle: '分析报告一键生成',
            intro: '景区分析报告自动生成，只需选择时间、景区，即可生成景区游客到访情况，以及客流、行为、偏好等整体变化，多维度聚合处理，多视角观察，达到真正的一键分析。'
        },
        {
            name: 'monitor',
            title: '鹰眼',
            subtitle: '实时监控人群分布',
            intro: '针对旅游景区、广场、会展中心、公园等指定区域内的人口分布，通过数据可视化展示，结合数据报表，反映人口的分布，实时监控人口密度，助力区域人口管理、公共安全监控、商业选址等。'
        }
    ]
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.BannerSlide = this;
    this.$nextTick(this.initSlide);
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
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
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
.banner-slide {
    
}
.carousel-inner > .item {
}
.text-content {
    position: absolute;
    left: 15%;
    width: 40%;
    top: 20%;
    
    color: #fff;
    .v-title {
        font-size: 32px;
        margin-bottom: 18px;
        strong {
            font-size: 36px;
        }
    }
    p {
        padding-left: 4px;
        font-size: 24px;
        line-height: 40px;
        letter-spacing: 4px;
        color: #eee;
        font-weight: lighter;
    }
}
</style>

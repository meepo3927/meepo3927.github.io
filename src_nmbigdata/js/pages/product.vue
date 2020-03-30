<template>
<div class="page-product">
    <v-header active="2" @jump-product="jumpProduct" />
    
    <div class="page-banner">
        <img :src="getImageUrl('/product/banner.png')" class="page-banner-img" />
        <div class="text-content">
            <h3>大数据产品案例</h3>
            <h5>Bigdata Online Product Case</h5>
            <p>依托内蒙古东方万里大数据六大核心能力，打造一系列成熟的小而美的大数据产品，为企业运营决策提供权威大数据支撑！</p>
        </div>
    </div>

    <div class="inner-main">
        <!-- 总视频 -->
        <h3 class="section-title">
            <i class="fa fa-video-camera"></i>
            视频介绍
        </h3>
        <all-video />
        <!-- 产品案例 -->
        <h3 class="section-title" ref="title2">
            <img :src="getImageUrl('/index/product.png')" />
            产品案例
        </h3>

        <pro-list @play="onPlay" />
    </div>
    <video-layer ref="productVideo" />
    <v-backtop />
    <v-copyright />
</div>
</template>

<script>
const URL = require('util/url.js');
const scrollTo = require('util/scroll_to.js');
let methods = {};
methods.jumpProduct = function () {
    scrollTo(this.$refs.title2, {y: 55});
};
methods.onPlay = function (item) {
    this.$refs.productVideo.play(item.name);
};
methods.initView = function () {
    let name = URL.query().name;
    if (name) {
        this.jumpProduct();
    }
};
methods.initVideo = function () {
    let name = URL.query().name;
    if (name) {
        this.$refs.productVideo.play(name);
    }
};
let computed = {};

let watch = {};
const created = function () {};
const mounted = function () {
    this.$nextTick(this.initVideo);
    setTimeout(this.initView, 100);
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {

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
        require('mixins/pageCommon.js')
    ],
    beforeDestroy,
    components: {
        'pro-list': require('comp/product-list.vue'),
        'all-video': require('comp/product-all-video.vue'),
        'video-layer': require('comp/product-video-layer.vue')
    }
};
</script>

<style scoped lang="less">
@import "../ref";
.page-product {
    
}

</style>

<template>
<div class="page-solution">
    <v-header active="3"/>
    
    <div class="page-banner">
        <img :src="getImageUrl('/solution/banner.png')" class="page-banner-img" />
        <div class="text-content">
            <h3>行业解决方案</h3>
            <h5>Industry Technology Solutions</h5>
            <p>依托东方万里大数据六大核心能力，直击行业痛点，为旅游、金融、交通、政府等行业提供大数据整体解决方案，让大数据改变生活！</p>
        </div>
    </div>

    <div class="inner-main">
        <h3 class="section-title" ref="t1">
            <img :src="getImageUrl('/index/six.png')" />
            行业解决方案
        </h3>

        <div class="clearfix">
            <!-- 左 -->
            <div class="box-left">
                <ul class="left-nav" v-sticky>
                    <li v-for="(v, i) in solutions" :class="{active: i === navIndex}">
                        <a href="javascript:;" v-text="v.name" @click="onNavClick(v, i)"></a>
                    </li>
                </ul>
            </div>

            <!-- 右 -->
            <div class="box-right">
                <div :is="compPart"></div>
            </div>
        </div>
    </div>
    <v-backtop />
    <v-copyright />
</div>
</template>

<script>
let URL = require('util/url.js');
const scrollTo = require('util/scroll_to.js');
let methods = {};
methods.onNavClick = function (v, i) {
    if (this.navIndex === i) {
        return;
    }
    this.navIndex = i;
    location.hash = 'nav-' + i;
};
methods.initView = function () {
    if (location.hash.indexOf('nav-') >= 0) {
        scrollTo(this.$refs.t1, {y: 60});
    }
};
let computed = {};
computed.compPart = function () {
    let n = this.navIndex + 1;
    return 'part-' + n;
};
let watch = {};
const created = function () {};
const mounted = function () {
    setTimeout(this.initView, 100);
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let r = URL.getHashArray();
    let navIndex = 0;
    if (r[0] === 'nav' && r[1]) {
        navIndex = parseInt(r[1], 10);
    }
    let o = {
        navIndex
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
        require('mixins/pageCommon.js'),
        require('mixins/solution.js')
    ],
    beforeDestroy,
    components: {
        'part-1': require('comp/solution-part-1.vue'),
        'part-2': require('comp/solution-part-2.vue'),
        'part-3': require('comp/solution-part-3.vue'),
        'part-4': require('comp/solution-part-4.vue'),
        'part-5': require('comp/solution-part-5.vue'),
        'part-6': require('comp/solution-part-6.vue'),
        'part-7': require('comp/solution-part-7.vue'),
        'part-8': require('comp/solution-part-8.vue'),
        'part-9': require('comp/solution-part-9.vue'),
        'part-10': require('comp/solution-part-10.vue')
    }
};
</script>

<style scoped lang="less">
@import "../ref";
.page-solution {
    
}
.box-left {
    float: left;
}
.left-nav {}
.left-nav > li {
    margin-bottom: 25px;
    & > a {
        display: block;
        width: 190px;
        height: 54px;
        line-height: 54px;
        text-align: center;
        background-color: #F0F0F0;
        color: #333;
        font-size: 16px;
        border-radius: 25px 0 25px 0;
    }
    &.active > a {
        background-color: @theme-color;
        color: #fff;
    }
}
.box-right {
    float: right;
}
</style>

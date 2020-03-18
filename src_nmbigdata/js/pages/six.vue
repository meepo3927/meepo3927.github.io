<template>
<div class="page-six">
    <v-header active="1"/>
    <div class="page-banner">
        <img :src="getImageUrl('/six/banner.png')" class="page-banner-img" />
        <div class="text-content">
            <h3>我们的大数据能力</h3>
            <h5>Big Data Capacity Service We Provide</h5>
            <p>基于2000万用户的日常行为数据，依托世界一流的大数据架构平台，面向23种行业，推出专业性大数据服务，为企业运营决策提供权威大数据支撑</p>
        </div>
    </div>

    <h3 class="section-title" ref="t1">
        <img :src="getImageUrl('/index/six.png')" />
        六大能力
    </h3>

    <div class="inner-main">
        <ul class="six-nav">
            <li v-for="(v, i) in nav" :class="{active: i === navIndex }">
                <a href="javascript:;" v-text="v" @click="onNavClick(i)"></a>
            </li>
        </ul>
    </div>

    <div :is="partComp"></div>
    <v-backtop />
    <v-copyright />
</div>
</template>

<script>
let URL = require('util/url.js');
const scrollTo = require('util/scroll_to.js');
let methods = {};
methods.onNavClick = function (i) {
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
computed.nav = function () {
    return this.sixTitle;
};
computed.partComp = function () {
    let i = this.navIndex + 1;
    return 'part-' + i;
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
        require('mixins/six.js')
    ],
    beforeDestroy,
    components: {
        'part-1': require('comp/six-part-1.vue'),
        'part-2': require('comp/six-part-2.vue'),
        'part-3': require('comp/six-part-3.vue'),
        'part-4': require('comp/six-part-4.vue'),
        'part-5': require('comp/six-part-5.vue'),
        'part-6': require('comp/six-part-6.vue')
    }
};
</script>

<style scoped lang="less">
@import "../ref";
.page-six {
    
}
.six-nav {
    li {
        display: inline-block;
        width: 16.66%;
        text-align: center;
    }
    li > a {
        display: inline-block;
        font-size: 16px;
        width: 100px;
        color: #333;
        padding-bottom: 10px;
        &:hover {
            color: @theme-color;
        }
    }
    li.active > a {
        border-bottom: 3px solid @theme-color;
    }
}
</style>

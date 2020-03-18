<template>
<div class="page-index">
    <v-header active="0"/>
    <banner-slide @click="onBannerClick" />

    <!-- 六大能力 -->
    <div class="six-section inner-main">
        <h3 class="section-title">
            <img :src="getImageUrl('/index/six.png')" />
            六大能力
        </h3>

        <div class="section-wrapper">
            <ul>
                <li v-for="i in [0, 1, 2, 3, 4, 5]">
                    <div class="img-box">
                        <img :src="getSixImg(i)" :class="[getSixImgClass(i)]" />
                    </div>
                    <h4 v-text="sixTitle[i]"></h4>
                    <h6 v-text="sixSubTitle[i]"></h6>

                    <div class="hover-content">
                        <h4 v-text="sixTitle[i]"></h4>
                        <h6 v-text="sixSubTitle[i]"></h6>
                        <p v-text="sixDesc[i]"></p>
                        <a :href="getSixUrl(i)" class="common-btn-1">查看更多</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <!-- 产品轮播 -->
    <div class="product-section">
        <h3 class="section-title">
            <img :src="getImageUrl('/index/product.png')" />
            产品案例
        </h3>
        <product-slide @open="openVideo" />
    </div>
    <!-- 行业解决方案 -->
    <div class="solution-section inner-main">
        <h3 class="section-title">
            <img :src="getImageUrl('/index/solution.png')" />
            行业解决方案
        </h3>
        <ul>
            <li v-for="(v, i) in solutionPart1">
                <a :href="getSolutionUrl(i)">
                    <img :src="getSolutionImg(v)" />
                    <h4 v-text="v.name"></h4>
                    <div class="hover-content">
                        <h3 v-text="v.name"></h3>
                    </div>
                </a>
            </li>
        </ul>
        <ul class="list-2">
            <li v-for="(v, i) in solutionPart2">
                <a :href="getSolutionUrl(i + 5)">
                    <img :src="getSolutionImg(v)" />
                    <h4 v-text="v.name"></h4>
                    <div class="hover-content">
                        <h3 v-text="v.name"></h3>
                    </div>
                </a>
            </li>
        </ul>
    </div>
    <video-layer ref="productVideo" />
    <v-backtop />
    <v-copyright />
</div>
</template>

<script>
require('root');
let methods = {};
methods.onBannerClick = function (item) {
    this.$refs.productVideo.open(item.name);
};
methods.openVideo = function (name) {
    this.$refs.productVideo.open(name);
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {};
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
        require('mixins/pageCommon.js'),
        require('mixins/solution.js'),
        require('mixins/six.js')
    ],
    beforeDestroy,
    components: {
        'product-slide': require('comp/product-slide.vue'),
        'video-layer': require('comp/product-video-layer.vue')
    }
};
</script>

<style scoped lang="less">
@import "../ref";
@item-height:  342px;

@solution-img-height: 160px;
//@solution-img-width:  270px;
.page-index {}
.six-section {
    padding: 0px 0 90px 0;
    ul {
        font-size: 0;
    }
    ul > li {
        position: relative;
        display: inline-block;
        width: 33.3%;
        height: @item-height;
        border: 1px solid #cdcdcd;
        vertical-align: top;
        text-align: center;
        padding-top: 1px;
        & > h4 {
            margin-top: 40px;
            font-size: 18px;
        }
        & > h6 {
            margin-top: 40px;
            font-size: 14px;
        }
        &:nth-of-type(2),
        &:nth-of-type(3),
        &:nth-of-type(5),
        &:nth-of-type(6) {
            border-left: none;
        }
        &:nth-of-type(n+4) {
            border-top: none;
        }
    }

    .img-box {
        height: 80px;
        margin-top: 90px;
        padding-top: 1px;
    }
    .img-monitor {
        height: 66px;
        margin-top: 6px;
    }
    .img-portray {
        height: 76px;
    }
    .img-credit {
        height: 79px;
    }
    .img-locate {
        height: 79px;
    }
    .img-ad {
        height: 78px;
    }
    .img-publico {
        height: 73px;
    }
}

.six-section li > .hover-content {
    display: none;
    position: absolute;
    background-color: @theme-color;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: #fff;
    padding-top: 10px;
    & > h4 {
        margin-top: 40px;
        font-size: 20px;
    }
    & > h6 {
        font-size: 16px;
        margin-top: 20px;
        padding-bottom: 18px;
        width: 86%;
        margin-left: auto;
        margin-right: auto;
        border-bottom: 1px solid #fff;
    }
    & > p {
        margin-top: 15px;
        font-size: 14px;
        line-height: 28px;
        width: 76%;
        margin-left: auto;
        margin-right: auto;
        text-align: justify;
        word-wrap: break-word;
        word-break: break-all;
        height: 108px;
        overflow: hidden;
    }
    & > a {
        margin-top: 20px;
        display: block;
        width: 108px;
        margin-left: auto;
        margin-right: auto;
    }
}
.six-section li:hover > .hover-content {
    display: block;
}

.product-section {
    padding: 1px 0 90px 0;
    background-color: #F3F9FC;
}

.solution-section ul {
    margin-bottom: 15px;
}
.solution-section ul > li {
    display: inline-block;
    width: 20%;
    text-align: center;
    padding-left: 2px;
    padding-right: 2px;
    &:nth-child(1) {
        padding-left: 0;
    }
    &:nth-last-child(1) {
        padding-right: 0;
    }
}
.solution-section ul > li > a {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    img {
        width: 100%;
        height: @solution-img-height;
    }
    h4 {
        font-size: 16px;
        margin-top: 20px;
        margin-bottom: 20px;
        color: #333;
    }
    & > .hover-content {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: @solution-img-height;
        background-color: rgba(0, 0, 0, .5);
        padding-top: 10px;
        & > h3 {
            margin-top: 36px;
            width: 60%;
            margin-left: auto;
            margin-right: auto;
            color: #eee;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            padding: 20px 0;
        }
    }
    &:hover > .hover-content {
        display: block;
    }
}

</style>

<template>
<div class="dataplus-preview" :style="rootStyle" :class="rootClass">
    <!-- 页面标题 -->
    <h1 v-text="my.pageTitle"></h1>
    <!-- 滚动区域 -->
    <div class="section-body">
        <!-- 头图 -->
        <h4 class="banner-template banner-style-0" v-if="my.bannerType == 1" 
            v-html="bannerTemplate"></h4>
        <!-- 头文 -->
        <h4 class="banner-template" v-if="my.bannerType == 2" v-text="my.bannerSelfChar"
            :style="bannerStyle" :class="bannerClass"></h4>
        <!-- 头图 -->
        <h4 class="banner-template" v-if="my.bannerType == 3">
            <img :src="my.bannerSelfJpgPath" class="banner-image" />
        </h4>
        <!-- 活动内容 文字 -->
        <div class="content-text" v-if="my.actContentStyle == 1">
            <p v-html="escape(my.actContentChar)"></p>
        </div>
        <!-- 活动内容 图片 -->
        <div class="content-image" v-if="my.actContentStyle == 2">
            <img :src="my.actContentJpgPath" @click="jump(my.actContentJpgUrl)"/>
        </div>
        <!-- 业务推荐 -->
        <ul class="recommend-list" v-if="hasRecommend">
            <li v-for="item in my.products">
                <div class="col-intro">
                    <span v-text="item.svcRecommendProdIntro"></span>
                </div>
                <a class="col-btn" href="javascript:;"
                    :data-id="item.productID" >立即订购</a>
            </li>
        </ul>
        <!-- 活动说明 -->
        <div class="instruction">
            <h4 v-text="my.actExpTitle" v-if="my.actExpTitle"></h4>
            <p v-html="escape(my.actExpContent)" v-if="my.actExpContent"></p>
        </div>
        
    </div>
</div>
</template>

<script>
import Promise from 'promise';
const BACK_COLOR_MAP = {
    0: 'transparent',
    1: '#FF3333',
    2: '#FFFF33',
    3: '#0033FF',
    4: '#9900CC',
    5: '#33FF33',
    6: '#000000',
    7: '#ffffff'
};
var methods = {};
methods.jump = function (url) {
    if (url) {
        mlayer.msg('跳转:' + this.escape(url));
    }
};
methods.escape = function (str) {
    if (!str) {
        return '';
    }
    let content = Tool.escapeHTML(str);
    content = content.replace(/\n/g, '<br />');
    return content;
}
var computed = {};
computed.my = function () {
    return this.data || {};
};
// 背景
computed.rootStyle = function () {
    var o = {};
    const bgColor = this.my.backgroundColor;
    if (bgColor) {
        o.backgroundColor = BACK_COLOR_MAP[bgColor] || BACK_COLOR_MAP[0];
    }
    const bgImage = this.my.backgroundImage;
    if (bgImage) {
        o.backgroundImage = `url(${bgImage})`;
        o.backgroundRepeat = 'no-repeat';
        o.backgroundPosition = 'center center';
        o.backgroundSize = 'contain';
    }
    return o;
};
computed.rootClass = function () {
    return [
        'back-style-' + (this.my.backgroundColor)
    ]
};
// 头图
computed.bannerTemplate = function () {
    const i = this.my.bannerTemplate;
    const map = {};
    map[2] = `<img src="${this.vImgPath}/logo.png" />`;
    map[3] = `<strong>最新活动</strong>`;
    map[4] = `<strong>聚惠来袭</strong>`;
    return map[i] || '';
};
computed.bannerStyle = function () {
    let o = {};
    o.backgroundColor = BACK_COLOR_MAP[this.my.bannerSelfCharColor];
    return o;
};
computed.bannerClass = function () {
    return [
        'banner-style-' + this.my.bannerSelfCharColor
    ]
};
computed.hasRecommend = function () {
    return (this.my.products && this.my.products.length);
};
const watch = {};
const mounted = function () {
    window.DataplusPreview = this;
};
export default {
    data: function () {
        return {};
    },
    watch,
    methods,
    computed,
    props: ['data'],
    mounted
};
</script>

<style scoped lang="less">
@title-height:           32px;
@recommend-item-height:  36px;
.dataplus-preview {
    height: 100%;
    color: #fff;
    &.back-style-2, &.back-style-7 {
        color: #333;
    }
}
.dataplus-preview > h1 {
    background-color: #000;
    text-align: center;
    color: #fff;
    margin: 0;
    padding: 0 12px;
    font-size: 16px;
    line-height: @title-height;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.section-body {
    height: calc(~'100% - @{title-height}');
    overflow-y: auto;
}
.banner-template {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin: 0;
    padding: 8px 5px;
    color: #fff;
    word-wrap: break-word;
    word-break: break-all;
    &.banner-style-0 {
        color: inherit;
    }
    &.banner-style-2,
    &.banner-style-7 {
        color: #333;
    }
    .banner-image {
        width: 100%;
    }
}
.content-text {
    padding: 1px 12px 6px;
    p {
        word-wrap: break-word;
        word-break: break-all;
        margin-bottom: 0;
        line-height: 18px;
    }
}
.content-image {
    text-align: center;
    img {
        cursor: pointer;
        max-width: 90%;
    }
}
.recommend-list > li {
    padding: 4px 8px;
    color: #333;
    height: @recommend-item-height;
    display: table;
    width: 100%;
    .col-intro {
        vertical-align: middle;
        display: table-cell;
        width: 68%;
        height: @recommend-item-height;
        border: 1px solid #999;
        background-color: #fff;
        padding: 1px 4px 0 6px;
        & > span {
            display: block;
            word-wrap: break-word;
            word-break: break-all;
            max-height: @recommend-item-height;
            overflow: hidden;
            line-height: 18px;
            &:empty:before {
                content: '产品介绍';
                color: #999;
            }
        }
    }
    .col-btn {
        display: inline-block;
        background-color: #fff;
        vertical-align: middle;
        padding: 0 6px;
        margin-left: 8px;
        border: 1px solid #999;
        line-height: @recommend-item-height;
        color: #000;
    }
}
.instruction {
    padding: 4px 8px;
    word-wrap: break-word;
    word-break: break-all;
    h4 {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 5px;
    }
    p {
        background-color: #E3C685;
        border: 1px solid darken(#E3C685, 20%);
        padding: 4px 6px;
    }
}
</style>
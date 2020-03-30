<template>
<ul class="product-list">
    <li v-for="(v, i) in products">
        <div class="li-wrapper">
            <img :src="getProductImg(v)" title="播放视频" @click="play(v)" />
            <div class="v-title ">
                <!-- 不需要登录 -->
                <template v-if="!v.needlogin">
                    <a href="javascript:;" class="v-link" v-show="v.url" 
                        @click="onLoginClick">立即体验</a>
                    <a href="javascript:;" class="v-link disabled" v-show="!v.url">即将开放</a>
                </template>

                <!-- 需要登录 -->
                <template v-if="v.needlogin">
                    <a href="javascript:;" class="v-link-1" 
                        @click="onLoginClick">立即登录</a>
                    <a :href="getPageUrl('/apply')" class="v-link-2" target="_blank" 
                        title="该产品需要申请账号才能体验">申请账号</a>
                </template>
                
                <!-- 名字 -->
                <h4 v-text="v.name"></h4>
            </div>
            <div class="v-desc do-wrap" v-text="v.desc"></div>
            <!-- 图标 -->
            <i class="fa fa-play-circle product-play-icon pos-center" title="播放视频"
                @click="play(v)" ></i>
        </div>
    </li>
</ul>
</template>

<script>
let methods = {};
methods.play = function (item) {
    this.$emit('play', item);
};
methods.onLoginClick = function () {
    this.$msg('页面跳转');
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {};
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
    mixins: [
        require('mixins/product_case.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
@img-height:    245px;
.product-list {}
.product-list > li {
    width: 33.3%;
    display: inline-block;
    margin-bottom: 20px;
    &:nth-child(3n+1) {
        padding-right: 14px;
    }
    &:nth-child(3n+2) {
        padding-left: 7px;
        padding-right: 7px;
    }
    &:nth-child(3n+3) {
        padding-left: 14px;
    }
}
.product-list .li-wrapper {
    background-color: #fff;
    padding-bottom: 5px;
    position: relative;
    & > img {
        width: 100%;
        height: @img-height;
        cursor: pointer;
    }
    .v-title {
        padding: 8px 16px;
        h4 {
            font-size: 18px;
            font-weight: bold;
        }
        a {
            float: right;
            display: inline-block;
            background-color: @orange-color;
            color: #fff;
            padding: 6px 12px;
            font-size: 14px;
            border-radius: 4px;
            margin-top: 2px;
            margin-left: 12px;
        }
        a.v-link.disabled {
            background-color: #BBB;
            cursor: default;
        }
        .v-link-2 {
            background-color: #fff;
            color: @orange-color;
            border: 1px solid @orange-color;
        }
    }
    .v-desc {
        padding: 4px 16px 12px 16px;
        font-size: 16px;
        line-height: 28px;
        height: 76px;
        overflow: hidden;
    }
    & > .fa-play-circle {
        top: @img-height / 2 - 36px;
    }
}
</style>

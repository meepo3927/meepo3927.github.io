<template>
<div class="v-page-header">
    <div class="inner-main">
        <div class="part-left">
            <img :src="logo" class="v-logo" />
            <h1>内蒙古移动大数据门户</h1>
        </div>
        

        <!-- 导航 -->
        <ul >
            <li v-for="(v, i) in nav" :class="{active: active == i}">
                <a :href="active == i ? 'javascript:;' : v.url" v-text="v.name"></a>
            </li>
        </ul>

        <!-- 按钮 -->
        <a :href="getPageUrl('/product', '?name=all')" class="common-btn-1"
            @click="onTryClick">体验产品</a>
    </div>
</div>
</template>

<script>
let methods = {};
methods.onTryClick = function (e) {
    if (location.pathname.indexOf('product.') >= 0) {
        e.preventDefault();
        this.$emit('jump-product');
        return false;
    }
};
let computed = {};
computed.nav = function () {
    return [
        {
            name: '首页',
            url: this.getPageUrl('/index')
        },
        {
            name: '六大能力',
            url: this.getPageUrl('/six')
        },
        {
            name: '产品案例',
            url: this.getPageUrl('/product')
        },
        {
            name: '行业解决方案',
            url: this.getPageUrl('/solution')
        }
    ]
};
computed.logo = function () {
    return this.vImgPath + '/logo.png';
};
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
    props: ['active'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@header-height:  80px;
.v-page-header {
    height: @header-height;
    background-color: #1C1C1C;
}
.v-logo {
    width: 51px;
    height: 59px;
    vertical-align: top;
}
.part-left {
    float: left;
    height: 100%;
    padding-top: 10px;
}
h1 {
    display: inline-block;
    color: #fff;
    margin-top: 10px;
    vertical-align: top;
    margin-left: 35px;
    font-size: 30px;
}
ul {
    float: left;
    margin-left: 200px;
    li {
        display: inline-block;
    }
    li > a {
        display: inline-block;
        height: @header-height;
        padding: 30px 35px 0;
        color: #fff;
        font-size: 16px;
        &:hover {
            color: #d2d2d2;
        }
    }
    li.active > a {
        border-bottom: 3px solid #1296DB;
    }
}
.common-btn-1 {
    float: right;
    margin-top: 20px;
    margin-right: 20px;
}
</style>

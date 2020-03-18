<template>
<div class="v-backtop" title="回到顶部" @click="onClick" :class="{vhidden}">
    <span></span>
    <i class="fa fa-arrow-up"></i>
</div>
</template>

<script>
let $ = require('jquery');
const getScrollTop = () => {
    return document.documentElement.scrollTop
        || document.body.scrollTop;
};
let methods = {};
methods.onClick = function () {
    let $html = $(document.documentElement);
    let $body = $(document.body);
    $html.animate({
        scrollTop: 0
    });
    $body.animate({
        scrollTop: 0
    });
};
methods.onScroll = function () {
    this.bodyScrollTop = getScrollTop();
};

let computed = {};
computed.vhidden = function () {
    return (this.bodyScrollTop < 100);
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.vBacktop = this;
    this.bodyScrollTop = getScrollTop();
    $(window).on('scroll', this.onScroll);
};
const beforeDestroy = function () {
    $(window).off('scroll', this.onScroll);
};
const dataFunc = function () {
    let o = {
        bodyScrollTop: 0
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
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@color:        #666;
@hover-color:  #999;
.v-backtop {
    position: fixed;
    bottom: 40px;
    right: 39px;

    cursor: pointer;
    z-index: 300;
    border-radius: 4px;
    padding: 8px 10px 6px;
    background-color: #ddd;
    &.vhidden {
        display: none;
    }
    &:hover > span {
        background-color: @hover-color;
    }
    &:hover > i {
        color: @hover-color;
    }
    & > span {
        display: block;
        height: 6px;
        background-color: @color;
        border-radius: 4px;
        margin-bottom: -3px;
    }
    & > i {
        font-size: 30px;
        color: @color;
    }
}
</style>

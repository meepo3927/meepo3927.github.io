<template>
<div class="responsive-head-nav">
    <div class="i-wrapper">
        <ul class="head-nav" v-if="list" ref="list" :style="{marginLeft}">
            <li v-for="(v, i) in list" :class="{active: index === (i + 1)}"
                @click="onClick(i + 1)">
                <i class="fa" :class="[v.icon]"></i> {{v.text}}
            </li>
        </ul>
    </div>
    <a href="javascript:;" class="r-btn" title="查看更多" @click="r"
        v-show="rBtnVisible">
        <i class="fa" :class="[rBtnClass]"></i>
    </a>
</div>
</template>

<script>
const DEFAULT_MARGIN_LEFT = 20;

let methods = {};
methods.onClick = function (p) {
    this.$emit('click', p);
};
methods.r = function () {
    this.mode = (this.mode === 'left') ? 'right' : 'left';
};
methods.onResize = function () {
    this.parentWidth = this.$el.clientWidth;
    this.innerWidth = this.$refs.list.scrollWidth;
};
let computed = {};
computed.rBtnVisible = function () {
    return this.parentWidth < this.innerWidth;
};
computed.rBtnClass = function () {
    return (this.mode === 'left') ? 'fa-caret-right' : 'fa-caret-left';
};
computed.marginLeft = function () {
    return this.ml + 'px'
};
computed.ml = function () {
    if (this.mode === 'left') {
        return DEFAULT_MARGIN_LEFT;
    }
    if (this.innerWidth < this.parentWidth) {
        return DEFAULT_MARGIN_LEFT;
    }
    return (this.parentWidth - this.innerWidth);
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.addEventListener('resize', this.onResize);
    this.$nextTick(this.onResize);
    setTimeout(this.onResize, 500);
    setTimeout(this.onResize, 1500);
};
const beforeDestroy = function () {
    window.removeEventListener('resize', this.onResize);
};
const dataFunc = function () {
    let o = {
        parentWidth: 1000,
        innerWidth: 1000,
        mode: 'left'
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['list', 'index'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.responsive-head-nav {
    float: left;
    width: calc(~'100% - 285px');
    position: relative;
    .i-wrapper {
        width: 100%;
        overflow: hidden;
    }
    .head-nav {
        float: none;
        white-space: nowrap;
        transition: all .5s ease 0s;
    }
    & > .r-btn {
        position: absolute;
        padding: 12px;
        color: #333;
        top: 4px;
        right: -36px;
        font-size: 32px;
    }
}
</style>

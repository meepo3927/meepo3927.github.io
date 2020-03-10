<template>
<div class="corner-box">
    <div class="corner-1-2"></div>
    <div class="corner-1-1"></div>
    <div class="corner-2-2"></div>
    <div class="corner-2-1"></div>
    <div class="corner-3-2"></div>
    <div class="corner-3-1"></div>
    <div class="corner-4-2"></div>
    <div class="corner-4-1"></div>
    <slot></slot>
</div>
</template>

<script>
let methods = {};
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
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
@corner-size:    10px;
@corner-size-2: @corner-size + 4px;

.corner-box {
    position: relative;
    width: 100%;
    height: 100%;
    border-top: 1px solid @theme-color;
    border-bottom: 1px solid @theme-color;
    z-index: 10000;
}

.corner-1-1, .corner-1-2,
.corner-2-1, .corner-2-2,
.corner-3-1, .corner-3-2,
.corner-4-1, .corner-4-2 {
    position: absolute;
}
.corner-1-1, .corner-2-1,
.corner-3-1, .corner-4-1 {
    width: @corner-size;
    height: @corner-size;
    border: 3px solid @orange-color;
}
.corner-1-1, .corner-2-1 {
    top: -2px;
    border-bottom: none;
}
.corner-3-1, .corner-4-1 {
    bottom: -2px;
    border-top: none;
}
.corner-2-1, .corner-3-1 {
    right: -1px;
}
.corner-1-1, .corner-4-1 {
    left: -2px;
    border-right: none;
}
.corner-2-1, .corner-3-1 {
    border-left: none;
}
.corner-1-2, .corner-2-2,
.corner-3-2, .corner-4-2 {
    width: 1px;
    height: @corner-size-2;
}
.corner-1-2, .corner-2-2 {
    top: 0;
}
.corner-1-2, .corner-4-2 {
    left: -1px;
}
.corner-3-2, .corner-4-2 {
    bottom: 0;
}
.corner-1-2, .corner-4-2 {
    border-left: 1px solid @theme-color;
}
.corner-2-2, .corner-3-2 {
    right: 0px;
    border-right: 1px solid @theme-color;
}
</style>

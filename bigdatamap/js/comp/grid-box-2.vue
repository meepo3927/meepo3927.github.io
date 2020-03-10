<template>
<div class="grid-box-2">
    <div class="corner-1"></div>
    <div class="corner-2"></div>
    <div class="corner-3"></div>
    <div class="corner-4"></div>
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
@box-border:        rgba(255, 255, 255, .5);
@corner-color:      @theme-color;
.grid-box-2 {
    width: 154px;
    height: 122px;
    position: relative;
    border-top: 1px solid @box-border;
    border-bottom: 1px solid @box-border;

    background-image: url("../../images/layer/bg_grid_2.png");
    background-repeat: no-repeat;
    background-position: center center;

    padding: 5px;
}
.corner-1, .corner-2, .corner-3, .corner-4 {
    position: absolute;
    border: 1px solid @corner-color;
    width: 8px;
    height: 8px;
}
.corner-1, .corner-2 {
    top: -1px;
    border-bottom: none;
}
.corner-1, .corner-4 {
    left: -1px;
    border-right: none;
}
.corner-2, .corner-3 {
    right: -1px;
    border-left: none;
}
.corner-3, .corner-4 {
    bottom: -1px;
    border-top: none;
}
.corner-1 {}
.corner-2 {}
.corner-3 {}
.corner-4 {}
</style>

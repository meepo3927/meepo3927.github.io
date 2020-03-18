<template>
<span class="mui-alert-span" :class="[mainClass]">
    <i class="fa" :class="[iconClass]"></i>
    <slot></slot>
</span>
</template>

<script>
let methods = {};
let computed = {};
computed.mainClass = function () {
    if (this.type) {
        return 'type-' + this.type;
    }
    return '';
};
computed.iconClass = function () {
    return this.muiAlertIconMap[this.type] || '';
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
    props: ['type'],
    mounted,
    mixins: [
        require('mixins/mui.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
.mui-alert-span {
    padding: 8px 12px;
    border-radius: 4px;
    //display: inline-block;
    & > i.fa {
        font-size: 16px;
    }
    &.type-success {
        background-color: @mui-success-bg;
        border-color:     @mui-success-border;
        color: @mui-success-text;
    }
    &.type-info {
        background-color: @mui-info-bg;
        border-color:     @mui-info-border;
        color: @mui-info-text;
    }
    &.type-warning {
        background-color: @mui-warning-bg;
        border-color:     @mui-warning-border;
        color: @mui-warning-text;
    }
    &.type-error {
        background-color: @mui-error-bg;
        border-color:     @mui-error-border;
        color: @mui-error-text;
    }
}
</style>

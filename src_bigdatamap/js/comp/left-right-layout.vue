<template>
<div class="left-right-layout">
    <div class="x-left" :style="{width: width + 'px'}">
        <slot name="left" />
    </div>
    <div class="x-right" :style="{marginLeft: width + 'px'}">
        <slot />
    </div>
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
    props: {
        width: {
            type: Number,
            default: 180
        }
    },
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.left-right-layout {
    & > .x-left {
        position: absolute;
        height: 100%;
    }
    & > .x-right {
    }
}
</style>

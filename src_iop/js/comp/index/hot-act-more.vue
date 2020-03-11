<template>
<center-layer close="1" width="75vw" height="80vh" @close="onClose">
    <div class="center-layer-inner-1">
        <hot-act-list mode="more" />
    </div>
</center-layer>
</template>

<script>
const methods = {};
methods.onClose = function () {
    Vue.$disposeComponent(this);
};
const computed = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {
        'hot-act-list': require('comp/index/hot-act-list.vue')
    }
};
</script>

<style scoped lang="less">
.center-layer-inner-1 {
    overflow-y: auto;
}
</style>

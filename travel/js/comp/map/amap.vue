<template>
<div class="amap">
    amap.
</div>
</template>

<script>
var methods = {};
var computed = {};
var watch = {};
const mounted = function () {
    this.map = new AMap.Map(this.$el, {
        zoom: 6
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    var o = {};
    return o;
};
module.exports = {
    data: dataFunc,
    watch,
    mixins: [],
    methods,
    computed,
    props: [],
    mounted,
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.amap {
    height: 100%;
}
</style>
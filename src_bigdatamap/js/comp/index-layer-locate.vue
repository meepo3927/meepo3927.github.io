<template>
<div class="index-layer-child">
    <v-nav :list="nav" v-model="navIndex" @click="onNavClick" />
    <div class="inner-wrapper with-nav">
        <transition @leave="tFadeOutAnim" @enter="tFadeInAnim">
            <div :is="childName" :key="childName"></div>
        </transition>
    </div>
    <v-dot :max="nav.length" v-model="navIndex" @click="onNavClick" />
    
</div>
</template>

<script>
let methods = {};
methods.fetchRender = function () {};
methods.myNavClick = function (v, index, oldIndex) {
    this.$emit('navclick', v, index);
};
let computed = {};
computed.childName = function () {
    let i = this.navIndex + 1;
    return 'child-' + i;
};
computed.nav = function () {
    return ['区域选址', '客流分析']
};

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
    props: [],
    mounted,
    mixins: [
        require('mixins/index_layer.js'),
        require('mixins/transition/fade.js')
    ],
    beforeDestroy,
    components: {
        'v-nav': require('comp/index-layer-nav.vue'),
        'v-dot': require('comp/index-layer-dot.vue'),
        'child-1': require('comp/index-layer-locate-1.vue'),
        'child-2': require('comp/index-layer-locate-2.vue')
    }
};
</script>

<style scoped lang="less">
.index-layer-child {
    
}
</style>

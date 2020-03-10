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
methods.fetchRender = function () {
};
methods.myNavClick = function (v, index, oldIndex) {
    this.$emit('navclick', v, index);
};
let computed = {};
computed.childName = function () {
    let i = this.navIndex + 1;
    return 'child-' + i;
};
computed.nav = function () {
    return ['人口分布', '工作通勤', '景区热度']
};

let watch = {};
const created = function () {};
const mounted = function () {
};
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
        //require('mixins/transition/x_mix.js')
    ],
    beforeDestroy,
    components: {
        'v-nav': require('comp/index-layer-nav.vue'),
        'v-dot': require('comp/index-layer-dot.vue'),
        'child-1': require('comp/index-layer-monitor-1.vue'),
        'child-2': require('comp/index-layer-monitor-2.vue'),
        'child-3': require('comp/index-layer-monitor-3.vue')
    }
};
</script>

<style scoped lang="less">
.index-layer-child {
    
}
</style>

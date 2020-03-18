<template>
<center-layer v-if="isOpen" width="1280px" height="720px" 
    anim="true"
    close="true"
    @close="close"
    @cover-click="close"
    @ready="layerReady">
    <!-- 视频 -->
    <video class="layer-video" controls="controls" ref="v"
        @canplay="onCanplay"
        @play="onPlay"
        @playing="onPlaying"
        @pause="onPause"
        @ended="onEnd"
        @error="onError"
        :poster="poster"
        :src="src"></video>
    <!-- ICON -->
    <i class="fa fa-play-circle product-play-icon pos-center" title="播放" 
        v-show="iconVisible" @click="vPlay"></i>
</center-layer>
</template>

<script>
const dev = require('global/dev');
const IE = dev.getIEVersion();

let methods = {};
methods.layerReady = function () {
    if (this.proName && !this.src) {
        this.src = this.getProductVideoSrc(this.proName);
    }
};
methods.play = methods.open = function (name) {
    let item = this.productNameMap[name];
    if (!item) {
        return;
    }
    this.proName = name;
    this.src = '';
    this.isOpen = true;
    this.$nextTick(() => {
        this.poster = this.getProductVideoPoster(name);
        if (!IE) {
            this.src = this.getProductVideoSrc(this.proVideoName);
        }
    });
};
methods.close = function () {
    this.isOpen = false;
    this.src = '';
    this.poster = '';
    this.iconVisible = false;
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VideoPlayer = this;
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        isOpen: false,
        poster: '',
        src: ''
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
        require('mixins/product_case.js'),
        require('mixins/video_icon.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.layer-video {
    width: 100%;
    height: 100%;
    line-height: 0;
    background-color: #010001;
}
.fa-play-circle {
    top: 50%;
    margin-top: -44px;
}
</style>

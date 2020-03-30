<template>
<div class="all-video video-wrapper">
    <video controls="controls" loop="loop" ref="v"
        :poster="getImageUrl('/product/bigshow_poster.png')"
        :src="src"
        @canplay="onCanplay"
        @play="onPlay"
        @playing="onPlaying"
        @pause="onPause"
        @ended="onEnd"
        @error="onError"></video>
    <!-- 图标 -->
    <i class="fa fa-play-circle product-play-icon pos-center" title="播放" 
        v-show="iconVisible" @click="vPlay"></i>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.src = function () {
    return './videos/report.mp4'
    // return this.vConfig.staticSourceUrlPrefix + '/staticSourceApp/videos/bigshow_music.mp4';
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
    props: [],
    mounted,
    mixins: [
        require('mixins/video_icon.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "../ref";
@video-height:  758px;
.all-video {
    height:  @video-height;
    position: relative;
    .fa-play-circle {
        top: @video-height / 2 - 44px;
    }
}
</style>

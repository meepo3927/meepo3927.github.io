<template>
<center-layer width="92vw" height="88vh" close="1" @close="onClose">
    <div class="my-wrapper">
        <video :src="src" preload controls autoplay @error="onError"></video>
        <div class="my-tip" v-text="tip" v-show="tip"></div>
    </div>
</center-layer>
</template>

<script>
const methods = {};
methods.onClose = function () {
    Vue.$disposeComponent(this);
};
methods.onError = function (e) {
    this.tip = '视频加载失败';
};
const computed = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        src: '',
        tip: ''
    };
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
    components: {}
};
</script>

<style scoped lang="less">
.my-wrapper {
    background-color: #EEE;
    video {
        width: 100%;
        height: 100%;
        border: 1px solid #CCC;
        box-shadow: 0 0 6px #333;
    }
    .my-tip {
        color: #fff;
        text-shadow: 0 1px 3px #888;
        font-size: 32px;
        position: absolute;
        top: 50%;
        width: 100%;
        text-align: center;
        margin-top: -32px;
    }
}
</style>

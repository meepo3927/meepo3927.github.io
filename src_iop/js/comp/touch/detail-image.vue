<template>
<div>
    <a href="javascript:;" v-if="showBtnVisible" @click="onShowClick">查看图片</a>
    <span v-if="tipVisible" class="text-muted">图片已失效</span>
    <img :src="url" v-show="viewVisible" />
</div>
</template>

<script>
let methods = {};
methods.onShowClick = function () {
    this.viewVisible = true;
};
methods.checkImage = function () {
    const img = new Image();
    img.onerror = () => {
        this.loadFail = true;
    };
    img.src = this.url;
};
let computed = {};
computed.showBtnVisible = function () {
    if (this.viewVisible || this.loadFail) {
        return false;
    }
    return (!!this.url);
};
computed.tipVisible = function () {
    if (this.viewVisible) {
        return false;
    }
    if (this.loadFail || !this.url) {
        return true;
    }
    return false;
};
let watch = {};
const created = function () {};
const mounted = function () {
    if (this.url) {
        this.checkImage();
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        loadFail: false,
        viewVisible: false
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['url'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
img {
    max-height: 120px;
}
</style>

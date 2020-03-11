<template>
<div :class="rootClass">
    <sidebar @jump="onMenuJump" ref="sidebar" />
    <div class="r-container">
        <topbar class="topbar" />
        <iframe frameborder="0" src="about:blank" ref="ifm"></iframe>
    </div>

</div>
</template>

<script>
import 'common';
import mlayer from 'mlayer';
import store from 'store/shell.js';
import iframeUtil from 'iframeUtil';
const methods = {};
methods.onMenuJump = function (url) {
    if (!url) {
        return LOG('onMenuJump url empty.');
    }
    // 替换{user_id}, {ticket}等参数
    url = Config.replaceUrlVar(url);
    LOG('onMenuJump:' + url);
    if (this.isMatchSrc(url)) {
        return this.delaySetUrl(url);
    } else {
        this.setUrl(url);
    }
};
methods.isMatchSrc = function (url) {
    const $ifm = this.$refs.ifm;
    return (this.lastClickUrl === url)
        || ($ifm.src === url)
        || ($ifm.getAttribute('src') === url);
};
methods.delaySetUrl = function (url) {
    this.$refs.ifm.src = 'about:blank';
    setTimeout(() => {
        this.setUrl(url);
    }, 30);
};
methods.setUrl = function (url) {
    this.$refs.ifm.src = url;
    this.lastClickUrl = undefined;
};
// 在iframe中有a标签点击
methods.onAnchorClick = function (href) {
    if (!href || href === '#') {
        return;
    }
    this.$refs.sidebar.setUrl(href);
    this.lastClickUrl = href;
};
methods.closeWindow = function () {
    window.close();
};

methods.printSrc = function () {
    LOG(this.$refs.ifm.src, this.$refs.ifm.getAttribute('src'));
};
const computed = {};
computed.rootClass = function () {
    return [
        'side-' + this.sideMode,
        store.state.menuVisible ? 'menu-visible' : ''
    ]
};
computed.sideMode = function () {
    return store.state.sideMode;
};
const created = function () {};
const mounted = function () {
    window.VM = this;
    iframeUtil.on('vAnchorClick', this.onAnchorClick);
};
const beforeDestroy = function () {
    iframeUtil.off('vAnchorClick', this.onAnchorClick);
};
const dataFunc = function () {
    let o = {
    };
    return o;
};
export default {
    data: dataFunc,
    store,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {
        sidebar: require('comp/sidebar.vue'),
        topbar: require('comp/topbar.vue')
    }
};
</script>

<style scoped lang="less">
@import "../ref.less";
.side-normal .r-container {
    margin-left: @side-width-normal;
}
.side-mini .r-container {
    margin-left: @side-width-mini;
}
.r-container {
    position: relative;
    height: 100vh;
    padding-top: @top-bar-height;
    font-size: 0;
}
.sesstion-fail-layer {
    border-radius: 8px;
    padding: 6px 14px 12px;
}
.topbar {
    position: absolute;
    width: 100%;
    top: 0;
}
iframe {
    width: 100%;
    height: 100%;
}
.menu-visible iframe {
    pointer-events: none;
}
</style>

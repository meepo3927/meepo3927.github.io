<template>
<div class="text-marquee">
    <span v-for="i in 2" ref="t" v-text="text" 
        :class="['t' + i]" 
        :style="getStyle(i)"></span>
</div>
</template>

<script>
const STEP = 1;
const INTERVAL = 10;
const USE_SETTIMEOUT = false;
// polyfill
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = (
        window[vp + 'CancelAnimationFrame']
        ||
        window[vp + 'CancelRequestAnimationFrame']
    );
}
// End polyfill
let methods = {};
methods.getStyle = function (i) {
    return this['style' + i];
};
methods.getRootWidth = function () {
    if (this.$el) {
        return this.$el.clientWidth;
    }
    return 0;
};
methods.getInnerWidth = function () {
    if (this.$refs.t[0]) {
        return this.$refs.t[0].scrollWidth;
    }
    return 0;
};
methods.getAnimWidth = function () {
    let w1 = this.getRootWidth();
    let w2 = this.getInnerWidth();
    return Math.max(w2 - w1, 0);
};
methods.getElemLeft = function () {
    let left = this.$refs.t[0].style.marginLeft;
    if (left) {
        return parseInt(left, 10);
    }
    return 0;
};
methods.setOffset = function (v) {
    this.$refs.t[0].style.marginLeft = v + 'px';
};
methods.init = function () {
    if (this.timer) {
        cancelAnimationFrame(this.timer);
        clearTimieout(this.timer);
    }
    this.setOffset(0);
    this.iWidth = this.getInnerWidth();
    this.rWidth = this.getRootWidth();

    if (this.rWidth && this.iWidth) {
        if (this.iWidth > this.rWidth) {
            this.secondVisible = true;
            this.loop();
        } else {
            this.secondVisible = false;
        }
    }
};
methods.loop = function () {
    if (this.stoped) {
        return;
    }

    let left = this.getElemLeft();
    let w = this.iWidth + this.gap;
    if (Math.abs(left) === w) {
        this.setOffset(0);
    } else {
        this.setOffset(left - STEP);
    }
    if (USE_SETTIMEOUT) {
        this.timer = setTimeout(this.loop, INTERVAL);
    } else {
        this.timer = requestAnimationFrame(this.loop);
    }
};
let computed = {};
computed.gap = function () {
    return 30;
};
computed.style2 = function () {
    let s = {
        'margin-left': this.gap + 'px'
    };
    if (this.secondVisible === false) {
        s.display = 'none';
    }
    return s;
};
let watch = {};
watch.text = function () {
    this.$nextTick(this.init);
};
const created = function () {};
const mounted = function () {
    window.Marqu = this;
    this.init();
};
const beforeDestroy = function () {
    if (this.timer) {
        if (USE_SETTIMEOUT) {
            clearTimeout(this.timer);
        } else {
            cancelAnimationFrame(this.timer);
        }
        this.timer = null;
    }
    this.stoped = true;
    this.setOffset(0);
};
const dataFunc = function () {
    let o = {
        stoped: false,
        secondVisible: true
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['text'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.text-marquee {
    white-space: nowrap;
    overflow: hidden;
}

</style>

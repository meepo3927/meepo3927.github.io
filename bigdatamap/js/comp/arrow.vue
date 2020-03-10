<template>
<div class="v-arrow" :style="{width}">
    <img :src="getImageUrl('/effect/arrow_line.png')" class="img-1" />
    <img :src="getImageUrl('/effect/arrow_head.png')" class="img-2" />
</div>
</template>

<script>
const DELAY_TIME = 2000;
const FADEOUT_TIME = 1500;
let methods = {};
methods.show = function () {
    clearTimeout(this.timer);
    clearTimeout(this.fadeTimer);
    let $el = $(this.$el);
    $el.stop().fadeIn(FADEOUT_TIME);
    this.timer = setTimeout(() => {
        $el.find('.img-1').css('height', '100%');
        this.delayFadeOut();
    }, 50);
};
methods.delayFadeOut = function () {
    let $el = $(this.$el);
    this.fadeTimer = setTimeout(() => {
        $el.fadeOut(FADEOUT_TIME, () => {
            $el.find('.img-1').css('height', '0');
        });
    }, DELAY_TIME);
};
let computed = {};
computed.width = function () {
    if (this.w === 'small') {
        return '50px';
    }
    if (!isNaN(this.w)) {
        return this.w + 'px';
    }
    return '100px';
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
    props: ['h', 'w', 'o'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.v-arrow {
    position: absolute;
    font-size: 0;
    transform-style: preserve-3d;
    transform-origin: center bottom;

    display: none;
    img {
        width: 80%;
    }
    img.img-1 {
        height: 0%;
        transition: height 2s;
    }
}
</style>

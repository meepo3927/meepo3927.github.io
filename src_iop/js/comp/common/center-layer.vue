<template>
<div class="m-center-layer" :class="rootClass">
    <div class="x-wrapper-1" @click.self="onCoverClick">
        <div class="x-wrapper-2" ref="w2" @click.self="onCoverClick">
            <div class="x-wrapper-3" ref="w3">
                <slot></slot>
                <a href="javascript:;" class="close-btn" v-if="close"
                    @click="$emit('close')">
                    <i class="fa fa-times-circle"></i>
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
let $ = require('jquery');
let Cover = require('util/cover.js');

let isPercent = function (str) {
    if (!str || !str.charAt) {
        return false;
    }
    str = str.trim();
    return str.charAt(str.length - 1) === '%';
};
const animDuration = 350;
const noop = function () {};

var methods = {};
methods.onCoverClick = function () {
    this.$emit('cover-click');
};
methods.fullMode = function (callback) {
    this.full = true;
    let o = {};
    if (callback) {
        o.complete = callback;
    }
    this.render(o);
};
methods.restoreMode = function (callback) {
    this.full = false;
    let o = {};
    if (callback) {
        o.complete = callback;
    }
    this.render(o);
};
methods.renderWidth = function (options = {}) {
    let val = this.width || 'auto';
    if (this.full) {
        val = '100%';
    }

    let complete = options.complete || noop;
    var $w3 = $(this.$refs.w3);
    if (this.isAnim && val !== 'auto') {
        $w3.stop().animate({width: val}, animDuration, complete);
    } else {
        $w3.css('width', val);
        setTimeout(complete);
    }
};
methods.renderHeight = function (options = {}) {
    let val = this.height || 'auto';
    if (this.full) {
        val = '100%';
    }
    let complete = options.complete || noop;
    var $w2 = $(this.$refs.w2);
    if (this.isAnim && val !== 'auto') {
        $w2.stop().animate({'height': val}, animDuration, complete);
    } else {
        $w2.css('height', val);
        setTimeout(complete);
    }
};
methods.render = function (options = {}) {
    let completeCount = 0;
    let allComplete = options.complete || noop;
    let wComplete = () => {
        completeCount++;
        if (completeCount >= 2) {
            allComplete();
        }
    };
    let hComplete = () => {
        completeCount++;
        if (completeCount >= 2) {
            allComplete();
        }
    };
    this.renderWidth({complete: wComplete});
    this.renderHeight({complete: hComplete});
};
var computed = {};
computed.isAnim = function () {
    return this.anim === 'true' || this.anim === true;
};
computed.withCover = function () {
    if (this.cover === false || this.cover === 'false') {
        return false;
    }
    return true;
};
computed.rootClass = function () {
    let arr = [];
    if (this.withCover) {
        arr.push('with-cover');
    }
    return arr;
};

let watch = {};
watch.width = function () {
    this.$nextTick(this.renderWidth);
};
watch.height = function () {
    this.$nextTick(this.renderHeight);
};
const mounted = function () {
    if (this.withCover) {
        this.coverInstance = new Cover({
            show: true,
            onClick: this.onCoverClick
        });
    }
    this.render({
        complete: () => {
            this.$emit('ready');
        }
    });
};
const beforeDestroy = function () {
    if (this.coverInstance) {
        this.coverInstance.remove();
        this.coverInstance = null;
    }
    this.$emit('beforeDestroy');
};
const destroyed = function () {
    this.$emit('destroyed');
};
const dataFunc = function () {
    var o = {
        full: false
    };
    return o;
};
module.exports = {
    data: dataFunc,
    methods,
    watch,
    computed,
    props: ['width', 'height', 'anim', 'cover', 'close'],
    mounted,
    beforeDestroy,
    destroyed,
    components: {}
};
</script>

<style scoped lang="less">
.m-center-layer {
}
.close-btn {
    position: absolute;
    right: -1px;
    top: -40px;
    i {
        color: #333;
        font-size: 32px;
        font-weight: lighter;
    }
    &:hover i {
        color: #1296DB;
    }
}
.m-center-layer.with-cover .close-btn {
    i {
        color: #fff;
    }
}
</style>
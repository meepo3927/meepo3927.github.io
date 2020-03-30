<template>
<div class="m-center-layer" :class="rootClass">
    <div class="x-wrapper-1" @click.self="onCoverClick">
        <div class="x-wrapper-2" ref="w2" @click.self="onCoverClick">
            <div class="x-wrapper-3" ref="w3">
                <slot></slot>
                <a href="javascript:;" class="i-close-btn" @click="$emit('close')">
                    <i class="fa fa-times-circle"></i>
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import $ from 'jquery';
import Cover from 'util/cover.js';

const ANIM_DURATION = 350;
const noop = function () {};
const methods = {};
methods.onCoverClick = function () {
    this.$emit('cover-click');
};
methods.renderWidth = function (options = {}) {
    let val = this.width || 'auto';
    let complete = options.complete || noop;
    var $w3 = $(this.$refs.w3);
    if (this.isAnim && val !== 'auto') {
        $w3.stop().animate({width: val}, ANIM_DURATION, complete);
    } else {
        $w3.css('width', val);
        setTimeout(complete);
    }
};
methods.renderHeight = function (options = {}) {
    let val = this.height || 'auto';
    let complete = options.complete || noop;
    var $w2 = $(this.$refs.w2);
    if (this.isAnim && val !== 'auto') {
        $w2.stop().animate({height: val}, ANIM_DURATION, complete);
    } else {
        $w2.css('height', val);
        setTimeout(complete);
    }
};
methods.render = function (complete = noop) {
    let completeCount = 0;
    let wComplete = () => {
        completeCount++;
        if (completeCount >= 2) {
            return complete();
        }
    };
    let hComplete = () => {
        completeCount++;
        if (completeCount >= 2) {
            return complete();
        }
    };
    this.renderWidth({complete: wComplete});
    this.renderHeight({complete: hComplete});
};
var computed = {};
computed.isAnim = function () {
    return this.anim === 'true' || this.anim === true;
};
computed.rootClass = function () {
    let arr = ['with-cover'];
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
    this.coverInstance = new Cover({
        show: true,
        onClick: this.onCoverClick
    });
    this.render(() => {this.$emit('ready');});
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
    };
    return o;
};
export default {
    data: dataFunc,
    methods,
    watch,
    computed,
    props: ['width', 'height', 'anim'],
    mounted,
    beforeDestroy,
    destroyed,
    components: {}
};
</script>

<style scoped lang="less">
.m-center-layer {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 3;
    .x-wrapper-1 {
        height: 100%;
        margin: 0;
    }
    .x-wrapper-1:after{
        content: "&nbsp;";
        display: inline-block;
        font-size: 0;
        height: 100%;
        margin-left: -99%;
        vertical-align: middle;
        width: 1px;
    }
    .x-wrapper-2 {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        width: 100%;
    }
    .x-wrapper-3 {
        height: 100%;
        display: inline-block;
        margin: auto;
        text-align: left;
        position: relative;
        & > div {
            height: 100%;
        }
    }
}
.i-close-btn {
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
.m-center-layer.without-close .i-close-btn {
    display: none;
}
.m-center-layer.with-cover .i-close-btn i {
    color: #fff;
}
</style>
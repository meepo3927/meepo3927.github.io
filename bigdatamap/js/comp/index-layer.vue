<template>
<div class="index-layer" :class="rootClass">
    <div class="corner-1-2"></div>
    <div class="corner-1-1"></div>
    <div class="corner-2-2"></div>
    <div class="corner-2-1"></div>
    <div class="corner-3-2"></div>
    <div class="corner-3-1"></div>
    <div class="corner-4-2"></div>
    <div class="corner-4-1"></div>
    <!-- 头部 -->
    <div class="head-box">
        <div class="city-name">
            <i class="fa fa-map-marker"></i>
            <span v-text="cityName"></span>
        </div>

        <div class="ctrl-box">
            <a href="javascript:;" @click="prev" :class="{'v-disabled': !prevEnable}">
                <i class="glyphicon glyphicon-menu-left"></i>
            </a>
            <span v-text="title"></span>
            <a href="javascript:;" @click="next" :class="{'v-disabled': !nextEnable}">
                <i class="glyphicon glyphicon-menu-right"></i>
            </a>
        </div>
        <!-- 隐藏 -->
        <a href="javascript:;" class="hide-btn" title="隐藏" @click="hideClick">
            <i class="iconfont icon-guanbi"></i>
        </a>
    </div>
    <div class="inner-wrapper">
        <transition @leave="leaveXAnim" @enter="enterXAnim">
            <div :is="childComp" @navclick="onChildNavClick"></div>
        </transition>
    </div>
</div>
</template>

<script>
const childrenDefine = [
    {name: 'Monitor', title: '客流监控'},
    {name: 'Credit', title: '信用评估'},
    {name: 'Locate', title: '店面选址'},
    {name: 'Publico', title: '舆情监控'}
];

let methods = {};
methods.onChildNavClick = function (v, i) {
    this.sendStep(i);
};
methods.hideClick = function () {
    this.$emit('hide-click');
};
methods.prev = function () {
    let n = this.index - 1;
    this.transitionDirection = 'right';
    if (childrenDefine[n]) {
        this.index--;
        this.sendStep();
    }
};
methods.next = function () {
    let n = this.index + 1;
    this.transitionDirection = 'left';
    if (childrenDefine[n]) {
        this.index++;
        this.sendStep();
    }
};
methods.sendStep = function (i = 0) {
    let name = childrenDefine[this.index].name;
    let n = i + 1;
    this.$emit('setstep', name + n);
};
let computed = {};
computed.rootClass = function () {
    let arr = [];
    if (this.visible) {
        arr.push('v-visible');
    } else {
        arr.push('v-hidden');
    }
    return arr;
};
computed.title = function () {
    return childrenDefine[this.index].title;
};
computed.childComp = function () {
    let name = childrenDefine[this.index].name;
    return 'v-' + name.toLowerCase();
};
computed.cityName = function () {
    return this.$store.getters.cityName
};
computed.prevEnable = function () {
    return (this.index > 0);
};
computed.nextEnable = function () {
    return (this.index < (childrenDefine.length - 1));
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.sendStep();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        index: 0
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['visible'],
    mounted,
    mixins: [
        require('mixins/transition/x_mix.js')
    ],
    beforeDestroy,
    components: {
        'v-monitor': require('comp/index-layer-monitor.vue'),
        'v-credit': require('comp/index-layer-credit.vue'),
        'v-locate': require('comp/index-layer-locate.vue'),
        'v-publico': require('comp/index-layer-publico.vue')
    }
};
</script>

<style scoped lang="less">
@import "./ref";

@border-color: @theme-color;
@corner-size:    12px;
@corner-size-2: @corner-size + 4px;
@keyframes layershow {
    0% {
        transform-origin: right center;
        transform: translate(10px, -80px) scale(.01);
        //transform: translate(10px, -50px) skew(-82deg) scale(.01);
        z-index: 0;
    }
    100% {
        
    }
}
@keyframes layerhide {
    0% {}
    80% {
        transform-origin: center center;
        transform: translate(0, 0) skew(-82deg) scale(.2);
        //transform: translate(0, 0) skew(-82deg) scale(.2);
    }
    100% {
        transform-origin: right center;
        transform: translate(10px, -50px) skew(-82deg) scale(.01);
        //transform: translate(10px, -50px) skew(-82deg) scale(.01);
        z-index: 0;
    }
}
.index-layer {
    position: absolute;
    top: @layer-top;
    right: @layer-right;
    z-index: 10060;
    width: @layer-width;
    height: @layer-height;
    background-color: rgba(0, 0, 0, .5);
    border-top: 1px solid @border-color;
    border-bottom: 1px solid @border-color;
    &.v-visible {
        animation: layershow 0.8s ease 0s;
        animation-fill-mode: both;
    }
    &.v-hidden {
        animation: layerhide 0.65s ease 0s;
        animation-fill-mode: both;
    }
}
.inner-wrapper {
    width: 100%;
    height: @layer-child-height;
    overflow: hidden;
    position: relative;
}
.head-box {
    color: #fff;
    border-bottom: 1px solid #fff;
    margin: 0 12px;
    padding: 7px 0 0 0;
    height: @layer-head-height;
    overflow: hidden;
    & > .city-name {
        position: absolute;
        top: 13px;
        left: 16px;
        font-size: 16px;
        i.fa {
            font-size: 22px;
        }
        span {
            vertical-align: 1px;
            margin-left: 4px;
        }
    }
    & > .ctrl-box {
        clear: both;
        width: 100%;
        text-align: center;
        a {
            color: #fff;
            padding: 8px 12px;
            display: inline-block;
            &:hover {
                color: @theme-color;
            }
            &.v-disabled {
                color: #999;
                cursor: not-allowed;
            }
            i {
                font-size: 20px;
            }
        }
        span {
            font-size: 20px;
            vertical-align: 2px;
            margin: 0 10px;
        }
    }
    & > .hide-btn {
        position: absolute;
        top: 6px;
        right: 6px;
        color: #fff;
        font-size: 20px;
        padding: 4px 8px;
    }
}
.corner-1-1,
.corner-1-2,
.corner-2-1,
.corner-2-2,
.corner-3-1,
.corner-3-2,
.corner-4-1,
.corner-4-2 {
    position: absolute;
}
.corner-1-1,
.corner-2-1,
.corner-3-1,
.corner-4-1 {
    width: @corner-size;
    height: @corner-size;
    border: 3px solid @orange-color;
}
.corner-1-1,
.corner-2-1 {
    top: -2px;
    border-bottom: none;
}
.corner-3-1,
.corner-4-1 {
    bottom: -2px;
    border-top: none;
}
.corner-2-1,
.corner-3-1 {
    right: -1px;
}
.corner-1-1,
.corner-4-1 {
    left: -2px;
    border-right: none;
}
.corner-2-1,
.corner-3-1 {
    border-left: none;
}
.corner-1-2,
.corner-2-2,
.corner-3-2,
.corner-4-2 {
    width: 1px;
    height: @corner-size-2;
}
.corner-1-2,
.corner-2-2 {
    top: 0;
}
.corner-1-2,
.corner-4-2 {
    left: -1px;
}
.corner-3-2,
.corner-4-2 {
    bottom: 0;
}
.corner-1-2,
.corner-4-2 {
    border-left: 1px solid @border-color;
}
.corner-2-2,
.corner-3-2 {
    right: 0px;
    border-right: 1px solid @border-color;
}

</style>

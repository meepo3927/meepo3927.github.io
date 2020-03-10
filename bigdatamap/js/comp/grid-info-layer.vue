<template>
<div class="grid-info-layer" :style="myStyle">
    <div class="v-wrapper">
        <div class="my-row">
            <label for="">网格ID：</label>
            <span v-text="p.i"></span>
        </div>
        <div class="my-row">
            <label for="">综合评分：</label>
            <span v-text="p.value" class="span-score"></span>
        </div>
        <div class="my-row">
            <label for="">常驻人口：</label>
            <span v-text="userNum" class="span-usernum"></span>
        </div>
        <div class="my-row">
            <label for="">人均ARPU：</label>
            <span v-text="arpu + '元'" class="span-arpu"></span>
        </div>
        <i class="fa fa-caret-left"></i>
    </div>
</div>
</template>

<script>
let methods = {};
methods.render = function (point) {
    this.point = point;
};
let computed = {};
computed.p = function () {
    return this.point || {};
};
computed.userNum = function () {
    let p = this.p;
    if (p.value) {
        return (p.value * 16) + (p.value % 7) + ((p.value * 2) % 3);
    }
    return 0;
};
computed.arpu = function () {
    let p = this.p;
    if (p.value) {
        return 30 + (p.value % 15) + Math.floor(p.value * 10 / 12) / 10;
    }
    return 0;
};
computed.myStyle = function () {
    let s = {};
    let p = this.point;
    if (p) {
        let x = p.x;
        let y = p.y;
        let rx = Math.round(p.rx / 2);
        let ry = Math.round(p.ry / 2);
        let top = y - ry;
        let left = x + rx;
        s.top = top + 'px';
        s.left = (left + 7) + 'px';
    } else {
        s.display = 'none';
    }
    return s;
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        point: null
    };
    return o;
};
module.exports = {
    name: 'grid-info-layer',
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";

.grid-info-layer {
    position: fixed;
    z-index: 10070;
    pointer-events: none;
}
.v-wrapper {
    position: relative;
    background-color: rgba(0, 0, 0, .6);
    padding: 10px 12px;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
}
.my-row {
    margin-top: 10px;
    &:nth-child(1) {
        margin-top: 1px;
    }
    label {
        display: inline-block;
        width: 80px;
    }
    span {
        display: inline-block;
        &.span-score {
            color: @orange-color;
        }
        &.span-usernum {
            color: #00eeee;
        }
        &.span-arpu {
            color: @green-color;
        }
    }
}
.fa-caret-left {
    color: rgba(0, 0, 0, .8);
    font-size: 22px;
    position: absolute;
    top: 10px;
    left: -7px;
}
</style>

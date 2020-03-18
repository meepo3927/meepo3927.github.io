<template>
<div class="radius-slider">
    <ul>
        <li class="li-0">(千米)</li>
        <li class="li-1">1</li>
        <li class="li-2">2</li>
        <li class="li-3">3</li>
        <li class="li-4">4</li>
        <li class="li-5">5</li>
    </ul>
    <label :title="radius" >半径：</label>
    <div class="slider-wrapper">
        <v-slider v-model="r" min="1000" max="5000"/>
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.radius = function () {
    return Math.round(this.r / 1000) * 1000;
};
let watch = {};
watch.radius = function (v) {
    this.$emit('input', v);
};
const created = function () {};
const mounted = function () {
    if (this.value !== undefined) {
        this.r = this.value;
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        r: undefined
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['value'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@all-width:     360px;
@label-width:   40px;
.radius-slider {
    width: @all-width;
    padding: 12px 12px 12px 20px;
    background-color: #fff;
    border-radius: 6px;
    & > label {
        float: left;
        font-size: 16px;
        font-weight: bold;
    }
}
.slider-wrapper {
    margin-top: 7px;
    margin-left: @label-width + 9px;
}
ul {
    width: @all-width + 50px;
}
ul > li {
    display: inline-block;
    width: 46px;
    margin-left: 13px;
    &.li-0 {
        margin-left: -1px;
    }
    &.li-1 {
        margin-left: 7px;
    }
}
</style>

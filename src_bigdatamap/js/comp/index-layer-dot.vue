<template>
<div class="v-dot">
    <ul v-if="list">
        <li :class="{active: i === value}" v-for="(v, i) in list">
            <a href="javascript:;" @click="onClick(v, i)"></a>
        </li>
    </ul>
</div>
</template>

<script>
let methods = {};
methods.onClick = function (v, i) {
    this.$emit('click', v, i);
};
let computed = {};
computed.list = function () {
    if (!this.max || this.max == 0) {
        return;
    }
    let arr = [];
    for (let i = 0; i < this.max; i++) {
        arr.push(i);
    }
    return arr;
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
    props: ['max', 'value'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
@box-width:  120px;
@dot-size:   12px;
.v-dot {
    text-align: center;
    position: absolute;
    width: @box-width;
    margin-left: -(@box-width / 2);
    bottom: 10px;
    left: 50%;
}
ul {
    margin: auto;
}
ul > li {
    display: inline-block;
    margin-left: 25px;
    &:nth-child(1) {
        margin-left: 0;
    }
    & > a {
        display: inline-block;
        width: @dot-size;
        height: @dot-size;
        border: 1px solid #fff;
        border-radius: 50%;
    }
    &.active > a {
        background-color: #fff;
    }
}
</style>

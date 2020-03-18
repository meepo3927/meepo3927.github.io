<template>
<div class="layer-nav-box">
    <ul :class="class1" v-if="list">
        <li :class="{active: i === value}" v-for="(v, i) in list">
            <a href="javascript:;" v-text="v" @click="onClick(v, i)"></a>
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
computed.class1 = function () {
    if (!this.list) {
        return;
    }
    return ['count-' + this.list.length];
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
    props: ['list', 'value'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
.layer-nav-box {
    text-align: center;
}
ul {
    margin: auto;
    width: 80%;
}
ul.count-2 > li {width: 50%;}
ul.count-3 > li {width: 33.3%;}
ul.count-4 > li {width: 25%;}
ul.count-5 > li {width: 20%;}
ul > li {
    margin-left: 0px;
    display: inline-block;
    &:nth-child(1) {
        margin-left: 0;
    }
    & > a {
        color: #fff;
        font-size: 18px;
        padding-bottom: 2px;
        &:hover {
            color: @orange-color;
        }
    }
    &.active > a {
        border-bottom: 2px solid @orange-color;
    }
}
</style>

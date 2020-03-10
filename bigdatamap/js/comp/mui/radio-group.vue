<template>
<ul class="radio-group" :class="[layout, 'num-3']">
    <li :class="{active: v.value === value}" v-for="(v, i) in list"
        @click="onClick(v)">
        <em><i></i></em>
        <label v-text="v.text"></label>
    </li>
</ul>
</template>

<script>
let methods = {};
methods.onClick = function (item) {
    this.$emit('input', item.value);
};
let computed = {};
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
    props: {
        value: {},
        layout: {
            type: String,
            default: 'v-default'
        },
        list: Array
    },
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@main-color:  #6996EF;
@radio-size:       14px;
@ratio-inner-pad:  2px;
@radio-inner-size: @radio-size - @ratio-inner-pad * 2;
ul > li {
    cursor: pointer;
    em, em > i {
        border: 1px solid @main-color;
        border-radius: 50%;
        display: inline-block;
    }
    em {
        width: @radio-size;
        height: @radio-size;
        text-align: center;
        vertical-align: middle;
        line-height: 0;
        padding-top: @ratio-inner-pad / 2;
        & > i {
            width: @radio-inner-size;
            height: @radio-inner-size;
        }
    }
    label {
        cursor: inherit;
        font-size: 14px;
        vertical-align: -1px;
    }
    &.active > em > i {
        background-color: @main-color;
    }
}
ul.v-default {
    & > li {
        display: inline-block;
    }
}
ul.v-center-percent {
    & > li {
        display: inline-block;
        text-align: center;
    }
}
ul.num-2 > li {width: 50%}
ul.num-3 > li {width: 33.3%}
ul.num-4 > li {width: 25%}
ul.num-5 > li {width: 20%}
</style>

<template>
<div class="my-nav" :class="{'has-action': action}">
    <ul v-if="list">
        <li v-for="(v, i) in list" @click="onClick(v, i)" 
            @mouseenter="onMouseEnter(v, i)">
            <i class="fa fa-circle" :style="{color: v.color}"></i> {{v.name}}
        </li>
    </ul>
</div>
</template>

<script>
let methods = {};
methods.onClick = function (item, i) {
    this.$emit('click', item, i);
};
methods.onMouseEnter = function (item, i) {
    this.$emit('enter', item, i);
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
    props: ['list', 'action'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.my-nav {
    position: absolute;
    z-index: 10010;
}
.my-nav.has-action {
    ul > li {
        cursor: pointer;
        &:hover {
            color: #ccc;
        }
    }
}
ul > li {
    color: #eee;
    text-shadow: 2px 2px 6px #000;
    display: block;
    font-size: 1.3em;
    i {
        margin-right: 4px;
    }
}
</style>

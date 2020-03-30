<template>
<div class="v-head">
    <h1>东方万里内蒙古分公司大数据展示</h1>
    <div class="top-gif"></div>
</div>
</template>

<script>
var methods = {};
var computed = {};
var watch = {};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
    var o = {};
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [],
    methods,
    computed,
    props: [],
    mounted,
    destroyed,
    components: {}
};
</script>

<style scoped lang="less">
.v-head {
    text-align: center;
    position: fixed;
    left: 50%;
    width: 800px;
    margin-left: -400px;
    top: 10px;
    z-index: 5;
}
h1 {
    color: rgb(255, 255, 255);
    font-weight: lighter;
    font-size: 32px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

</style>
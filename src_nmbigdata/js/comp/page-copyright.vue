<template>
<div class="page-copyright">
    <div class="copyright-text">
        内蒙古移动 &copy; 版权所有
        <a :href="getPageUrl('/login')" class="ml10">管理后台</a>
    </div>
</div>
</template>

<script>
let methods = {};
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
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.page-copyright {
    margin-top: 90px;
    background-color: #1C1C1C;
    padding: 40px 30px 35px;
}
.copyright-text {
    text-align: center;
    color: #fff;
    font-size: 16px;
}
</style>

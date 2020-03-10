<template>
<div class="test-upload">
    <h4>上传测试</h4>

    <div>
        <file-upload action="http://localhost/upload" />
        <file-upload action="http://localhost/never" />
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
    components: {
        'file-upload': require('comp/common/file-upload.vue')
    }
};
</script>

<style scoped lang="less">
.test-upload {
    padding-left: 15px;
}
</style>

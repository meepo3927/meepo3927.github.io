<template>
<tfoot>
    <tr>
        <td :colspan="cols" class="text-center" 
            :class="[cls]">暂无数据</td>
    </tr>
</tfoot>
</template>

<script>
const methods = {};
const computed = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    const o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: ['cols', 'cls'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">

</style>

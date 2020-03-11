<template>
<table class="table m-table">
    <thead>
        <tr>
            <th>关键词</th>
            <th>
                搜索指数
                <a href="javascript:;" @click="sortBy('ranking')">
                    <i class="fa fa-sort"></i>
                </a>
            </th>
            <th>类别</th>
            <th>二级分类</th>
        </tr>
    </thead>
    <tbody>
        <tr v-if="dataReady" v-for="v in list">
            <td v-text="v.keyword"></td>
            <td v-text="v.ranking"></td>
            <td v-text="v.type_name"></td>
            <td v-text="v.sub_type_name"></td>
        </tr>
    </tbody>
    <tfoot v-if="loading">
        <tr>
            <td colspan="4"><div class="loading-1"></div></td>
        </tr>
    </tfoot>
    <tfoot v-if="dataEmpty">
        <tr>
            <td class="text-center" colspan="4">暂无数据</td>
        </tr>
    </tfoot>
</table>
</template>

<script>
let methods = {};
methods.sortBy = function (keyName) {
    this.$emit('sort', keyName);
};
let computed = {};
computed.loading = function () {
    return (this.list === 'loading');
};
computed.dataEmpty = function () {
    return this.list && (this.list.length === 0);
};
computed.dataReady = function () {
    return Array.isArray(this.list) && (this.list.length > 0)
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['list'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
thead > tr > th {
    background-color: #fff;
}
tr > th,
tr > td {
    text-align: center;
}
.loading-1 {
    margin-left: auto;
    margin-right: auto;
}
</style>

<template>
<table class="table route-table" >
    <thead>
        <tr>
            <th class="col-1">TOP</th>
            <th class="col-2 tal">旅游线路</th>
            <th class="col-3">游客数</th>
        </tr>
    </thead>
    <tbody v-if="list">
        <tr v-for="(v, i) in list">
            <td v-text="i + 1" class="tac"></td>
            <td v-text="v.routeDESC" ></td>
            <td v-text="v.number" class="tac"></td>
        </tr>
    </tbody>
    <tbody v-if="list === null">
        <tr>
            <td colspan="3" class="tac">暂无数据</td>
        </tr>
    </tbody>
    <tbody v-if="list === undefined">
        <tr>
            <td colspan="3" class="tac">
                <div class="loading-1 m-center"></div>
            </td>
        </tr>
    </tbody>
</table>
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
table th {
    white-space: nowrap;
}
tbody > tr > td {
    padding: 2px 8px;
    height: 42px;
}
</style>

<template>
<div class="page-channel-intro">
    <h2>触点说明</h2>
    <table class="m-table">
        <thead>
            <tr>
                <th>触点名称</th>
                <th>营销方式</th>
                <th>营销形式</th>
                <th>渠道类型</th>
                <th>引入时间</th>
            </tr>
        </thead>
        <tbody v-if="list">
            <tr v-for="v in list">
                <td v-text="v.channelTitle"></td>
                <td v-text="v.mpMethods"></td>
                <td v-text="v.mpForm"></td>
                <td v-text="v.channelType"></td>
                <td v-text="v.introMonth"></td>
            </tr>
        </tbody>
        <tfoot v-if="list === undefined">
            <tr>
                <td :colspan="colSpan">
                    <div class="loading-1 m-center"></div>
                </td>
            </tr>
        </tfoot>
        <tfoot v-if="list === null">
            <tr>
                <td :colspan="colSpan" class="data-empty">暂无数据</td>
            </tr>
        </tfoot>
    </table>
</div>
</template>

<script>
const methods = {};
const computed = {};
computed.colSpan = function () {
    return 5;
};
const created = function () {};
const mounted = function () {
    Request.fetch2('/dataplus/getChannelDesc').then((data) => {
        this.list = (data && data.length) ? data : null;
    }).catch(() => {
        this.list = null;
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: undefined
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.page-channel-intro {
    padding: 1px 20px;
}
.data-empty {
    text-align: center;
    color: #999;
}
</style>

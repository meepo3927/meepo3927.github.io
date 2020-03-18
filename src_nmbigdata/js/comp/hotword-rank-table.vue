<template>
<table class="table hotword-rank-table">
    <thead>
        <tr>
            <th class="col-trend">走势</th>
            <th>热点资讯</th>
            <th class="col-num">曝光量</th>
        </tr>
    </thead>
    <tbody v-if="dataReady">
        <template v-for="v in list">
            <tr >
                <td class="col-trend" :class="[v.status]">
                    <i class="fa fa-arrow-circle-o-up" v-if="v.status === 'up'"></i>
                    <i class="fa fa-arrow-circle-o-down" v-if="v.status === 'down'"></i>
                </td>
                <td v-text="v.searchWords"></td>
                <td class="col-num" v-text="v.totalTimes"></td>
            </tr>
        </template>
    </tbody>
    <tfoot v-if="dataEmpty">
        <tr>
            <td colspan="3"><span>暂无数据</span></td>
        </tr>
    </tfoot>
    <tfoot v-if="list === 'loading'">
        <tr>
            <td colspan="3">
                <div class="loading-1"></div>
            </td>
        </tr>
    </tfoot>
</table>
</template>

<script>
let methods = {};
let computed = {};
computed.dataReady = function () {
    return (this.list) && Array.isArray(this.list);
};
computed.dataEmpty = function () {
    if (this.list && this.list.length === 0) {
        return true;
    }
    if (this.list === null) {
        return true;
    }
    return false;
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
    props: ['list'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.hotword-rank-table {
    thead th {
        font-size: 16px;
    }
    .col-trend {
        text-align: center;
        width: 56px;
        i {
            font-size: 24px;
        }
    }
    .col-num {
        width: 80px;
    }
    td.up {
        color: #008000;
    }
    td.down {
        color: #f00;
    }
}

</style>

<template>
<table>
    <thead>
        <tr>
            <th class="text-center"></th>
            <th>活动名称</th>
            <th>渠道</th>
            <th>成功率</th>
        </tr>
    </thead>
    <tbody v-if="list">
        <tr v-for="(v, i) in list">
            <td v-text="i + 1" class="col-index" :class="[getIndexClass(i + 1)]"></td>
            <td class="col-name">
                <a href="javascript:;" @click="onRowClick(v)"
                    v-text="v.mpSubName"></a>
            </td>
            <td v-text="v.channelTitle"></td>
            <td v-text="getPercent(v.rateOfSuccess)"></td>
        </tr>
    </tbody>
    <tfoot v-if="list === null">
        <tr>
            <td colspan="4" class="data-empty-cell text-center text-muted">暂无数据</td>
        </tr>
    </tfoot>
    <tfoot v-if="list === undefined">
        <tr>
            <td colspan="4"><div class="loading-3 loading-mcenter"></div></td>
        </tr>
    </tfoot>
</table>
</template>

<script>
import URL from 'util/url.js';
const methods = {};
methods.onRowClick = function (item) {
    mlayer.msg('打开子页面');
};
methods.getPercent = function (p) {
    return p ? (p + '%') : '--';
};
methods.getIndexClass = function (n) {
    return 'index-' + n;
};
const computed = {};
// 查看更多
computed.isModeMore = function () {
    return (this.mode === 'more')
};
const created = function () {};
const mounted = function () {
    const url = this.isModeMore 
        ? '/firstPageNew/getMoreHotMarketingCampaign'
        : '/firstPageNew/getHotMarketingCampaign';
    Request.fetch2(url).then((data) => {
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
    props: ['mode'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@index-color-1:  #FFA07D;
@index-color-2:  #FCDE5C;
@index-color-3:  #ACD696;
table {
    width: 100%;
}
thead > tr {
    background-color: #E5F7FB;
}
tr > th, tr > td {
    padding: 10px 12px;
    font-size: 15px;
}
tr > td {
    padding: 8px 12px;
}
td.col-index {
    text-align: center;
    font-weight: bold;
    color: #999;
}
td.col-name a {
    color: #333;
    &:hover {
        color: #5FAEE3;
    }
}
td.col-index.index-1 {color:@index-color-1;}
td.col-index.index-2 {color:@index-color-2;}
td.col-index.index-3 {color:@index-color-3;}
.data-empty-cell {}
</style>

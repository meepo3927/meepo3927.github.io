<template>
<center-layer close="true" @close="$emit('close')"
    width="60vw">
    <div class="panel panel-primary">
        <div class="panel-heading">营销语模板</div>
        <div class="panel-body">
            <!-- 筛选 -->
            <div class="m-row-mid-auto mb15">
                <div class="pl5">营销语检索：</div>
                <div class="pl15">
                    <input type="text" class="form-control keyword-input" 
                        v-model="marketContent" />
                </div>
                <div class="pl15">
                    <button class="btn btn-primary" type="button"
                        @click="fetchRender">查找</button>
                </div>
            </div>

            <!-- 列表 -->
            <table class="m-table">
                <tbody v-if="mlist">
                    <tr v-for="v in mlist">
                        <td v-text="v.market_content"></td>
                        <td>
                            <button class="btn btn-default"
                                @click="choose(v)">选择</button>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="mlist === null">
                    <tr>
                        <td colspan="2" class="text-center" v-text="msg"></td>
                    </tr>
                </tfoot>
                <tfoot v-if="mlist === undefined">
                    <tr>
                        <td colspan="2">
                            <div class="loading-1 m-center"></div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <!-- 分页 -->
            <v-pagination :cur-page="curPage" :total-page="totalPage" 
               @click="onPageClick" />
        </div>
    </div>
</center-layer>
</template>

<script>
let methods = {};
methods.onPageClick = function (p) {
    if (this.curPage === p) {
        return;
    }
    this.curPage = p;
    this.fetchRender();
};
methods.choose = function (item) {
    this.$emit('choose', item);
};
methods.fetchRender = function () {
    let p = {
        marketContent: encodeURIComponent(this.marketContent),
        currentPage: this.curPage,
        limit: this.NUM_PER_PAGE,
        channel_id: this.type
    };
    this.msg = '';
    this.olist = undefined;
    this.vRequest.getMarketSentenceList(p).then((result) => {
        if (result.resultData) {
            this.olist = result.resultData;
            this.totalPage = result.total;
        } else {
            this.olist = null;
            this.msg = result.resultMsg || '暂无数据';
            LOG(result);
        }
    }).catch((e) => {
        this.olist = null;
        this.msg = '查询数据失败';
    });
};
let computed = {};
computed.NUM_PER_PAGE = function () {
    return 10;
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        msg: '',
        marketContent: '',
        olist: undefined
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['type'],
    mounted,
    mixins: [
        require('mixins/paging.js')
    ],
    beforeDestroy,
    components: {
        'v-pagination': require('comp/common/pagination.vue')
    }
};
</script>

<style scoped lang="less">
.keyword-input {
    width: 300px;
}
.panel {
    margin-bottom: 0;
}
.panel-body {
    padding-bottom: 1px;
}
</style>

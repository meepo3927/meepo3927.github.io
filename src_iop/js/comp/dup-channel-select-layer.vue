<template>
<center-layer width="70vw">
    <div class="panel panel-primary">
        <div class="panel-heading">
            <span>营销活动模版</span>
            <a href="javascript:;" class="my-close-btn" @click="closeMe">
                <i class="fa fa-times-circle"></i>
            </a>
        </div>
        <div class="panel-body">
            <!-- 筛选 -->
            <div class="m-row-mid-auto mb15">
                <div class="pl5">营销活动检索：</div>
                <div class="pl15">
                    <input type="text" class="form-control keyword-input" 
                        v-model="mpSubName" />
                </div>
                <div class="pl15">
                    <button class="btn btn-primary" type="button"
                        @click="fetchRender">查找</button>
                </div>
            </div>

            <!-- 列表 -->
            <table>
                <thead>
                    <tr>
                        <th>地市</th>
                        <th>渠道</th>
                        <th>营销活动</th>
                        <th class="col-btn">操作</th>
                    </tr>
                </thead>
                <tbody v-if="mlist">
                    <tr v-for="v in mlist">
                        <td v-text="v.cityTitle"></td>
                        <td v-text="v.channelTitle"></td>
                        <td v-text="v.mpSubName"></td>
                        <td >
                            <button type="button" class="btn btn-default mr10"
                                @click="browse(v)">查看</button>
                            <button type="button" class="btn btn-info"
                                @click="choose(v)">选择</button>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="mlist === null">
                    <tr>
                        <td colspan="4" class="text-center" v-text="msg"></td>
                    </tr>
                </tfoot>
                <tfoot v-if="mlist === undefined">
                    <tr>
                        <td colspan="4">
                            <div class="loading-1 m-center"></div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <!-- 分页 -->
            <v-pagination :cur-page="curPage" :total-page="totalPage" 
                class="v-pagination"
                @click="onPageClick" />
        </div>
    </div>
</center-layer>
</template>

<script>
let methods = {};
methods.closeMe = function () {
    this.$emit('close');
};
methods.onPageClick = function (p) {
    if (this.curPage === p) {
        return;
    }
    this.curPage = p;
    this.fetchRender();
};
methods.fetchRender = function () {
    let p = {
        mpSubName: encodeURIComponent(this.mpSubName),
        searchType: 'allTemp',
        currentPage: this.curPage,
        limit: this.NUM_PER_PAGE
    };
    this.msg = '';
    this.olist = undefined;
    this.vRequest.getPolicyTemplateList(p).then((result) => {
        if (result.resultData) {
            let data = result.resultData;
            this.olist = data.root;
            this.totalPage = data.total;
        } else {
            this.olist = null;
            this.msg = result.resultMsg || '暂无数据';
        }
    }).catch(() => {
        this.olist = null;
        this.msg = '查询数据失败';
    });
};
methods.browse = function (item) {
    this.$emit('browse', item);
};
methods.choose = function (item) {
    this.$emit('choose', item);
};
let computed = {};
computed.NUM_PER_PAGE = function () {
    return 5;
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
        mpSubName: '',
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
    padding-bottom: 15px;
}
.my-close-btn {
    position: absolute;
    top: 5px;
    right: 12px;
    font-size: 24px;
    color: #fff;
    &:hover {
        color: #333;
    }
}
table {
    width: 100%;
    thead th {
        background-color: #D9D9D9;
        padding-top: 8px;
        padding-bottom: 8px;
    }
    td, th {
        padding: 4px 12px;
        border: 1px solid #999;
    }
    th.col-btn {
        width: 164px;
    }
}
.v-pagination {
    margin-bottom: 1px;
}
</style>

<template>
<div class="vue-comp">
    <!-- 页面头部 
        <div is="vue-pageheader"></div>
    -->
    <!-- 主体内容 -->
    <div class="m-container">
        <page-title main="触点库" sub="触点列表"></page-title>

        <!-- tab按钮 -->
        <ul is="tab-btn-group" class="mt30" list="触点查询"></ul>
        <!-- 筛选区域 -->
        <div class="panel p20">
            <table-filter @search="search" />
        </div><!-- panel -->
        <div class="multi-op-box">
            <button class="btn btn-primary" @click="batchStart">
                <i class="fa fa-play"></i> 批量启用
            </button>
            <button class="btn btn-primary ml15" @click="batchStop">
                <i class="fa fa-pause"></i> 批量停用
            </button>
        </div>
        <!-- table -->
        <div class="table-panel mt20" >
            <v-table :list="list" :loading="view.loading" @refresh="refresh" />
        </div>

        <div is="table-footer" ref="tableFooter" :option="paging" @click="onTableFooterClick"></div>
    </div>
</div>
</template>

<script>
let methods = {};
methods.getCheckedJSON = function () {
    let json = [];
    this.list.forEach((item) => {
        if (item.checked) {
            json.push({
                marketActId: item.marketingActId,
                contactId: item.contactId
            });
        }
    });
    return json;
};
methods.batchStart = function () {
    let json = this.getCheckedJSON();
    if (json.length === 0) {
        return mlayer.msg('请选择要启用的记录');
    }
    if (!confirm(`确定启用选中的${json.length}条记录吗？`)) {
        return;
    }
    const p = {
        json: JSON.stringify(json),
        startStopFlag: 1
    };
    const url = Request.ajaxUrlBase + '/contact/changeStartStopMulti.action';
    Request.op(url, p, 'post').then(() => {
        mlayer.iconMsg(Config.msg.opSuccess);
        this.delayCall(this.refresh);
    }, () => {
        mlayer.msg(Config.msg.opfail);
    });
};
methods.batchStop = function () {
    let json = this.getCheckedJSON();
    if (json.length === 0) {
        return mlayer.msg('请选择要停用的记录');
    }
    if (!confirm(`确定启用停用的${json.length}条记录吗？`)) {
        return;
    }
    let p = {
        json: JSON.stringify(json),
        startStopFlag: 0
    };
    const url = Request.ajaxUrlBase + '/contact/changeStartStopMulti.action';
    Request.op(url, p, 'post').then(() => {
        mlayer.iconMsg(Config.msg.opSuccess);
        this.delayCall(this.refresh);
    }, () => {
        mlayer.msg(Config.msg.opfail);
    });
};
methods.search = function (p) {
    p.page = 1;
    this.fetchRender(Tool.filterEmpty(p));
};
methods.refresh = function () {
    this.fetchRender();
};
methods.fetchRender = function (options = {}) {
    this.view.loading = true;
    const page = options.page || this.curPage;
    this.list = [];
    Request.getContactList(options).then((r) => {
        r = this.adaptData(r);
        this.list = (this.processPaging(r));
        this.curPage = page;
        this.view.loading = false;
    }, () => {
        this.curPage = page;
        this.view.loading = false;
    });
};
methods.onTableFooterClick = function (page) {
    this.curPage = page;
    this.list = this.pagingCut({page});
};
methods.adaptData = function (list) {
    for (let i = 0; i < list.length; i++) {
        // 编辑模式
        list[i].isModeEdit = false;
        // 编辑字段
        list[i].contactIdForEdit = list[i].contactId;
        let pdesc = list[i].priorityDesc;
        // 优先级 和 编辑字段
        list[i].priority = Config.contactPriorityMap[pdesc];
        list[i].priorityForEdit = list[i].priority;

        // 选中状态
        list[i].checked = false;
    }
    return list;
};
let computed = {};
let watch = {};
const created = function () {
    this.fetchRender();
};
const mounted = function () {};
const destroyed = function () {};
const dataFunc = function () {
    let o = {
        view: {
            loading: false
        },
        list: []
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('comp/common/paging_mix.js')
    ],
    destroyed,
    components: {
        'tab-btn-group': require('comp/tab_btn_group.vue'),
        'table-filter': require('comp/contact/table-filter.vue'),
        'v-table': require('comp/contact/table.vue')
    }
};
</script>

<style scoped lang="less">
.vue-comp {
    
}
</style>

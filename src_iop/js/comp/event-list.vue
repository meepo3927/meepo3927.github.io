<template>
<div class="event-list-page">
    <!-- 页面头部 
    <div is="vue-pageheader"></div>
    -->

    <!-- 主体内容 -->
    <div class="m-container">
        <page-title main="事件中心" ></page-title>
        <!-- 创建按钮 -->
        <a :href="getStaticUrl('/create_event')" @click="onCreateClick"
             class="common-create-link fr mt35">
            <i class="fa fa-plus-square"></i>
            <span>新建事件</span>
        </a>
        <!-- tab按钮 -->
        <ul is="tab-btn-group" class="mt30" list="事件查询"></ul>
        <!-- 筛选区域 -->
        <div class="panel p20">
            <table-filter @search="search" />
        </div><!-- panel -->

        <!-- table -->
        <div class="table-panel mt30" >
            <v-table :list="list" :loading="view.loading" 
                @refresh="refresh" 
                @show-detail="showDetail" />
        </div>
        <table-footer ref="tableFooter" :option="pagingOptions" 
            @click="onPageClick" />

    </div><!-- m-container -->
    <full-layer ref="detail_layer" width="70%" height="auto" class-name="detail-layer"
        @close="onDetailClose" 
        anim="false">
        <h3>{{detailTitle}}详情：</h3>
        <div class="detail-content">
            <p class="detail-desc" v-text="detailDesc" v-if="isDetailText"></p>
            <ul v-if="isDetailArray">
                <li v-for="(v, i) in detailDesc" >
                    <span>{{i + 1}}. {{v}}</span>
                </li>
            </ul>
        </div>
    </full-layer>
</div>
</template>

<script>
import {request, config} from 'common';
import iframeUtil from 'iframeUtil';
import tool from 'util/tool.js';

let methods = {};
methods.onCreateClick = function () {
    iframeUtil.send('create_event_click');
};
methods.showDetail = function (item) {
    let title = item.evtSetName;
    request.getEventDetail(item.evtSetId).then((result) => {
        let desc = '';
        if (result[0] && result[0].evtSetDesc) {
            desc = result[0].evtSetDesc;
        }
        if (desc) {
            this.$refs.detail_layer.show();
            this.$nextTick(() => {
                this.detailTitle = title;
                this.detailDesc = desc;
            });
        } else {
            mlayer.msg(config.msg.fetchFail);
        }
        
        
    }, () => {
        mlayer.msg(config.msg.fetchFail);
    });
};
methods.fetchRender = function () {
    let param = tool.extend({}, this.condition);
    param.page = this.curPage;
    param.pageSize = this.PAGE_PER_NUM;
    this.view.loading = true;
    this.list = [];
    request.getEventsList(param).then((result) => {
        this.list = result.data;
        this.totalCount = result.total;
        this.view.loading = false;
    }).catch((e) => {
        this.curPage = 1;
        this.totalCount = 0;
        this.list = [];
        this.view.loading = false;
    });
};
methods.onDetailClose = function () {
    this.detailDesc = '';
};
methods.refresh = function () {
    this.fetchRender();
};
methods.search = function (param) {
    this.curPage = 1;
    this.condition = {};
    for (let k in param) {
        if (param[k]) {
            this.condition[k] = param[k];
        }
    }
    this.fetchRender();
};
methods.onPageClick = function (page) {
    this.curPage = page;
    this.fetchRender();
    //this.list = this.pagingCut({page});
};
let computed = {};
computed.isDetailText = function () {
    let d = this.detailDesc;
    if (d && typeof d === 'string') {
        return true;
    }
    return false;
};
computed.isDetailArray = function () {
    let d = this.detailDesc;
    if (d && d.length > -1 && typeof d === 'object') {
        return true;
    }
    return false;
};
computed.pagingOptions = function () {
    let start = (this.curPage - 1) * this.PAGE_PER_NUM + 1;
    let end = this.curPage * this.PAGE_PER_NUM;
    let totalCount = this.totalCount;
    if (end > totalCount) {
        end = totalCount;
    }
    let totalPage = Math.floor((totalCount - 1) / this.PAGE_PER_NUM) + 1;
    return {
        start, end,
        totalCount,
        curPage: this.curPage,
        totalPage
    };
};
computed.PAGE_PER_NUM = function () {
    return 20;
};
let watch = {};
const created = function () {
    window.VM = this;
    this.fetchRender();
};
const mounted = function () {
};
const destroyed = function () {};
const dataFunc = function () {
    let o = {
        view: {
            loading: false
        },
        list: [],
        detailDesc: '',
        detailTitle: '',
        condition: {},
        // 分页
        curPage: 1,
        totalCount: 0
    };
    return o;
};
export default {
    data: dataFunc,
    methods,
    computed,
    watch,
    props: [],
    created,
    mounted,
    destroyed,
    mixins: [
        //require('comp/common/paging_mix.js')
    ],
    components: {
        'tab-btn-group': require('comp/tab_btn_group.vue'),
        'table-filter': require('comp/event/table_filter.vue'),
        'v-table': require('comp/event/table.vue')
    }
};
</script>

<style scoped lang="less">
.event-list-page {
}
.detail-layer h3 {
    margin-top: 10px;
}
.detail-content {
    max-height: 80vh;
    overflow-x: hidden;
    overflow-y: auto;
    p, li {
        word-wrap: break-word;
        word-break: break-all;
    }
}
</style>

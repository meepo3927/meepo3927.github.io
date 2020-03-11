<template>
<div class="page-model-list m-container">
    <page-title main="信息库" sub="模型视窗" />
    <!-- tab按钮 -->
    <tab-btn-group class="mt20" list="模型查询" />
    <!-- 筛选区域 -->
    <div class="panel p20">
        <div class="m-row-mid-auto">
            <div class="pl5">名称：</div>
            <div class="pl15">
                <input type="text" class="form-control" v-model.trim="filterName"
                    placeholder="模糊查询" />
            </div>
            <div class="pl15" >排序规则：</div>
            <div class="pl10">
                <select class="form-control" v-model="filterSort">
                    <option value="1">默认</option>
                    <option value="2">最新更新</option>
                </select>
            </div>

            <div class="pl15" >类别：</div>
            <div class="pl10">
                <select class="form-control sel-type" v-model="filterType">
                    <option value="">全部</option>
                    <option v-for="v in types" v-text="v" :value="v"></option>
                </select>
            </div>

            <div class="pl25">
                <button class="btn btn-primary" type="button"
                    @click="filter">查询</button>
            </div>
        </div>
    </div><!-- 筛选 -->
    <div class="model-list-wrapper">
        <div class="loading-wrapper" v-show="loading">
            <div class="loading-1" ></div>
        </div>
        <ul class="model-list" v-if="dataReady">
            <model-card v-for="v in list" :data="v" :key="v.id" />
        </ul>
        <div class="data-empty " v-if="dataEmpty">查询结果为空</div>
    </div>
</div>
</template>

<script>
let methods = {};
methods.filter = function () {
    if (!this.olist) {
        return;
    }
    const modelName = this.filterName;
    const modelType = this.filterType;
    this.list = this.olist.filter((item) => {
        if (modelName && item.modelName.indexOf(modelName) < 0) {
            return false;
        }
        if (modelType && item.modelType !== modelType) {
            return false;
        }
        return true;
    });
    if (this.filterSort === '2') {
        this.list.sort((a, b) => {
            return (a.updateTime > b.updateTime) ? -1 : 1
        });
    }
};
methods.fetchRender = function () {
    let p = {};
    this.list = undefined;
    this.olist = undefined;
    Request.getModelInfo(p).then((data) => {
        this.list = this.olist = data;
    }).catch(() => {
        this.olist = this.list = [];
    });
};
let computed = {};
computed.loading = function () {
    return (this.list === undefined);
};
computed.dataReady = function () {
    return Array.isArray(this.list) && (this.list.length > 0)
};
computed.dataEmpty = function () {
    return Array.isArray(this.list) && !this.list.length;
};
computed.types = function () {
    return this.$modelTypeOptions;
};
let watch = {};
const mounted = function () {
    window.VM = this;
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: undefined,
        olist: undefined,
        filterName: '',
        filterSort: '1',
        filterType: ''
    };
    return o;
};
export default {
    data: dataFunc,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/model.js')
    ],
    beforeDestroy,
    components: {
        'model-card': require('comp/model-cardn.vue'),
        'tab-btn-group': require('comp/tab_btn_group.vue')
    }
};
</script>

<style scoped lang="less">
.page-model-list {
}
.loading-wrapper {
    background-color: #fff;
    border-radius: 10px;
    padding: 25px;
    & > div {
        margin-left: auto;
        margin-right: auto;
    }
}
.sel-type {
    width: 120px;
}
ul.model-list {
    font-size: 0;
}
.data-empty {
    background-color: #fff;
    border-radius: 8px;
    padding: 12px;
    color: #777;
}
</style>

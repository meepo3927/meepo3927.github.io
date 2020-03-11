<template>
<div class="page-hot-content m-container">
    <page-title main="知识图谱" sub="内容热点信息" />
    <!-- tab按钮 -->
    <tab-btn-group class="mt30" list="热点查询" />
    <!-- 筛选区域 -->
    <div class="panel p20">
        <div class="m-row-mid-auto">
            <div class="pl5">关键词：</div>
            <div class="pl10">
                <input type="text" class="form-control" 
                    v-model="keyword" />
            </div>
            <div class="pl25">类别：</div>
            <div class="pl10">
                <select class="form-control cate1-sel" v-model="cate1">
                    <option v-for="v in cateOptions1" v-text="v.text"
                        :value="v.value"></option>
                </select>
            </div>
            <div class="pl25">二级类别：</div>
            <div class="pl10">
                <select class="form-control cate2-sel" v-model="cate2">
                    <option v-for="v in cateOptions2" v-text="v.text"
                        :value="v.value"></option>
                </select>
            </div>
            <div class="pl25">
                <button class="btn btn-primary" type="button" 
                    @click="filter">查询</button>
            </div>
        </div>
    </div><!-- panel -->

    <!-- 表格 -->
    <div class="table-section">
        <v-table :list="list" @sort="sort" />
    </div>
</div>
</template>

<script>
const DEFAULT_OPTION = {text: '全部', value: ''};
let methods = {};
methods.filter = function () {
    if (!Array.isArray(this.olist)) {
        return;
    }
    let w = this.keyword.trim();
    let cate1 = this.cate1;
    let cate2 = this.cate2;
    LOG([w, cate1, cate2]);
    this.list = this.olist.filter((item) => {
        if (w && (item.keyword.indexOf(w) === -1)) {
            return false;
        }
        if (cate1 && (item.type_name !== cate1)) {
            return false;
        }
        if (cate2 && (item.sub_type_name !== cate2)) {
            return false;
        }
        return true;
    });
};
methods.fetchRender = function () {
    let p = {};
    let req = this.vRequest.fetch2('/hotSearch/query', p);
    this.list = 'loading';
    this.setPromise('hotSearchQuery', req).then((data) => {
        this.list = data;
        this.olist = data;
    }).catch(() => {
        this.list = [];
    });
};
methods.sort = function (keyName) {
    if (!Array.isArray(this.list)) {
        return;
    }
    let a = this.sortKey.split('|');
    let val = 1;
    if (a[0] === keyName) {
        val = a[1] * -1;
    }
    this.sortKey = keyName + '|' + (val);
    this.list = this.list.sort((a, b) => {
        let n1 = a[keyName] * 1;
        let n2 = b[keyName] * 1;
        if (isNaN(n1) || isNaN(n2)) {
            return (a[keyName] > b[keyName]) ? val : -val;
        } else {
            return (n1 > n2) ? val : -val;
        }
    });
};
let computed = {};
computed.cateItem1 = function () {
    let val = this.cate1;
    return this.cateOptions1.filter((item) => {
        return (item.value === val);
    })[0]
};
computed.cateOptions2 = function () {
    if (!this.cateItem1) {
        return [DEFAULT_OPTION];
    }
    let list = this.cateItem1.child;
    if (!list) {
        return [DEFAULT_OPTION];
    }
    return [DEFAULT_OPTION].concat(list.map(v => {
        return {text: v, value: v};
    }));
};
let watch = {};
watch.cate1 = function () {
    this.cate2 = '';
};
const created = function () {};
const mounted = function () {
    this.vRequest.fetch2('/hotSearch/types').then((data) => {
        this.cateOptions1 = this.cateOptions1.concat(data.map(v => {
            v.value = v.text = v.name;
            return v;
        }));
    });
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {

    let o = {
        olist: undefined,
        list: undefined,
        type: 1,
        cate1: '',
        cate2: '',
        cateOptions1: [DEFAULT_OPTION],
        keyword: '',
        sortKey: ''
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
        require('mixins/request_mix.js')
    ],
    beforeDestroy,
    components: {
        'tab-btn-group': require('comp/tab_btn_group.vue'),
        'v-table': require('comp/hot-content-table.vue')
    }
};
</script>

<style scoped lang="less">
.page-hot-content {
}
select.cate1-sel {
    width: 100px;
}
select.cate2-sel {
    width: 120px;
}

</style>

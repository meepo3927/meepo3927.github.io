<template>
<div class="page-yxhotwords m-container">
    <page-title main="知识图谱" sub="营销常用语" />
    <!-- tab按钮 -->
    <tab-btn-group class="mt30" list="营销查询" />
    <!-- 筛选区域 -->
    <div class="panel p20">
        <div class="m-row-mid-auto">
            <div class="pl5">类型：</div>
            <div class="pl20">
                <select class="form-control type-sel" v-model="type">
                    <option value="1">全部</option>
                </select>
            </div>
        </div>
    </div><!-- panel -->

    <!-- 图表 -->
    <div class="chart-section">
        <div class="chart-1"><my-chart :o="o" /></div>
    </div>
</div>
</template>

<script>
// 词云
require('lib/echarts-wordcloud.min.js');

let methods = {};
methods.fetchRender = function () {
    this.o = null;
    let req = this.vRequest.fetch2('/wordCloud/words', {type: this.type});
    this.setPromise('getWordCloud', req).then((list) => {
        let data = list.map((v) => {
            return {
                name: v.word,
                value: v.rate
            }
        });
        this.o = {
            tooltip: {},
            series: this.getWordCloudSeries({data})
        };
    }).catch((e) => {
        this.o = 'empty';
    });
};
let computed = {};
let watch = {};
watch.type = function () {
    this.fetchRender();
};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        o: null,
        type: 1
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
        require('mixins/echarts_mix.js'),
        require('mixins/request_mix.js')
    ],
    beforeDestroy,
    components: {
        'tab-btn-group': require('comp/tab_btn_group.vue')
    }
};
</script>

<style scoped lang="less">
.page-yxhotwords {
}
select.type-sel {
    width: 120px;
}
.chart-section {
    background-color: #fff;
    border-radius: 6px;
}
.chart-1 {
    height: 540px;
}
</style>

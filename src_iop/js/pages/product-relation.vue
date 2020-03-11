<template>
<div class="page-product-relation m-container">
    <page-title main="知识图谱" sub="商品关联关系" />
    <!-- tab按钮 -->
    <tab-btn-group class="mt30" list="查询条件" />
    <!-- 筛选区域 -->
    <div class="panel p20">
        <div class="m-row-mid-auto">
            <div class="pl5">类别：</div>
            <div class="pl20">
                <select class="form-control type-sel" v-model="type">
                    <option value="1">全部</option>
                </select>
            </div>

            <div class="pl25">
                <button class="btn btn-primary" type="button" 
                    @click="fetchRender">查询</button>
            </div>
        </div>
    </div><!-- panel -->

    <!-- 表格 -->
    <div class="chart-section">
        <div class="chart-1"><my-chart :o="o"/></div>
    </div>
</div>
</template>

<script>
let methods = {};
methods.getOption = function (myData) {
    let label = {
        normal: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 12,
            formatter: (item) => {
                if (item.value !== undefined) {
                    return item.name + ':' + item.value
                }
                return item.name;
            }
        }
    };
    let data = [{
        name: '全部分类',
        children: myData
    }];
    return {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        backgroundColor: '#ffffff',
        series: {
            type: 'tree',
            data: data,
            top: 30,
            left: 70,
            right: 220,
            bottom: 30,
            initialTreeDepth: 2,
            symbolSize: 14,
            expandAndCollapse: true,
            label,
            leaves: {
                label: {
                    normal: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                }
            }
        }
    }
};
methods.fetchRender = function () {
    let p = {};
    let req = this.vRequest.fetch2('/merchandise/relation', p);
    this.o = null;
    this.setPromise('getProductRelation', req).then((data) => {
        this.o = this.getOption(data);
    }).catch((e) => {
        this.o = 'empty';
    });
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        type: 1,
        areaId: 471,
        o: null
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
        require('mixins/request_mix.js'),
        require('mixins/echarts_mix.js')
    ],
    beforeDestroy,
    components: {
        'tab-btn-group': require('comp/tab_btn_group.vue')
    }
};
</script>

<style scoped lang="less">
.page-hot-content {
}
.chart-1 {
    height: 1220px;
}
</style>

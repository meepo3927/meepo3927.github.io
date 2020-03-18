<template>
<div class="solution-part solution-part-8">
    <div class="solution-head">
        <div class="solution-banner">
            <img :src="getSolutionImg(myItem)" />
            <h3 ><i class="fa" :class="[myItemIcon]"></i>{{myItemName}}</h3>
        </div>

    </div>

    <!-- 内容 -->
    <div class="solution-content-body">
        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-user-circle-o"></i>零售户画像</h4>
            <p>利用移动大数据消费者信息、地理位置信息，将零售户与其周边消费者相匹配，实现全方位零售户画像，包括客户价值信息、客户基本特征、客户区域特征、客户电信特征、客户渠道偏好、客户兴趣爱好、客户上网行为等。</p>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-bullseye"></i>目标零售户提取</h4>
            <p>依据新品适用消费群特征信息，定位零售户，提取目标零售户信息，并提供基于GIS的目标零售户位置显性化展示和目标零售户明细报表，实现新品精细化投放。</p>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-pie-chart"></i>营销渠道监控</h4>
            <p>基于位置大数据，分析区域客户流与客户价值、监控营销渠道网络分布、物流分布和仓储情况，实现实时分析营销效率。</p>
        </div>

    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[7];
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
    props: [],
    mounted,
    mixins: [
        require('mixins/solution_part.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.solution-part-8 {
    
}
</style>

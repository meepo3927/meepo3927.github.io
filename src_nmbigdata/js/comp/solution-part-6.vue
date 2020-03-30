<template>
<div class="solution-part solution-part-6">
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
            <h4><i class="fa fa-male"></i>商圈客户画像</h4>
            <p>基于用户数据进行商圈客流画像，包括客户性别、年龄、消费水平、手机品牌、上网偏好、商业APP使用偏好、客户来源分析、与商圈工作地距离/居住地距离分析、商圈客户工作地/居住地分布等。</p>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-line-chart"></i>商圈客流监控</h4>
            <p>基于位置信令数据监控商圈客流，包括散客、常客、居住常驻、工作常驻等。支持按时、天、周、月等进行客流监控，提供客流驻留时长监控分析。</p>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-map-marker"></i>门店选址</h4>
            <p>整合内蒙古东方万里数据，为商家提供低成本、灵活、高效、精确的门店选址决策服务，改善经营效能，提升门店竞争力。对时段和区域内客流规模、变化规律、客户特征进行精准洞察， 帮助商户在店铺选址和精准营销中提供高价值的参考信息。</p>
        </div>

        <!-- row -->
        <div class="content-row t-left">
            <div class="content-col">
                <h4><i class="fa fa-bullhorn"></i>广告投放价值评估</h4>
                <p>基于位置信令数据、GIS信息、地理信息以及无线工参等信息，通过大数据技术计算广告位下的受众范围、受众人群，并分析受众的行为特征，评估广告投放价值，包括广告投放受众价值评估、广告位价值评估、广告内容价值评估等。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00601')" />
            </div>
        </div>
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[5];
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
.solution-part-6 {
    
}
</style>

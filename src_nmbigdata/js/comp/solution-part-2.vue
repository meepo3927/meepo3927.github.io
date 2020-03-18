<template>
<div class="solution-part solution-part-2">
    <div class="solution-head">
        <div class="solution-banner">
            <img :src="getSolutionImg(myItem)" />
            <h3 ><i class="fa" :class="[myItemIcon]"></i>{{myItemName}}</h3>
        </div>
        <div class="banner-desc">通过移动大数据进行银行客户画像补充，包括客户位置、交往圈、理财偏好等；辅助银行营业网点选址、营销活动选址、广告投放选址，分析客户的密集度、人群特征等；辅助征信、银行大客户竞争分析……</div>
    </div>

    <!-- 内容 -->
    <div class="solution-content-body">
        <!-- row -->
        <div class="content-row t-left">
            <div class="content-col">
                <h4><i class="fa fa-user"></i>金融客户画像</h4>
                <p>内蒙移动拥有客户身份特征、位置信息、交往圈、金融偏好等客户大数据资产，基于大数据高度融合，可清晰描绘出金融客户全息精准画像。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00201')" />
            </div>
        </div>
        <!-- row -->
        <div class="content-row t-right">
            <div class="content-col">
                <img :src="getSolutionArticleImg('00202')" />
            </div><!--
         --><div class="content-col">
                <h4><i class="fa fa-map-marker"></i>辅助选址</h4>
                <p>辅助金融机构进行网点选址、营销活动选址、广告选址等，提供区域内人流分时段热力图分布分析、月度客流密集度分析、历史客流变化趋势分析、客流时段分布分析、客流驻留时长、来源分析、互联网使用偏好分析等。</p>
            </div>
        </div>
        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-credit-card"></i>辅助征信</h4>
            <p>基于移动通讯数据，依据银行经验设计个人信用评分模型，直观体现个人信用风险。通讯数据能够及时、全面、准确的洞察个体的各类变化，而个人状态的变化是导致各类风险的重要原因。移动大数据征信除了对个人信用的总体评价之外，还可以建立分量指标，对个人身份特征、通信消费能力、信用历史、行为偏好、人脉关系等方面的特征加以评估。</p>
        </div>
        <!-- row -->
        <div class="content-row t-right">
            <div class="content-col">
                <img :src="getSolutionArticleImg('00204')" />
            </div><!--
         --><div class="content-col">
                <h4><i class="fa fa-bar-chart"></i>大客户竞争分析</h4>
                <p>通过银行大客户的活跃度变化及跨行的交互行为分析，并结合银行业务特征，分析预测客户迁转变化，辅助客户流失预警分析。支持从多个维度（分地域，分时间，分不同客户群体）分析客户与竞争银行的联系活跃度及变化趋势。</p>
            </div>
        </div>
        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-male"></i>金融产品潜在客户挖掘</h4>
            <p>借助成熟的数据算法以及应用经验构建模型，研究金融产品现有客户特征，并分析各项特征之间的关联程度大小，对特征进行量化，再按照现有客户特征关联度，对潜在客户进行挖掘，提升金融产品客户精准营销能力。</p>
        </div>
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[1];
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
.solution-part-2 {
    
}
</style>

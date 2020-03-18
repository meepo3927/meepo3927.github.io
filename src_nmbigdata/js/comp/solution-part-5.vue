<template>
<div class="solution-part solution-part-5">
    <div class="solution-head">
        <div class="solution-banner">
            <img :src="getSolutionImg(myItem)" />
            <h3 ><i class="fa" :class="[myItemIcon]"></i>{{myItemName}}</h3>
        </div>
        
    </div>

    <!-- 内容 -->
    <div class="solution-content-body">
        <!-- row -->
        <div class="content-row t-left">
            <div class="content-col">
                <h4><i class="fa fa-flag"></i>公共安全</h4>
                <p>根据维系的公共场所基站，获取基站下通信用户行为，及设定的公共场所人流密度的阀值预警线，判断公共场所的安全系数。结合GIS技术提供公共安全监控场所实时人流热力图，公共安全监控区域人流实时迁入迁出分级预警等。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00501')" />
            </div>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-university"></i>会议保障</h4>
            <p>各种国际型、全国型会议较多的人流同时涌入，会带来巨大的经济和社会效益，同时也对政府、会议主办方带来较大的管理难题。通过移动大数据事前分析参会人员来源情况，强化会议布置管理；事中实时监控分析客流来源、交通情况、以及各展馆的客流情况；事后分析客流参会后的旅游、离境行为。</p>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-comments"></i>舆情监控</h4>
            <p>通过整合移动用户上网行为数据、位置信令数据等，通过大数据平台文本挖掘技术进行互联网舆情监控，包括特定区域、特定人群舆情监控，可快速、准确、灵活的监测互联网上的舆论信息，为相关政府管理部门全面掌握互联网舆情动态，做出正确舆论引导，提供分析依据。</p>
        </div>
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[4];
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
.solution-part-5 {
    
}
</style>

<template>
<div class="solution-part solution-part-1">
    <div class="solution-head">
        <div class="solution-banner">
            <img :src="getSolutionImg(myItem)" />
            <h3 ><i class="fa" :class="[myItemIcon]"></i>{{myItemName}}</h3>
        </div>
        <div class="banner-desc">景区客流量实时监控、实时预警和游客行为及属性分析，为景区管理者提供大数据客流监控与分析；通过对景点客流量实时监控、实时预警和游客行为及属性分析，为旅游局提供大数据客流监控预警与分析。</div>
    </div>

    <!-- 内容 -->
    <div class="solution-content-body">
        <!-- row -->
        <div class="content-row t-left">
            <div class="content-col">
                <h4><i class="fa fa-bell"></i>景区实时人流监控预警</h4>
                <p>提供景区客流量实时监控与游客承载量超负荷预警，结合GIS地图进行人流热力图展示，通过实时客流分析和景区旅客迁入迁出时序分析，显性展示景区内游客进入景区密度最大时间段和人流迁出量最大的时间段。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00101')" />
            </div>
        </div>
        <!-- row -->
        <div class="content-row t-right">
            <div class="content-col">
                <img :src="getSolutionArticleImg('00102')" />
            </div><!--
         --><div class="content-col">
                <h4><i class="fa fa-area-chart"></i>景区客流特征分析</h4>
                <p>提供景区客流特征分析，包括客流来源分析、客流性别分析、客流年龄分析、时段分布分析、逗留时长分析、终端分析、客流消费分析等。</p>
            </div>
        </div>

        <!-- row -->
        <div class="content-row t-left">
            <div class="content-col">
                <h4><i class="fa fa-bell"></i>多景点实时人流监控预警</h4>
                <p>可同时提供对多景点游客承载量按不同预警级别进行实时告警，进行各景点流量排名分析和来源分析，多景点流量消费分析、年龄分析、游客迁入迁出时序分析等。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00103')" />
            </div>
        </div>

        <!-- row -->
        <div class="content-row t-right">
            <div class="content-col">
                <img :src="getSolutionArticleImg('00104')" />
            </div><!--
         --><div class="content-col">
                <h4><i class="fa fa-area-chart"></i>多景点客流特征分析</h4>
                <p>提供多景点客流逗留情况分析、性别分析、年龄分析、消费分析、来源分析、终端分析、单双周流量分析等。</p>
            </div>
        </div>
        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-money"></i>旅游经济收入核算</h4>
            <p>计算旅游相关酒店、餐饮、交通等产业直接收入，主要包括：旅游场所门票收入、旅客从其他省市来到本地的航空、铁路、汽车等交通收入、旅客入住酒店的收入、旅客吃饭的收入、旅客娱乐消费收入等。</p>
        </div>
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[0];
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
.solution-part-1 {
    
}
</style>

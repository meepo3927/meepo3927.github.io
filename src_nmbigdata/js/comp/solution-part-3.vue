<template>
<div class="solution-part solution-part-3">
    <div class="solution-head">
        <div class="solution-banner">
            <img :src="getSolutionImg(myItem)" />
            <h3 ><i class="fa" :class="[myItemIcon]"></i>{{myItemName}}</h3>
        </div>
        <div class="banner-desc">总体监控航空客流量及趋势，从总体市场上评估航空行业的 市场价值和潜力，辅助新开航线；根据节日前后峰值变化调 整节假日航空运力；根据日常出行到访的历史飞行规律，进行航线常态运力优化……</div>
    </div>

    <!-- 内容 -->
    <div class="solution-content-body">
        <!-- row -->
        <div class="content-row t-left">
            <div class="content-col">
                <h4><i class="fa fa-plane"></i>新开航线评估</h4>
                <p>根据移动客户迁移数据可了解区域内总体客流规模、各月变化趋势，以及航空客流量的规模和变化趋势，进而从总体市场上评估航空行业的市场价值和潜力，辅助新开航线。还能分析乘飞机、火车和其他交通工具的客流数据。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00301')" />
            </div>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-space-shuttle"></i>节日运力优化</h4>
            <p>航空公司受航线、仓位的影响，在运力饱和时无法获知出行客流极值，移动用户客流的极值数据变化参考价值较大。移动客户迁移数据囊括了汽车、火车和航空等所有交通方式的客户，而汽车、火车由于速度慢，所以出行较航空要有一定的提前量。通过移动客流数据按天统计迁移极值、增长趋势以及同比变化，将为节假日期间调整航线运力作参考。</p>
        </div>

        <!-- row -->
        <div class="content-row t-right">
            <div class="content-col">
                <img :src="getSolutionArticleImg('00303')" />
            </div><!--
         --><div class="content-col">
                <h4><i class="fa fa-paper-plane"></i>现有航线优化</h4>
                <p>根据历史数据分析客户飞行的地点和时间特征，优化航线规划，提升航线效益，包括客户飞行规律、汽车/火车等其他交通方式出行规律、中转路径及逗留时间。</p>
            </div>
        </div>

        <!-- row -->
        <div class="content-row t-left">
            <div class="content-col">
                <h4><i class="fa fa-users"></i>潜在航空客户挖掘</h4>
                <p>根据开通国际漫游、长途通话、历史飞行规律、手机上网搜索“机票、航班”等关键字信息、登陆过航旅纵横、航班管家APP等与乘飞机出行直接相关的通信特征挖掘目标客户，并可根据这些客户的数量来预测近期的航空流量。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00304')" />
            </div>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-mobile"></i>旅游APP客群特征分析</h4>
            <p>结合吃、住、行、玩、分享等需求，了解与旅游相关APP的客户规模，并进行一步分析各类旅游相关APP的客户特征，为航空公司精细化运营提供依据。</p>
        </div>
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[2];
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
.solution-part-3 {
    
}
</style>

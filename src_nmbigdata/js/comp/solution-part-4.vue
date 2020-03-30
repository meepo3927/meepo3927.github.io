<template>
<div class="solution-part solution-part-4">
    <div class="solution-head">
        <div class="solution-banner">
            <img :src="getSolutionImg(myItem)" />
            <h3 ><i class="fa" :class="[myItemIcon]"></i>{{myItemName}}</h3>
        </div>
        <div class="banner-desc">针对旅游景区、广场、会展中心、公园等指定区域内的人口分布，通过数据可视化展示，结合数据报表，反映人口的分布，实时监控人口密度，助力区域人口管理、公共安全监控、商业选址等。</div>
    </div>

    <!-- 内容 -->
    <div class="solution-content-body">
        <!-- row -->
        <div class="content-row t-left">
            <div class="content-col">
                <h4><i class="fa fa-car"></i>实时交通监控</h4>
                <p>现在的交通APP应用利用车辆雷达信息进行定位并计算交通压力，而更多人选择公共交通或步行前往，大数据利用每个人的手机定位数据实时监控交通热度，其实时性和准确性更为可靠。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00401')" />
            </div>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-bus"></i>公路车流归巢分析</h4>
            <p>基于信令数据，采集到每个车辆的行驶记录，建立分析模型识别出行特征和规律；实现对公路路网压力的精准预测，避免交通拥堵。支持选择特定日期和时间段，预测全路网拥堵情况，自动化告警，预测特定区域内下一天/周/月的拥堵风险。</p>
        </div>
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[3];
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
.solution-part-4 {
    
}
</style>

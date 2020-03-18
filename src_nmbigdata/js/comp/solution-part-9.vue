<template>
<div class="solution-part solution-part-9">
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
                <h4><i class="fa fa-television"></i>广告牌精准投放</h4>
                <p>与各广告牌资源厂商合作，分析广告牌资源覆盖范围内的人群特征，为广告客户广告内容的投放提供精确支持。通过信令大数据，了解不同路口和楼宇各时段人群的消费水平、人流量、身份、爱好等，分析覆盖较广的出租车顶灯、公交车车体等媒介，对外出的人群进行细分(身份、爱好、消费水平等）。</p>
            </div><!--
         --><div class="content-col">
                <img :src="getSolutionArticleImg('00901')" />
            </div>
        </div>
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[8];
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
.solution-part-9 {
    
}
</style>

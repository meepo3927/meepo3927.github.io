<template>
<div class="solution-part solution-part-7">
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
            <h4><i class="fa fa-search"></i>社保骗保行为识别</h4>
            <p>通过社保中心提供的参保人基本信息（手机号码、身份证、姓名），社保消费记录（如消费地点、消费金额、消费内容），以及相应手机号码在移动数据库中登记的基本信息（身份证、姓名），生活轨迹信息识别参保人与医疗社保消费人是否为同一人，并最终识别是否涉嫌恶意骗取医疗保险。</p>
        </div>

        <!-- row -->
        <div class="content-col single-col">
            <h4><i class="fa fa-vcard"></i>保险欺诈风险监控</h4>
            <p>通过运营商数据与保险公司数据的比对，能够大幅降低保险公司的运营风险，提高骗保行为的识别率，并有助于保险公司进行更科学的差异化费率的制定。</p>
            <p class="mt25">－ 通过锁定被保险人特定时间的位置信息，排除非被保险人出险而恶意骗保；</p>
            <p class="mt25">－ 通过对被保险人基础信息的多方比对，将信息虚假的被保险人列入重点风控对象；</p>
            <p class="mt25">－ 根据个人通信消费信用数据，进行差异化保险费率的制定；</p>
            <p class="mt25">－ 结合电信运营商黑名单数据，进行差异化保险费率的制定。</p>
        </div>

    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[6];
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
.solution-part-7 {
    
}
</style>

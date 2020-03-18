<template>
<div class="solution-part solution-part-10">
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
            <h4><i class="fa fa-medkit"></i>疫情防控</h4>
            <p>跟踪有传染风险的疾病患者行为轨迹，为相关区域疫情防控提供数据支持。患病人群到医院就医时，医院会登记手机号码、就诊科室等信息，移动大数据可以提供手机号码精准识别患病人群居住地、工作地、及其他生活轨迹数据，辅助卫生局做决策。</p>
        </div>

    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.myItem = function () {
    return this.solutions[9];
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
.solution-part-10 {
    
}
</style>

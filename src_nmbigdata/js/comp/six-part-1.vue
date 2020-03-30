<template>
<div class="six-part six-part-1 inner-main">
    <div class="six-part-banner">
        <img :src="getBannerImg(0)" />
        <h3 v-text="sixTitle[0]"></h3>
        <h4 v-text="sixSubTitle[0]"></h4>
    </div>

    <!-- section 1 -->
    <div class="main-section">
        <h3 class="six-section-h3">
            <i class="fa fa-desktop"></i> 人群密度监控
        </h3>

        <div class="six-intro-text" v-text="sixWholeDesc[0]"></div>

        <monitor-map />
    </div>

    <!-- section 2 -->
    <div class="main-section">
        <h3 class="six-section-h3">
            <i class="fa fa-mail-forward"></i> 人群迁徙分析
        </h3>

        <div class="six-intro-text">通过解析迁徙人群的来源地分布、目的地分布，以及人数、热度的变化以及逗留时长等，分析不同国际、省、市、区县、甚至是具体的商圈、景点等的人口流动情况，更加清晰地把握潜在商机。
        </div>

        <monitor-move-chart />
    </div>

    <!-- section 3 -->
    <div class="main-section">
        <h3 class="six-section-h3">
            <i class="fa fa-car"></i> 实时交通监控
        </h3>

        <div class="six-intro-text">现在的交通APP应用利用车辆雷达信息进行定位并计算交通压力，而更多人选择公共交通或步行前往，大数据利用每个人的手机定位数据实时监控交通热度，其实时性和准确性更为可靠。</div>

        <v-amap class="traffic-map" traffic="1" />
    </div>
</div>
</template>

<script>
let methods = {};
let computed = {};
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
        require('mixins/six_part.js')
    ],
    beforeDestroy,
    components: {
        'monitor-map': require('comp/monitor-map.vue'),
        'monitor-move-chart': require('comp/monitor-move-chart.vue')
    }
};
</script>

<style scoped lang="less">
.six-part-1 {
    
}
.traffic-map {
    height: 500px;
}
</style>

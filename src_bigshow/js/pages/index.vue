<template>
<div class="big-show">
    <vhead />
    <div class="top-bg-2"></div>
    <div class="v-logo">
        <img :src="logoSrc" alt="">
    </div>
    <vtime />
    <ranklist />
    <vglobe />
    <chartInOut />
    <!-- 实时客流量 -->
    <chartRealtimeUser />
    <!-- 驻留时长 -->
    <chartStayTime />
    <!-- 综合分析 散点图 -->
    <chartAllType1 />
    <chartAllType2 />
    <!-- 饼状图 -->
    <chartPie1 />
    <chartPie2 />
    <chartPie3 />
    <!-- 右边线 -->
    <r-line />
</div>
</template>

<script>
import 'root';
import vhead from 'comp/head.vue';
import vtime from 'comp/time.vue';
import ranklist from 'comp/rank-list.vue';
import vglobe from 'comp/globe.vue';
import chartInOut from 'comp/chart-in-out.vue';
import chartRealtimeUser from 'comp/chart-realtime-user.vue';
import chartStayTime from 'comp/chart-stay-time.vue';
import chartAllType1 from 'comp/chart-all-type-1.vue';
import chartAllType2 from 'comp/chart-all-type-2.vue';
import chartPie1 from 'comp/chart-pie-1.vue';
import chartPie2 from 'comp/chart-pie-2.vue';
import chartPie3 from 'comp/chart-pie-3.vue';
import rline from 'comp/rline.vue';

var methods = {};
var computed = {};
computed.logoSrc = function () {
    return './images/logo.png';
};
var watch = {};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
    var o = {};
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [],
    methods,
    computed,
    props: [],
    mounted,
    destroyed,
    components: {
        vhead, vtime,
        ranklist,
        vglobe,
        chartInOut,
        chartRealtimeUser,
        chartStayTime,
        chartAllType1,
        chartAllType2,
        chartPie1,
        chartPie2,
        chartPie3,
        rline
    }
};
</script>

<style scoped lang="less">
.v-logo img {
    height: 60px;
}
</style>
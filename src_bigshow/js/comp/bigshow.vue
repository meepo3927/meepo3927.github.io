<template>
<div class="big-show">
    <vhead />
    <div class="top-bg-2"></div>
    <vlogo />
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
import vlogo from './logo.vue';
import vhead from './head.vue';
import vtime from './time.vue';
import ranklist from './rank-list.vue';
import vglobe from './globe.vue';
import chartInOut from './chart-in-out.vue';
import chartRealtimeUser from './chart-realtime-user.vue';
import chartStayTime from './chart-stay-time.vue';
import chartAllType1 from './chart-all-type-1.vue';
import chartAllType2 from './chart-all-type-2.vue';
import chartPie1 from './chart-pie-1.vue';
import chartPie2 from './chart-pie-2.vue';
import chartPie3 from './chart-pie-3.vue';
import rline from './rline.vue';

var methods = {};
var computed = {};
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
        vlogo, vhead, vtime,
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
.big-show {
    
}
</style>
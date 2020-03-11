<template>
<div class="my-root">
    <!-- 四大 -->
    <four class="mt10"/>
    <!-- 汇总数据 and 热门营销活动 -->
    <div class="section-1 clearfix mt10">
        <div class="summary-section">
            <div class="section-head">
                <i class="fa fa-server"></i>
                <strong>总体情况</strong>
                <a href="javascript:;" @click="showSummaryCityChart">更多>></a>
            </div>
            <div class="section-body">
                <summary-datalist />
            </div>
        </div><!-- summary-section -->
        <div class="hot-act-section">
            <div class="section-head">
                <i class="fa fa-shirtsinbulk"></i>
                <strong>热门营销活动</strong>
                <a href="javascript:;" @click="showMoreActs">更多>></a>
            </div>
            <div class="section-body">
                <hot-act-list />
            </div>
        </div><!-- hot-act-section -->

        <div class="category-distribution-section">
            <div class="section-head">
                <i class="fa fa-area-chart"></i>
                <strong>活动类型分布</strong>
            </div>
            <div class="section-body">
                <category-distribution-chart />
            </div>
        </div>
    </div><!-- section-1 -->
    <!-- 触点活动分布 & 营销活动场景分布 & 我的IOP -->
    <div class="section-2 clearfix mt10 pb10">
        <div class="touch-distribution">
            <div class="section-head">
                <i class="fa fa-pie-chart"></i>
                <strong>触点活动占比</strong>
            </div>
            <div class="section-body">
                <touch-distribution-chart />
            </div>
        </div>
        <div class="scene-distribution">
            <div class="section-head">
                <i class="fa fa-bar-chart"></i>
                <strong>当月短信发送用户数（剔重）</strong>
            </div>
            <div class="section-body">
                <scene-distribution-chart />
            </div>
        </div>
        <div class="my-workbench-section">
            <div class="section-head">
                <i class="fa fa-cog"></i>
                <strong>我的IOP</strong>
            </div>
            <div class="section-body">
                <my-workbench />
            </div>
        </div>
    </div><!-- section-2 -->
    
</div>
</template>

<script>
import SummaryCityChart from 'comp/index/summary-city-chart.vue';
import HotActMore from 'comp/index/hot-act-more.vue';
const methods = {};
methods.showSummaryCityChart = function () {
    Vue.$newComponent(SummaryCityChart, {});
};
methods.showMoreActs = function () {
    Vue.$newComponent(HotActMore, {});
};
const computed = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {

        'four': require('comp/index/four.vue'),
        'summary-datalist': require('comp/index/summary-datalist.vue'),
        'hot-act-list': require('comp/index/hot-act-list.vue'),
        'category-distribution-chart': require('comp/index/category-distribution-chart.vue'),
        'touch-distribution-chart': require('comp/index/touch-distribution-chart.vue'),
        'scene-distribution-chart': require('comp/index/scene-distribution-chart.vue'),
        'my-workbench': require('comp/index/my-workbench.vue'),
        'calendar-popup': require('comp/calendar-popup.vue')
    }
};
</script>

<style scoped lang="less">
@section-height-1: 276px;
@section-height-2: 386px;
div.my-root {
    padding-top: 1px;
    padding-left: 10px;
    padding-right: 10px;
}
.public-notice {
    margin-left: -10px;
    margin-right: -10px;
}
.section-head {
    border-bottom: 1px solid #DCDCDC;
    height: 38px;
    line-height: 38px;
    padding-left: 18px;
    background-color: #fff;
    border-radius: 4px 4px 0 0;
    i.fa {
        color: #42A6DA;
        font-size: 24px;
        margin-right: 10px;
        vertical-align: -3px;
    }
    strong {
        color: #434343;
        font-size: 18px;
    }
    a {
        color: #369D9A;
        float: right;
        margin-top: 1px;
        margin-right: 15px;
        line-height: 36px;
        &:hover {
            color: darken(#369D9A, 20%);
        }
    }
}
.section-body {
    background-color: #fff;
    border-radius: 0 0 4px 4px;
}
.summary-section {
    float: left;
    width: 25%;
    padding-right: 5px;
    .section-body {
        height: @section-height-1;
    }
}
.hot-act-section {
    float: left;
    width: 50%;
    padding-left: 5px;
    padding-right: 5px;
    .section-body {
        height: @section-height-1;
        padding: 8px 8px 0 8px;
        overflow: hidden;
    }
}
.category-distribution-section {
    float: left;
    width: 25%;
    padding-left: 5px;
    .section-body {
        height: @section-height-1;
    }
}
.touch-distribution {
    float: left;
    width: 30%;
    padding-right: 5px;
    .section-body {
        height: @section-height-2;
    }
}
.scene-distribution {
    float: left;
    width: 45%;
    padding-left: 5px;
    padding-right: 5px;
    .section-body {
        height: @section-height-2;
    }
}
.my-workbench-section {
    float: right;
    width: 25%;
    padding-left: 5px;
    .section-body {
        height: @section-height-2;
    }
}
</style>

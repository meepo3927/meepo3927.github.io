<template>
<div class="touch-detail" v-if="TouchDetailData">
    <!-- 流量加 -->
    <div class="m-row-auto mb20" v-for="v in rows1">
        <div class="col-label"><label v-text="v.label + '：'"></label></div>
        <div class="col-content" v-text="v.content"></div>
    </div>

    <!-- 标题图片 -->
    <div class="m-row-auto mb20">
        <div class="col-label">标题图片：</div>
        <div v-if="my.bannerType == 1 || my.bannerType == 2" 
            class="col-content"
            v-text="getBanner()">
        </div>
        <detail-image v-if="my.bannerType == 3" :url="my.bannerSelfJpgPath" />
    </div>
    <!-- 活动内容 -->
    <div class="m-row-auto mb20">
        <div class="col-label">活动内容：</div>
        <div v-if="my.actContentStyle == 1" class="col-content"
            v-text="my.actContentChar"></div>
        <div v-if="my.actContentStyle == 2">
            <detail-image :url="my.actContentJpgPath" />
        </div>
    </div>
    <div class="m-row-auto mb20" v-if="my.actContentStyle == 2">
        <div class="col-label">活动跳转URL：</div>
        <div class="col-content" v-text="my.actContentJpgUrl"></div>
    </div>

    <!-- 内容2 -->
    <div class="m-row-auto mb20" v-for="v in rows2">
        <div class="col-label"><label v-text="v.label + '：'"></label></div>
        <div class="col-content" v-text="v.content"></div>
    </div>
    <!-- 业务推荐 -->
    <div class="m-row-auto mb20" >
        <div class="col-label">业务推荐：</div>
        <div class="col-content">
            <ul v-if="my.products && my.products.length">
                <li v-for="v in my.products">
                    <span>{{v.svcRecommendProdIntro}}</span>
                    <span>(产品编号:{{v.svcRecommendProdCode}})</span>
                </li>
            </ul>
            <span v-else>无</span>
        </div>
    </div>
</div>
</template>

<script>
const STYLE_OPTIONS = {
    '1': '模板1(红色背景)',
    '2': '模板2(黄色背景)',
    '3': '模板3(蓝色背景)',
    '4': '模板4(紫色背景)',
    '5': '模板5(绿色背景)',
    '6': '模板6(黑色背景)',
    '7': '模板7(白色背景)'
};
const BANNER_OPTIONS = {
    '2': '模板1（中国移动LOGO）',
    '3': '模板2（最新活动）',
    '4': '模板3（聚惠来袭）'
};
const BANNER_COLOR_OPTIONS = Tool.extend({
    '0': '风格根据页面自适应'
}, STYLE_OPTIONS);
const methods = {};
methods.getBanner = function () {
    const data = this.TouchDetailData || {};
    if (data.bannerType == 1) {
        return BANNER_OPTIONS[data.bannerTemplate];
    } else if (data.bannerType == 2) {
        const color = BANNER_COLOR_OPTIONS[data.bannerSelfCharColor];
        return data.bannerSelfChar + ' (' + color + ')';
    }
};
const computed = {};
computed.rows1 = function () {
    if (!this.TouchDetailData) {
        return [];
    }
    const data = this.TouchDetailData;
    const rows = this.$TouchDetailGetCommonRows().concat([
        {label: '页面标题', content: data.pageTitle},
        {label: '页面风格', content: STYLE_OPTIONS[data.backgroundColor]}
    ]);
    return rows;
};
computed.rows2 = function () {
    if (!this.TouchDetailData) {
        return [];
    }
    const data = this.TouchDetailData;
    const rows = [];
    if (data.actExpOption == 1) {
        rows.push({
            label: '活动说明标题',
            content: data.actExpTitle
        });
        rows.push({
            label: '活动说明内容',
            content: data.actExpContent
        });
    } else {
        rows.push({
            label: '活动说明', content: '不展示'
        });
    }

    return rows;
};
computed.my = function () {
    return this.TouchDetailData || {};
};
const created = function () {};
const mounted = function () {
    window.TouchDetail32 = this;
    this.$TouchDetailFetchData();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [require('mixins/touch_detail.js')],
    beforeDestroy,
    components: {
        'detail-image': require('./detail-image.vue')
    }
};
</script>

<style scoped lang="less">

</style>

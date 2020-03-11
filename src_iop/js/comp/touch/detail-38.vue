<template>
<div class="touch-detail" v-if="TouchDetailData">
    <!-- 和生活 -->
    <div class="m-row-auto mb20" v-for="v in rows1">
        <div class="col-label"><label v-text="v.label + '：'"></label></div>
        <div class="col-content" v-text="v.content"></div>
    </div>
    <!-- 广告图片 -->
    <div class="m-row-auto mb20">
        <div class="col-label">广告图片：</div>
        <div class="col-content">
            <detail-image :url="my.adDetailImgPath"/>
        </div>
    </div>
    <!-- row2 -->
    <div class="m-row-auto mb20" v-for="v in rows2">
        <div class="col-label"><label v-text="v.label + '：'"></label></div>
        <div class="col-content" v-text="v.content"></div>
    </div>
</div>
</template>

<script>
const methods = {};

const computed = {};
computed.rows1 = function () {
    if (!this.TouchDetailData) {
        return [];
    }
    const data = this.TouchDetailData;
    const rows = [
        {label: '营销活动描述', content: data.marketDesc}
    ].concat(this.$TouchDetailGetCommonRows());
    return rows;
};
computed.rows2 = function () {
    if (!this.TouchDetailData) {
        return [];
    }
    const data = this.TouchDetailData;
    const rows = [
        {label: '广告链接地址', content: data.adLinkUrl}
    ];
    return rows;
};

computed.my = function () {
    return this.TouchDetailData || {};
};
const created = function () {};
const mounted = function () {

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

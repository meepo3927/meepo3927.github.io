<template>
<div class="touch-detail" v-if="TouchDetailData">
    <!-- 随身厅-营销助手 -->
    <div class="m-row-auto mb20" v-for="v in rows1">
        <div class="col-label"><label v-text="v.label + '：'"></label></div>
        <div class="col-content" v-text="v.content"></div>
    </div>
</div>
</template>

<script>
const methods = {};
methods.getNeedAdvertisText = function (val) {
    const MAP = {
        0: '否',
        1: '是'
    };
    return MAP[val];
};
const computed = {};
computed.rows1 = function () {
    if (!this.TouchDetailData) {
        return [];
    }
    const data = this.TouchDetailData;
    const rows = [
        {label: '营销活动描述', content: data.marketDesc}
    ].concat(this.$TouchDetailGetCommonRows()).concat([
        {label: '营销用语', content: data.marketSentence},
        {label: '营销用语编码', content: data.marketCode},
        {
            label: '是否展示广告',
            content: this.getNeedAdvertisText(data.needAdvertis)
        },
        {label: '广告编码', content: data.advertiseID}
    ]);
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
    }
};
</script>

<style scoped lang="less">

</style>

<template>
<div class="touch-detail" v-if="TouchDetailData">
    <!-- 随身厅-营销外呼 -->
    <div class="m-row-auto mb20" v-for="v in rows1">
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
    ].concat(this.$TouchDetailGetCommonRows()).concat([
        {label: '展示图片URL', content: data.imageSrc},
        {label: '点击跳转URL', content: data.imageHref},
        {label: '运营位编码', content: data.positionid}
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

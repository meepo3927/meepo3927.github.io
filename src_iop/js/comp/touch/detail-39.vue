<template>
<div class="touch-detail" v-if="TouchDetailData">
    <!-- 10086官微 -->
    <div class="m-row-auto mb20" v-for="v in rows1">
        <div class="col-label"><label v-text="v.label + '：'"></label></div>
        <div class="col-content" v-text="v.content"></div>
    </div>
</div>
</template>

<script>
const methods = {};
methods.getHandleTypeText = function (val) {
    const MAP = {
        0: '是',
        1: '否',
        2: '非产品营销'
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
        {label: '办理方式', content: this.getHandleTypeText(data.handleType)},
        {label: '产品办理URL', content: data.productHandleUrl},
        {label: '产品图片URL', content: data.productPicUrl},
        {label: '产品标题', content: data.productTitle},
        {label: '产品描述', content: data.productDesc},
        {label: '产品跳转URL', content: data.productRedirectUrl},
        {label: '运营位编码', content: data.operateCode},
        {label: '渠道编码', content: data.channelCode}
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

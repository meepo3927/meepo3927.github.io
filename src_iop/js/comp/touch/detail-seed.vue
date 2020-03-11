<template>
<div class="touch-detail" v-if="TouchDetailData">
    <!-- 短信 -->
    <div class="m-row-auto mb20" v-for="v in dataRows">
        <div class="col-label">
            <label v-html="v.label + '：'"></label>
        </div>
        <div class="col-content" v-html="v.content"></div>
    </div>
</div>
</template>

<script>
const methods = {};
const computed = {};
computed.dataRows = function () {
    if (!this.TouchDetailData) {
        return [];
    }
    const data = this.TouchDetailData;
    const defaultRows = this.$TouchDetailGetCommonRows().concat([
        {label: 'xxx', content: data.kkk}
    ]);
    return defaultRows;
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
    components: {}
};
</script>

<style scoped lang="less">

</style>

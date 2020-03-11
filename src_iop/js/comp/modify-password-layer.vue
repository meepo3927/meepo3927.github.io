<template>
<center-layer height="400px" width="960" @close="onClose" :close="true">
    <div class="clayer-inner">
        <iframe :src="passwordUrl" frameborder="0" scrolling="no" class="size-100"></iframe>
    </div>
</center-layer>
</template>

<script>
const methods = {};
methods.onClose = function () {
    Vue.$disposeComponent(this);
};
const computed = {};
computed.passwordUrl = function () {
    return Config.vendorUrlPath + '/dist/marketing.html'
        + '?user_id=' + Config.user.id
        + '#/marketing_oa_account_info';
};
const created = function () {};
const mounted = function () {};
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
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">

</style>

<template>
<div>
    <div class="col-label"><label>活动优先级：</label></div>
    <div class="col-input" v-text="priority">
    </div>
</div>
</template>

<script>
import URL from 'util/url.js';
const methods = {};
methods.fetchRender = function () {
    const offerId = '300000171567'; // for-dev
    Request.fetch2('/dataplus/getOfferPriority', {offerId}).then((data) => {
        this.priority = data.priority;
    }).catch(() => {
        this.priority = '--';
    });
};
const computed = {};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        priority: undefined
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: ['value'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">

</style>

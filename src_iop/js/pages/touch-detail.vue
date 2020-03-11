<template>
<div class="touch-detail">
    <template v-if="myComp" >
        <div :is="myComp" @start-fetch="onStartFetch"
            @fetch-success="onFetchSuccess"
            @fetch-error="onFetchError"></div>
        <div class="loading-3" v-if="loading"></div>
    </template>
    <div class="alert alert-warning" v-if="dataError">没有获取到触点配置信息</div>
    <div class="alert alert-danger" v-if="myComp === null">无效的触点</div>
</div>
</template>

<script>
import 'common';
import URL from 'util/url.js';
const methods = {};
methods.onStartFetch = function () {
    this.loading = true;
};
methods.onFetchSuccess = function (data) {
    this.loading = false;
};
methods.onFetchError = function () {
    this.loading = false;
    this.dataError = true;
    this.myComp = undefined;
};
const computed = {};
computed.channelId = function () {
    return URL.query().channel_id;
};
const created = function () {};
const mounted = function () {
    window.VM = this;
    const compName = 'detail-' + this.channelId;
    if (this.$options.components[compName]) {
        this.myComp = compName;
    } else {
        this.myComp = null;
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        loading: false,
        dataError: false,
        myComp: undefined
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
        'detail-32': require('comp/touch/detail-32.vue'),
        'detail-33': require('comp/touch/detail-33.vue'),
        'detail-37': require('comp/touch/detail-37.vue'),
        'detail-38': require('comp/touch/detail-38.vue'),
        'detail-39': require('comp/touch/detail-39.vue'),
        'detail-40': require('comp/touch/detail-40.vue'),
        'detail-41': require('comp/touch/detail-41.vue'),
        'detail-42': require('comp/touch/detail-42.vue'),
        'detail-45': require('comp/touch/detail-45.vue'),
        'detail-46': require('comp/touch/detail-48.vue'),  // 实时在线
        'detail-48': require('comp/touch/detail-48.vue')
    }
};
</script>

<style scoped lang="less">
.touch-detail {
    padding: 14px 0 0 15px;
}
</style>

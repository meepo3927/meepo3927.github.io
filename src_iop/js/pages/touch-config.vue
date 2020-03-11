<template>
<div class="touch-config">
    <form v-model="form" v-if="formComp"
        :is="formComp" 
        :channel-id="channelId"></form>
    <div class="alert alert-warning" v-if="!formComp">渠道不存在</div>
</div>
</template>

<script>
import $ from 'jquery';
import mlayer from 'mlayer';
import store from 'store/touch_config.js';
import URL from 'util/url.js';
const CHANNEL_ID = URL.query().channel_id;
const methods = {};
const computed = {};
computed.formComp = function () {
    const compName = 'touch-' + CHANNEL_ID;
    if (this.$options.components[compName]) {
        return compName;
    } else {
        return null;
    }
};
computed.channelId = function () {
    return CHANNEL_ID;
};
const watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        form: null
    };
    return o;
};
export default {
    data: dataFunc,
    store,
    watch,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [
        require('mixins/touch_config.js')
    ],
    beforeDestroy,
    components: {
        'touch-32': require('comp/touch/config-32.vue'), // 流量加
        'touch-33': require('comp/touch/config-33.vue'), // IVR
        'touch-34': require('comp/touch/config-0.vue'),  // 事件短信 ==> 短信
        'touch-37': require('comp/touch/config-37.vue'), // 10086弹窗
        'touch-38': require('comp/touch/config-38.vue'), // 和生活
        'touch-39': require('comp/touch/config-39.vue'), // 官微
        'touch-40': require('comp/touch/config-40.vue'), // 随身厅-营销助手
        'touch-41': require('comp/touch/config-41.vue'), // 随身厅-营销外呼
        'touch-42': require('comp/touch/config-42.vue'), // 随身厅-摆摊助手
        'touch-45': require('comp/touch/config-45.vue'), // 在线外呼
        'touch-46': require('comp/touch/config-48.vue'), // 实时在线
        'touch-47': require('comp/touch/config-48.vue'), // 实时在线
        'touch-48': require('comp/touch/config-48.vue')  // 实时在线
    }
};
</script>

<style scoped lang="less">
.touch-config {
    padding: 20px 0;
}
</style>
<style lang="less">
.body-touch-config {
    background-color: #fff;
}
</style>
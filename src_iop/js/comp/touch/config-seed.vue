<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 0000 -->
    <fieldset v-if="value">
        <!-- 营销活动描述 -->
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
        <!-- 特殊号码过滤 -->
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <!-- 营销用语 -->
        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence"
            :channel-id="channelId"/>
        <!-- 活动优先级 -->
        <touch-act-priority v-model="value.actPriority" class="m-row-mid-auto mt20"/>
    </fieldset>
    <!-- 保存按钮 -->
    <div class="btn-box">
        <button class="btn btn-primary" type="button" @click="save" :disabled="$TouchConfigSaveBtnDisabled"
            v-text="$TouchConfigSaveBtnText"></button>
    </div>
</form>
</template>

<script>
const methods = {};
methods.save = function () {
    this.$TouchConfigSave();
};
methods.getDefaults = function () {
    return {
    }
};
const computed = {};
const created = function () {};
const mounted = function () {
    // this.$TouchConfigInit();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    mounted,
    mixins: [
        require('mixins/touch_config.js'),
        require('mixins/touch_config_props.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">

</style>

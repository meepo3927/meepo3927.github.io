<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- IVR -->
    <fieldset v-if="value">
        <!-- 营销活动描述 -->
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <!-- 开始结束日期 -->
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
        <!-- 特殊号码过滤 -->
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">语料ID：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" required
                    :placeholder="corpusPlaceholder"
                    v-model.trim="value.corpusId" />
            </div>
        </div>
        <touch-act-priority class="m-row-mid-auto mt20"/>
        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence"
            placeholder="请输入营销用语，为IVR挂机短信语"
            :channel-id="channelId" />
    </fieldset>
    <!-- 保存按钮 -->
    <div class="btn-box">
        <button class="btn btn-primary" type="button" @click="save" 
            :disabled="$TouchConfigSaveBtnDisabled"
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
        corpusId: ''                   // 语料ID
    };
};
const computed = {};
computed.corpusPlaceholder = function () {
    return this.$TouchConfigInputTipMiao + '配置语料ID'
};
const created = function () {};
const mounted = function () {
    this.$TouchConfigInit();
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
    props: [],
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

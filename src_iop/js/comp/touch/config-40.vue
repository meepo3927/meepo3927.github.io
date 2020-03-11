<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 随身厅-营销助手 -->
    <fieldset v-if="value">
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <!-- 营销用语 -->
        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence"/>
        <form-frequency class="mt20" v-model="isCycleUpdate" />
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >营销用语编码：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1"
                    v-model.trim="value.marketCode"
                    placeholder="下发短信模板编码，需提前沟通随身厅，可为空" />
            </div>
        </div>
        <touch-act-priority class="m-row-mid-auto mt20"/>

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >是否显示广告：</label></div>
            <div class="col-input">
                <select class="form-control" v-model="value.needAdvertis">
                    <option value="1">是</option>
                    <option value="0">否</option>
                </select>
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >广告编码：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    v-model.trim="value.advertiseID"
                    placeholder="广告模板编码，需提前沟通随身厅，可为空" />
            </div>
        </div>
    </fieldset>
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
        marketCode: '',             // 营销用语编码
        needAdvertis: '1',          // 是否展示广告
        advertiseID: ''             // 广告编码
    };
};
const computed = {};
const created = function () {
    window.TouchConfig40 = this;
};
const mounted = function () {
    this.$TouchConfigInit();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        isCycleUpdate: false
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
    components: {
        'form-frequency': require('comp/touch/form-frequency.vue')
    }
};
</script>

<style scoped lang="less">

</style>

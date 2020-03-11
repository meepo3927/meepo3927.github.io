<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- PCC签约 -->
    <fieldset v-if="value">
        <div class="m-row-mid-auto">
            <div class="col-label"><label class="with-red-star">操作类型：</label></div>
            <div class="col-input">
                <label class="radio-inline">
                    <input type="radio" value="1" v-model="optype"/> 签约
                </label>
                <label class="radio-inline ml20">
                    <input type="radio" value="0" v-model="optype"/> 取消签约
                </label>
            </div>
        </div>
        <touch-market-desc class="m-row-mid-auto mt20" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" />
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
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
methods.getChannelId = function () {
    return (this.optype === "1") ? "12" : "13";
};
const computed = {};

const created = function () {};
const mounted = function () {
    this.$TouchConfigInit();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        optype: "1"
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
    }
};
</script>

<style scoped lang="less">

</style>

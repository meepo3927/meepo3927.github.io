<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 短厅 -->
    <fieldset v-if="value">
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label>导入短厅活动类型：</label></div>
            <div class="col-input">
                <select class="form-control input-width-1" v-model="actTypeValue">
                    <option v-for="v in actTypeOptions" :value="v.val" v-text="v.text"></option>
                </select>
            </div>
        </div>

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">导入短厅活动名称：</label></div>
            <div class="col-input">
                <select class="form-control input-width-1" required
                    v-model="value.marketSentence">
                    <option v-for="v in actInfoOptions" :value="v.val" v-text="v.text"></option>
                </select>
            </div>
        </div>

        <touch-market-desc class="m-row-mid-auto mt20" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
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
        listFilter: ''
    };
};
const computed = {};
const watch = {};
watch.actTypeValue = function (val) {
    if (!val) {
        return;
    }
    this.actInfoOptions = [];
    if (this.value) {
        this.value.marketSentence = '';
    }
    const p = {
        code: val
    };
    Request.fetch2('/dataplus/smsActivityInfo', p).then((data) => {
        this.actInfoOptions = data;
        if (data[0]) {
            this.value.marketSentence = data[0].val;
        }
    });
};
const created = function () {};
const mounted = function () {
    this.$TouchConfigInit();
    Request.fetch2('/dataplus/smsActivityType').then((data) => {
        this.actTypeOptions = data;
        if (data[0]) {
            this.actTypeValue = data[0].val;
        }
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        actTypeOptions: [],
        actInfoOptions: [],
        actTypeValue: undefined
    };
    return o;
};
export default {
    data: dataFunc,
    watch,
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

<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 营业前台周常客 -->
    <fieldset v-if="value" >
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">营销优先级：</label></div>
            <div class="col-input">
                <select class="form-control input-width-1" v-model="value.priority">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>
        </div>
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
methods.getDefaults = function () {
    return {
        priority: 1
    }
};
const computed = {};

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
    components: {
    }
};
</script>

<style scoped lang="less">

</style>

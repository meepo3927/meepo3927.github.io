<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 随身厅-营销外呼 -->
    <fieldset v-if="value" >
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value"
            :prevtime="prevtime" />
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence" />
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >展示图片URL：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    v-model.trim="value.imageSrc"
                    placeholder="图片存储地址，需提前沟通随身厅，可为空" />
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >点击跳转URL：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    v-model.trim="value.imageHref"
                    placeholder="点击图片跳转地址，需提前沟通随身厅，可为空" />
            </div>
        </div>
        <touch-act-priority class="m-row-mid-auto mt20" />
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >运营位编码：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    v-model.trim="value.positionid" 
                    placeholder="运营位编码，需提前沟通随身厅，可为空" />
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
        imageSrc: '',                   // 展示URL
        imageHref: '',                  // 点击URL
        positionid: ''                  // 运营位编码
    };
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
    components: {}
};
</script>

<style scoped lang="less">

</style>

<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 和生活 -->
    <fieldset v-if="value">
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <touch-product-show class="m-row-auto mt20" />
        <form-frequency class="mt20" v-model="isCycleUpdate" />

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">广告图片上传：</label></div>
            <div class="col-input" :mui-value="value.adDetailImgURL" required
                required-errmsg="请上传图片">
                <fileup :action="$TouchConfigFileUpAction" filetype="image" 
                    :value="value.adDetailImgPath"
                    @input="onADImageInput">
                    <input type="hidden" name="mpId" :value="$TouchConfigMpId" />
                </fileup>
            </div>
            <div class="pl10 text-muted">上传图片长宽比例建议不超过750*375</div>
        </div>

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">广告链接地址：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    placeholder="图片点击跳转地址，如：http://www.10086.cn" 
                    v-model.trim="value.adLinkUrl" />
            </div>
        </div>
        <!-- 暂时屏蔽
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">广告位ID：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" required 
                    v-model.trim="value.adID" />
            </div>
        </div>
        -->
        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence"
            placeholder="请输入营销用语，为和生活营销位营销内容" />
        <touch-act-priority class="m-row-mid-auto mt20"/>
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

        adLinkUrl: '',              // 广告链接地址
        adID: '',                   // 广告位ID

        adDetailImgPath: '',        // 图片预览URL
        adDetailImgURL: ''          // 图片物理存储路径
    };
};
methods.onADImageInput = function (o) {
    mlayer.msg('上传成功');
    if (o) {
        this.value.adDetailImgPath = o.path;
        this.value.adDetailImgURL = o.file;
    }
};
const computed = {};
const created = function () {
    window.TouchConfig38 = this;
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

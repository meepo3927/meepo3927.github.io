<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- Toolbar -->
    <fieldset v-if="value">
        <touch-start-end-date class="m-row-mid-auto" v-model="value" :prevtime="prevtime" />
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">显示文字：</label></div>
            <div class="col-input">
                <input class="form-control input-width-1" required
                    v-model.trim="value.contents" 
                    placeholder="请输入显示文字" />
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">上传图片：</label></div>
            <div class="col-input" :mui-value="value.imagePath" required 
                required-errmsg="请上传图片">
                <fileup :action="$TouchConfigFileUpAction" filetype="image" 
                    :value="value.imageUrl"
                    @input="onImageUploadSuccess">
                    <input type="hidden" name="mpId" :value="$TouchConfigMpId" />
                </fileup>
            </div>
            <div class="pl10">
                <span class="text-muted">图片文件必须小于100Kb，建议尺寸320*420</span>
            </div>
        </div>

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">URL地址：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" required 
                    v-model.trim="value.clkLinkURL" />
            </div>
        </div>
        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence" />
        <touch-channel-desc class="m-row-auto mt20" v-model="value.marketDesc" />
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
        contents: '',
        // 图片路径和地址
        imagePath:'',
        imageUrl: '',
        clkLinkURL: '',
        listFilter: true,
        marketDesc: '',
        marketSentence: ''
    };
};
methods.onImageUploadSuccess = function (data) {
    mlayer.msg('上传成功');
    // data.file, data.path, data.size
    this.value.imagePath = data.file;
    this.value.imageUrl = data.path;
};
const computed = {};
const created = function () {};
const mounted = function () {
    this.$TouchConfigInit();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
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
.preview-img {
    max-width: 420px;
    max-height: 320px;
}
</style>

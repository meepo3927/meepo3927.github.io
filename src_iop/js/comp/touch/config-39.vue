<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 官微 -->
    <fieldset v-if="value" >
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <touch-product-show class="m-row-auto mt20" />

        <div class="m-row-mid-auto mt20">
            <div class="col-label with-red-star"><label>办理方式：</label></div>
            <div class="col-input">
                <label class="radio-inline">
                    <input type="radio" value="0" v-model="value.handleType" 
                        name="handleType"/> 是
                </label>

                <label class="radio-inline">
                    <input type="radio" value="1" v-model="value.handleType" 
                        name="handleType"/> 否
                </label>

                <label class="radio-inline">
                    <input type="radio" value="2" v-model="value.handleType" 
                        name="handleType"/> 非产品营销
                </label>
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >产品办理URL：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    :disabled="!isYingXiao"
                    :placeholder="handleUrlPlaceholder"
                    v-model.trim="value.productHandleUrl"
                    title="办理方式选择[非产品营销]时不需要填写" />
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >产品图片URL：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1"
                    :placeholder="picUrlPlaceholder"
                    v-model.trim="value.productPicUrl" />
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >产品标题：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    :placeholder="proTitlePlaceholder"
                    v-model.trim="value.productTitle"/>
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >产品描述：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1"
                    :placeholder="proTitlePlaceholder"
                    v-model.trim="value.productDesc" />
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >产品跳转URL：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1"
                    :placeholder="redirectUrlPlaceholder"
                    v-model.trim="value.productRedirectUrl" />
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >运营位编码：</label></div>
            <div class="col-input">
                <select class="form-control operate-sel" v-model="value.operateCode">
                    <option v-for="v in operationCodes" v-text="v.text" :value="v.value"></option>
                </select>
            </div>
            <div class="pl10 text-muted" v-text="selectTip"></div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label>渠道编码：</label></div>
            <div class="col-input">
                <select class="form-control channel-sel" v-model="value.channelCode">
                    <option v-for="v in channelCodes" v-text="v.text" :value="v.value"></option>
                </select>
            </div>
            <div class="pl10 text-muted" v-text="selectTip"></div>
        </div>

        <!-- 活动优先级 -->
        <touch-act-priority class="m-row-mid-auto mt20"/>
        <!-- 营销用语 -->
        <touch-market-sentence v-model="value.marketSentence" class="m-row-auto mt20" />
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
        handleType: '2',                // 办理方式
        productHandleUrl: '',           // 产品办理URL
        productPicUrl: '',              // 产品图片URL
        productTitle: '',               // 产品标题
        productDesc: '',                // 产品描述
        productRedirectUrl: '',         // 产品跳转URL
        operateCode: null,              // 运营位编码
        channelCode: null,              // 渠道编码
        smsTemplate: ''                 // 短信模板 (暂时屏蔽)
    };
};
methods.$TouchConfigRestoreExtend = function(data) {
    if (data.operateCode) {
        this._restore_operateCode = data.operateCode;
    }
    if (data.channelCode) {
        this._restore_channelCode = data.channelCode;
    }
};
const computed = {};
computed.isYingXiao = function () {
    if (!this.value) {
        return false;
    }
    return (this.value.handleType !== '2');
};
computed.handleUrlPlaceholder = function () {
    return this.$TouchConfigInputTipMiao + '配置产品办理URL'
};
computed.picUrlPlaceholder = function () {
    return this.$TouchConfigInputTipMiao + '配置产品图片URL'
};
computed.proTitlePlaceholder = function () {
    return '不完整破折号【—】、大于等于号【≥】和小于等于号【≤】将被剔除';
};
computed.redirectUrlPlaceholder = function () {
    return this.$TouchConfigInputTipMiao + '配置互联网产品跳转URL'
};
computed.selectTip = function () {
    return '默认选择，详情可咨询在线公司苗凯芳（13674830496）'
};
const watch = {};
watch.isYingXiao = function (b) {
    if (!b) {
        this.value.productHandleUrl = '';
    }
};
const created = function () {};
const mounted = function () {
    this.$TouchConfigInit();
    Request.fetch2('/officialWechat/oprationOffset').then((data) => {
        this.operationCodes = data.map((item) => {
            return {
                text: item.name,
                value: item.code
            }
        });
        if (this._restore_operateCode) {
            this.value.operateCode = this._restore_operateCode;
        } else if (this.data[0]) {
            this.value.operateCode = data[0].code;
        }
    });
    Request.fetch2('/officialWechat/channelCode').then((data) => {
        this.channelCodes = data.map((item) => {
            return {
                text: item.name,
                value: item.code
            }
        });
        if (this._restore_channelCode) {
            this.value.channelCode = this._restore_channelCode;
        } else if (data[0]) {
            this.value.channelCode = data[0].code;
        }
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        operationCodes: [],
        channelCodes: []
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    watch,
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
.operate-sel,
.channel-sel {
    width: 280px;
}
</style>

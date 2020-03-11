<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 10086弹窗 -->
    <fieldset v-if="value">
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <!-- 短信模板暂时屏蔽 
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label >短信模板：</label></div>
            <div class="col-input">
                 <select class="form-control sms-sel" required>
                     <option v-for="v in smsOptions" v-text="v.text" :value="v.value"></option>
                 </select>
             </div>
             <div class="pl10" v-text="smsContent"></div>
        </div>
        -->

        <touch-act-priority class="m-row-mid-auto mt20"/>
        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence"
            placeholder="请输入营销用语，为10086呼入弹窗营销话术"
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
        smsId: '101'
    };
};
// 暂时屏蔽
methods.fetchSMSOptions = function () {
    Request.fetch2('/callin/sms').then((data) => {
        this.smsOptions = data.map((o) => {
            return {
                text: o.smsID,
                value: o.smsID,
                content: o.content
            }
        });
        this.value.smsId = data[0].smsID;
    });
};
const computed = {};
computed.smsContent = function () {
    if (!this.value || !this.value.smsId) {
        return '';
    }
    let options = this.smsOptions;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === this.value.smsId) {
            return options[i].content;
        }
    }
};
const created = function () {};
const mounted = function () {
    this.$TouchConfigInit();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        smsOptions: []
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
.sms-sel {
    width: 250px;
}
</style>

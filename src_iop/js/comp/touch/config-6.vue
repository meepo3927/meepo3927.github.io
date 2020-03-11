<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 营业前台 -->
    <fieldset v-if="value">
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value"
            :prevtime="prevtime" />
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <!-- 营销用语 -->
        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence" 
            :channel-id="channelId"/>
        <div class="m-row-auto mt10">
            <div class="col-label">&nbsp;</div>
            <div class="col-input alert alert-info">
                <h5>温馨提示</h5>
                <p>营业前台的营销语支持向<em>【自营】</em>和<em>【社会】</em>渠道，分别推送不同的营销语，如果同一个营销活动，需针对<em>【自营】</em>和<em>【社会】</em>渠道分别使用不同的营销语，营销语之间请使用“<em>@@@@@</em>”五个“<em>@</em>”符号进行分隔（即分隔符前为自营厅展示营销语，分隔符后为社会厅展示营销语）</p>
            </div>
        </div>
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
.alert-info h5 {
    margin-top: 0;
    font-size: 16px;
    font-weight: bold;
    
}
.alert-info em {
    font-style: normal;
    // color: #f00;
    color: #00f;
}
</style>

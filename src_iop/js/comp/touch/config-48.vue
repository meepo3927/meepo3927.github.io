<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 实时在线 -->
    <fieldset v-if="value">
        <!-- 营销活动描述 -->
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <!-- 营销触点 -->
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label class="with-red-star">营销触点：</label></div>
            <div class="col-input">
                <span v-text="channelTitle"></span>
                <!--
                <select class="form-control channel-sel" required v-model="myChannelId">
                    <option v-for="v in channelList" :value="v.value" v-text="v.text"></option>
                </select>
                -->
            </div>
        </div>
        <!-- 生效日期 -->
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
        <!-- 特殊号码过滤 -->
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />
        <!-- 运营位编码 -->
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label>运营位编码：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    v-model="value.marketCode"
                    placeholder="请提前联系在线公司杨国栋，获取运营位编码" />
            </div>
        </div>
        <!-- 是否瞬时营销 -->
        <div class="m-row-mid-auto mt20" v-if="isPopWindow">
            <div class="col-label"><label>是否瞬时营销：</label></div>
            <div class="col-input">
                <input type="checkbox" v-model="isInsmp" />
            </div>
            <div class="check-tip-1">目前开展的是超套瞬时运营场景，实现形式为IVR自动外呼。若有其它场景需求，请提前与区公司市场部联系。</div>
        </div>

        <form-frequency class="mt20" v-if="!isPopWindow" 
            v-model="isCycleUpdate" />
        <!-- 属性配置区 -->
        <div class="m-row-auto mt20">
            <div class="col-label"><label class="property-label">属性配置：</label></div>
            <property-list-setting class="col-input" v-model="propertyList" />
        </div>
        <!-- 活动优先级 -->
        <touch-act-priority v-model="value.actPriority" class="m-row-mid-auto mt20"/>
        <!-- 推荐商品名称 -->
        <touch-product-show class="m-row-auto mt20" />

        <touch-market-sentence class="m-row-auto mt20" v-model="value.marketSentence"
            :channel-id="channelId"
            optional="1"   label="营销话术"
            placeholder="实时在线-弹窗专用" />

        <touch-market-sentence class="m-row-auto mt20" v-model="value.shortMessage"
            :channel-id="channelId"
            optional="1"   label="营销短信"
            placeholder="实时在线-IVR专用" />
        
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
        marketCode: '',                 // 运营位编码
        shortMessage: ''                // 营销短信
    }
};

methods.$TouchConfigGetSaveParamExtend = function () {
    const shortMessage = this.$TouchConfigFixMarketSentence(
        this.value.shortMessage
    );
    const p = {
        propertyList: this.propertyList,
        shortMessage
    };
    if (this.isPopWindow) {
        p.isInsmp = this.isInsmp ? '1' : '0';
    }
    return p;
};
methods.$TouchConfigRestoreExtend = function (data) {
    // 回填属性列表
    if (data.propertyList) {
        this.propertyList = data.propertyList;
    }
    if (this.isPopWindow) {
        this.isInsmp = (data.isInsmp == '1');
    }
};
const computed = {};
computed.channelTitle = function () {
    for (let i = 0; i < this.channelList.length; i++) {
        if (this.channelList[i].value === this.channelId) {
            return this.channelList[i].text;
        }
    }
};
computed.isPopWindow = function () {
    return this.channelId === '47';
};
const created = function () {
    window.TouchConfig48 = this;
};
const mounted = function () {
    this.channelListPromise = Request.getStaticInfo('TouchPoint').then((data) => {
        this.channelList = data.map(v => ({
            value: v.hashKey,
            text: v.hashValue
        }));
        return this.channelList;
    });
    this.$TouchConfigInit();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        isInsmp: false,
        isCycleUpdate: false,
        channelList: [],
        propertyList: null
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    mounted,
    mixins: [
        require('mixins/touch_config.js'),
        require('mixins/touch_config_props.js')
    ],
    beforeDestroy,
    components: {
        'property-list-setting': require('comp/touch/form-property-list-setting.vue'),
        'form-frequency': require('comp/touch/form-frequency.vue')
    }
};
</script>

<style scoped lang="less">
.channel-sel {
    width: 180px;
}
.property-label {
    line-height: 30px;
}
.check-tip-1 {
    padding-left: 10px;
    color: #999;
    line-height: 21px;
}
</style>

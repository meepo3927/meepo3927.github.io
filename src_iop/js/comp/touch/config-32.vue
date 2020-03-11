<template>
<form class="comp-touch-config" @submit.prevent>
    <!-- 流量加 微厅 -->
    <fieldset v-if="value">
        <!-- 营销活动描述 -->
        <touch-market-desc class="m-row-mid-auto" v-model="value.marketDesc" />
        <!-- 开始结束日期 -->
        <touch-start-end-date class="m-row-mid-auto mt20" v-model="value" 
            :prevtime="prevtime" />
        <!-- 特殊号码过滤 -->
        <touch-special-filter class="m-row-mid-auto mt20" v-model="value.listFilter" />

        <div class="m-row-mid-auto mt20">
            <div class="col-label with-red-star"><label>页面标题：</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" name="title"
                    placeholder="请输入页面标题" required
                    v-model.trim="value.pageTitle" />
            </div>
        </div>

        <div class="m-row-mid-auto mt20">
            <div class="col-label with-red-star"><label>页面风格：</label></div>
            <div class="col-input">
                <select class="form-control" v-model="value.backgroundColor">
                    <option v-for="v in styleOptions" v-text="v.text" :value="v.value"></option>
                </select>
            </div>
        </div>

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label>标题图片：</label></div>
            <div class="col-input pr30">
                <div class="btn-group">
                    <button class="btn btn-default" type="button"
                        :class="{active: value.bannerType == 1}" 
                        @click="onBannerBtnClick(1)">选择模板</button>
                    <button class="btn btn-default" type="button"
                        :class="{active: value.bannerType == 2}"
                        @click="onBannerBtnClick(2)">自定义文字</button>
                    <button class="btn btn-default" type="button"
                        :class="{active: value.bannerType == 3}"
                        @click="onBannerBtnClick(3)">自定义图片</button>
                </div>
            </div>
            <div v-if="value.bannerType == 1">
                <!-- 标题图片 - 选择模板 -->
                <select class="form-control" v-model="value.bannerTemplate">
                    <option v-for="v in bannerOptions" v-text="v.text" :value="v.value"></option>
                </select>
            </div>
            <div v-if="value.bannerType == 2">
                <!-- 标题图片 - 自定义文字 -->
                <input type="text" class="form-control" placeholder="标题文字" 
                    v-model.trim="value.bannerSelfChar" />
            </div>
            <div v-if="value.bannerType == 2" class="pl15">
                <!-- 标题图片 - 自定义文字 -->
                <select class="form-control" v-model="value.bannerSelfCharColor">
                    <option v-for="v in bannerColorOptions" v-text="v.text" :value="v.value"></option>
                </select>
            </div>
            <div v-if="value.bannerType == 3">
                <!-- 标题图片 - 自定义图片 -->
                <fileup :action="$TouchConfigFileUpAction" filetype="image" 
                    :value="value.bannerSelfJpgPath"
                    @input="onBannerImageInput">
                    <input type="hidden" name="mpId" :value="$TouchConfigMpId" />
                </fileup>
            </div>
        </div>

        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label>活动内容：</label></div>
            <div class="col-input">
                <div class="btn-group">
                    <button class="btn btn-default" type="button"
                        :class="{active: value.actContentStyle == 1}" 
                        @click="onContentStyleClick(1)">文字</button>
                    <button class="btn btn-default" type="button"
                        :class="{active: value.actContentStyle == 2}"
                        @click="onContentStyleClick(2)">图片</button>
                </div>
            </div>
        </div>
        <div class="m-row-mid-auto mt10">
            <div class="col-label"><label>&nbsp;</label></div>
            <!-- 活动内容 文字 -->
            <div class="col-input" v-if="value.actContentStyle == 1">
                <textarea class="form-control input-width-1" 
                    v-model.trim="value.actContentChar"
                    placeholder="请输入活动内容文字"></textarea>
            </div>
            <!-- 活动内容 图片 -->
            <div class="col-input" v-if="value.actContentStyle == 2">
                <fileup :action="$TouchConfigFileUpAction" filetype="image" 
                    :value="value.actContentJpgPath"
                    @input="onContentImageInput">
                    <input type="hidden" name="mpId" :value="$TouchConfigMpId" />
                </fileup>
            </div>
            <div class="pl15" v-if="value.actContentStyle == 2">
                <input type="text" class="form-control" placeholder="跳转URL" 
                    v-model.trim="value.actContentJpgUrl" />
            </div>
        </div>
        <div class="m-row-mid-auto mt20">
            <div class="col-label"><label>活动说明：</label></div>
            <div class="col-input">
                <div class="btn-group">
                    <button class="btn btn-default" type="button"
                        :class="{active: value.actExpOption == '0'}" 
                        @click="onActExpClick(0)">不展示</button>
                    <button class="btn btn-default" type="button"
                        :class="{active: value.actExpOption == 1}"
                        @click="onActExpClick(1)">展示</button>
                </div>
            </div>
        </div>
        <div class="m-row-auto mt10" v-if="value.actExpOption == 1">
            <!-- 活动说明 -->
            <div class="col-label"><label>&nbsp;</label></div>
            <div class="col-input">
                <input type="text" class="form-control input-width-1" 
                    v-model.trim="value.actExpTitle"
                    placeholder="请输入活动说明标题" />
                <textarea class="form-control input-width-1 mt10" 
                    v-model.trim="value.actExpContent"
                    placeholder="请输入活动说明内容"></textarea>
            </div>
        </div>
        <div class="m-row-auto mt20">
            <div class="col-label recommend-label"><label>业务推荐：</label></div>
            <div class="col-input">
                <product-recommend :channel-id="channelId" v-model="products"
                    :mp-id="$TouchConfigMpId" />
            </div>
        </div>

    </fieldset>
    <!-- 保存按钮 -->
    <div class="btn-box">
        <button class="btn btn-primary" type="button" @click="save" 
            :disabled="$TouchConfigSaveBtnDisabled"
            v-text="$TouchConfigSaveBtnText"></button>
    </div>
    <!-- 预览 -->
    <div class="dataplus-preview-wrapper" :class="previewClass">
        <dataplus-preview class="the-preview" :data="previewData" />
        <a href="javascript:;" class="hide-preview-btn" @click.stop="hidePreview"
            title="隐藏预览">
            <i class="fa fa-times-circle"></i>
        </a>
    </div>
    <!-- 恢复预览 -->
    <a href="javascript:;" class="show-preview-btn" title="显示预览"
        v-show="!previewVisible"
        @click="showPreview">
        <i class="fa fa-toggle-left"></i>
    </a>
</form>
</template>

<script>
const STYLE_OPTIONS = [
    {text: '模板1(红色背景)', value: '1'},
    {text: '模板2(黄色背景)', value: '2'},
    {text: '模板3(蓝色背景)', value: '3'},
    {text: '模板4(紫色背景)', value: '4'},
    {text: '模板5(绿色背景)', value: '5'},
    {text: '模板6(黑色背景)', value: '6'},
    {text: '模板7(白色背景)', value: '7'}
];
const BANNER_OPTIONS = [
    {text: '模板1（中国移动LOGO）', value: '2'},
    {text: '模板2（最新活动）', value: '3'},
    {text: '模板3（聚惠来袭）', value: '4'}
];
const methods = {};
methods.save = function () {
    this.$TouchConfigSave();
};
methods.getDefaults = function () {
    return {
        pageTitle: '',                              // 页面标题
        backgroundColor: STYLE_OPTIONS[0].value,    // 页面风格
        bannerType: 1,                              // 标题图片-类型
        bannerTemplate: BANNER_OPTIONS[0].value,    // 标题图片-模板
        bannerSelfChar: '',                         // 标题图片-自定义文字
        bannerSelfCharColor: '0',                   // 标题图片-自定义文字
        bannerSelfJpgPath: '',                      // 标题图片-自定义图片URL
        bannerSelfJpg: '',                          // 标题图片-自定义图片物理路径
        actContentStyle: 1,                         // 活动内容-类型
        actContentChar: '',                         // 活动内容-文字
        actContentJpgPath: '',                      // 活动内容-图片URL
        actContentJpg: '',                          // 活动内容-图片物理路径
        actContentJpgUrl:'',                        // 活动内容-跳转URL
        actExpOption: '0',                          // 展示活动说明
        actExpTitle: '',                            // 活动说明-标题
        actExpContent: ''                           // 活动说明-内容
    };
};
methods.$TouchConfigGetSaveParamExtend = function () {
    const products = this.products.map(item => {
        return {
            svcRecommendProdIntro: item.svcRecommendProdIntro,
            svcRecommendProdCode: item.productID,
            svcRecommendType: item.dataplusType
        }
    });
    return {
        products
    }
};
methods.$TouchConfigRestoreExtend = function (data) {
    if (data.products) {
        this.products = data.products.map(v => {
            return {
                svcRecommendProdIntro: v.svcRecommendProdIntro,
                productID: v.svcRecommendProdCode,
                dataplusType: v.svcRecommendType
            }
        });
    }
};
methods.onBannerBtnClick = function (val) {
    if (val == this.value.bannerType) {
        return;
    }
    this.value.bannerType = val;
};
methods.onContentStyleClick = function (val) {
    if (val == this.value.actContentStyle) {
        return;
    }
    this.value.actContentStyle = val;
};
methods.onBannerImageInput = function (data) {
    mlayer.msg('上传成功');
    if (data) {
        this.value.bannerSelfJpgPath = data.path;
        this.value.bannerSelfJpg = data.file;
    }
};
methods.onContentImageInput = function (data) {
    mlayer.msg('上传成功');
    if (data) {
        this.value.actContentJpgPath = data.path;
        this.value.actContentJpg = data.file;
    }
};
methods.onActExpClick = function (val) {
    this.value.actExpOption = val;
};
methods.showPreview = function () {
    this.previewVisible = true;
};
methods.hidePreview = function () {
    this.previewVisible = false;
};
const computed = {};
computed.styleOptions = function () {
    return STYLE_OPTIONS;
};
computed.bannerOptions = function () {
    return BANNER_OPTIONS;
};
computed.bannerColorOptions = function () {
    return [
        {text: '风格根据页面自适应', value: '0'}
    ].concat(this.styleOptions);
};
computed.vendorType = function () {
    return this.vtype;
};
computed.previewData = function () {
    return Tool.extend({}, this.value, {
        products: this.products
    })
};
computed.previewClass = function () {
    return [
        this.previewVisible ? 'view-visible' : 'view-hidden'
    ]
};
const created = function () {};
const mounted = function () {
    this.$TouchConfigInit();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        products: [],
        previewVisible: true
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
        'product-recommend': require('comp/touch/product-recommend.vue'),
        'dataplus-preview': require('comp/touch/dataplus-preview.vue')
    }
};
</script>

<style scoped lang="less">
@layout-width:   319px;
@layout-height:  532px;
.dataplus-preview-wrapper {
    background: url("../../../images/wap_config/mobile_bg.png") no-repeat 0 0;
    position: fixed;
    z-index: 2;
    top: 15px;
    right: 10px;
    width: @layout-width;
    height: @layout-height;
    padding: 65px 15px 61px 16px;
    transition: transform .3s ease;
    &.view-visible {}
    &.view-hidden {
        transform: translateX(@layout-width + 20px);
    }
}
.show-preview-btn,
.hide-preview-btn {
    padding: 6px 12px;
    position: absolute;
    top: 10px;
    right: 4px;
    &:hover {
        color: #5FAEE3;
    }
    i {
        font-size: 26px;
    }
}
.show-preview-btn {
    color: #333;
}
.hide-preview-btn {
    color: #fff;
}
.recommend-label {
    line-height: 32px;
}
</style>

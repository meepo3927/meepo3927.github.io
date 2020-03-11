let store = require('store/market_select.js');
let Vuex = require('vuex');
let URL = require('util/url.js');
let config = require('config');
let request = require('util/request');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};

methods.initEdit = function () {
    if (!this.isModeEdit) {
        return false;
    }
    let r = request.getTouchData();
    if (!r) {
        return false;
    }
    this.saveData = r;
    this.vendorData = r;

};
methods.fixImageUrl = function (url) {
    if (!url) {
        return null;
    }
    if (url.substr(0, 7) === 'http://') {
        return url;
    }
    let host = location.host;
    if (location.hostname === 'localhost') {
        host = '10.220.19.39:8080';
    }
    return 'http://' + host + '/iop/dataplus/image.action?key=' + url;
};
methods.saveSuccess = function () {
    mlayer.iconMsg('保存成功!');

    // 新建，自动刷新
    if (!this.isModeEdit) {
        this.delayReload();
    }
};
methods.saveCheck = function () {
    if (!this.mpId) {
        mlayer.msg('请选择营销活动');
        return false;
    }
    let hasError = false;
    // 表单检查
    let err = [];
    let result = $(this.$refs.form).mVali('check', err);
    if (!result) {
        hasError = true;
    }
    // 上传检查
    for (let i = 1; i < 100; i++) {
        let u = this.$refs['upload_' + i];
        if (!u) {
            break;
        }
        if (!u.check()) {
            hasError = true;
        }
    }
    if (hasError) {
        mlayer.msg(config.msg.formError);
        return false;
    }
    return true;
};
methods.delayReload = function () {
    this.waitReload = true;
    setTimeout(() => {
        window.location.reload();
    }, 2000);
};
methods.postVendor = function () {
    let p = {
        user_id: config.user.id,
        vo: encodeURIComponent(JSON.stringify(this.vendorData))
    };
    return request.postChannelInfo(p);
};
methods.getDefaultSaveData = function () {
    let data = {};
    let fm = this.form || {};

    // 开始结束
    data.beginDate = fm.beginDate;
    data.endDate = fm.endDate;

    // e.
    data.touchID = this.mpId;
    data.actTitle = this.mpName;

    return data;
};
methods.setDefaultSaveData = function (data) {
    if (!data) {
        return;
    }
    let fm = this.form;
    fm.beginDate = data.beginDate;
    fm.endDate = data.endDate;

    this.mpId = data.touchID;
    store.commit('setName', data.actTitle);
};
methods.getFrequency = function () {
    if (!this.mpFrequencyVisible) {
        return 0;
    }
    if (!this.frequencyChecked) {
        return 0;
    }
    let fm = this.form;
    if (this.mpLabelDay) {
        return this.mpLabelDay;
    }
    return fm.frequency;
};
// 选择营销语模板 - 浮层
methods.showMarketSentencePanel = function () {
    this.marketSentencePanelVisible = true;
};
methods.hideMarketSentencePanel = function () {
    this.marketSentencePanelVisible = false;
};
// 选择营销活动模板 - 浮层
methods.showDupChannelSelect = function () {
    this.dupChannelSelectVisible = true;
};
methods.hideDupChannelSelect = function () {
    this.dupChannelSelectVisible = false;
};
// 查看营销活动模板详情 - 浮层
methods.browsePolicyTemplate = function (item) {
    this.policyTemplateData = item;
    this.policyTemplateVisible = true;
};
// 选择 营销活动模板
methods.choosePolicyTemplate = function (item) {
    let ld = mlayer.loading();
    let p = {
        svcType: item.svcType
    };
    this.vRequest.getPolicyTemplateInfo(p).then((result) => {
        ld.close();
        if (result.resultData && result.resultData[0]) {
            this.restorePolicyTemplate(result.resultData[0]);
        } else {
            mlayer.msg(result.resultMsg || '没有查询到数据');
        }
    }).catch((e) => {
        ld.close();
        mlayer.msg('查询失败');
    });
    this.hideDupChannelSelect();
};
methods.hidePolicyTemplate = function () {
    this.policyTemplateVisible = false;
    this.policyTemplateData = null;
};
// 复用 营销活动模板
methods.restorePolicyTemplate = function (data) {
    LOG(data);
    // 营销语
    if (data.mpSentence && this.marketSentence !== undefined) {
        this.marketSentence = data.mpSentence;
    }
    // 渠道描述
    if (data.channelDesc) {
        this.form.channelDesc = data.channelDesc;
    }
    // 开始结束
    if (data.startTime) {
        this.form.beginDate = data.startTime;
    }
    if (data.endTime) {
        this.form.endDate = data.endTime;
    }
};
let computed = Vuex.mapState({
    mpLabelDay: 'mpLabelDay',
    mpLabelType: 'mpLabelType',
    mpName: 'mpName'
});
computed.mpLabelUpdateText = function () {
    return store.getters.mpLabelUpdateText;
};
computed.mpLabelUpdateTip = function () {
    return store.getters.mpLabelUpdateTip;
};
computed.mpFrequencyVisible = function () {
    if (this.mpLabelType == 2) {
        return false;
    }
    return true;
};
/**
 *渠道名称  代码
  短信      0
  外呼      1  *
  网厅      2
  彩铃平台  3  *
  COMP      4
  自助终端  5
  营业前台  6
  客户经理  7  *
  邮件渠道  8  *
  电话经理  9  *
  客服热线  10 *
  短厅      11
 新增渠道
  toolbar   31
  流量+     32
  IVR       33
  事件短信  34
  手厅      35
  微厅      36
  10086弹窗 37
  和生活    38
  官微      39
  随身厅-营销助手 40
  随身厅-营销外呼 41
  随身厅-摆摊助手 42
  在线外呼 45
 */
computed.vendorTypeMap = function () {
    return {
        toolbar: 31,
        plus: 32,
        ivr: 33,
        shouting: 35,
        weiting: 36,
        call10086: 37,
        andlive: 38,
        officialWechat: 39,
        suiMarketAssistant: 40,
        suiMarketCall: 41,
        suiBoothAssistant: 42,
        onlineCall: 45
    };
};

computed.vendorData = {};
computed.vendorData.get = function () {
    let fm = this.form || {};
    let o = {};
    o.type = this.vendorType;
    o.marketSubId = this.mpId;
    // 开始结束
    o.startDate = fm.beginDate.replace(/-/g, '');
    o.endDate = fm.endDate.replace(/-/g, '');

    // 更新周期
    o.frequency = this.getFrequency();

    o.sentTime = o.startDate;

    o.marketChannel = o.type;

    // 特殊号码过滤
    o.listFilter = fm.listFilter;

    if (this.marketSentence === undefined) {
        o.marketSentence = '无';
    } else {
        o.marketSentence = this.marketSentence;
    }

    // IVR配置，营销语可以为空，但是vendor方有校验，所以传'无'
    if (!o.marketSentence && o.type === this.vendorTypeMap.ivr) {
        o.marketSentence = '无';
    }

    o.messageSign = '0';

    o.channelDesc = fm.channelDesc;
    o.linkUrl = '#';
    o.imageUrl = '#';
    return o;
};
computed.vendorData.set = function (data) {
    let fm = this.form;
    fm.frequency = data.frequency;
    fm.listFilter = data.listFilter;
    fm.channelDesc = data.channelDesc;
    // 按周期更新 复选框
    this.frequencyChecked = (fm.frequency > 0);
};
computed.isModeEdit = function () {
    if (location.pathname.indexOf('edit.action') >= 0) {
        return true;
    }
    return (this.mode === 'edit');
};
computed.marketSentencePlaceholder = function () {
    return [
        '说明：',
        '1. 换行将被替换为空格',
        '2. 请不要输入≥、≤、【】等全角字符'
    ].join('\n');
};
module.exports = {
    store,
    props: [],
    data: function () {

        let form = {
            beginDate: '',
            endDate: '',
            // 更新周期
            frequency: 0,
            // 特殊号码过滤
            listFilter: '',
            // 渠道活动整体描述
            channelDesc: ''
        };
        var o = {
            // 营销活动ID
            mpId: '',
            actPlanId: URL.query().actPlanID,
            form,
            frequencyChecked: false,
            marketSentencePanelVisible: false,
            dupChannelSelectVisible: false,
            policyTemplateData: null,
            policyTemplateVisible: false,
            mode: URL.query().mode
        };
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    components: {
        'file-upload': require('comp/common/file-upload.vue'),
        'market-select': require('comp/touch/market_select.vue'),
        'list-filter': require('comp/touch/list-filter.vue'),
        'market-sentence-layer': require('comp/market-sentence-layer.vue'),
        'dup-channel-select-layer': require('comp/dup-channel-select-layer.vue'),
        'policy-template-layer': require('comp/policy-template-layer.vue')
    }
};
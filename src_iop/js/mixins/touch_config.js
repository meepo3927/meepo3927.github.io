const MUIVali = require('extend/mui-vali.js').default;
const TouchUtil = require('util/touch_config.js').default;
const Calendar = require('util/calendar.js');
const store = require('store/touch_config.js');
const URL = require('util/url.js');
const Promise = require('promise');
const iframeUtil = require('util/iframe.js');

const fixMarketSentence = (str) => {
    if (!str) {
        return '';
    }
    // remove 回车
    str = str.replace(/\r/g, '');

    // 合并换行符号
    while (str.indexOf('\n\n') >= 0) {
        str = str.replace(/\n\n/g, '\n');
    }
    // 换行换空格
    str = str.replace(/\n/g, ' ');
    // 特殊符号过滤
    const SPECIAL_CHARS = ['≥', '≤', '—'];
    for (let i = 0; i < SPECIAL_CHARS.length; i++) {
        const char = SPECIAL_CHARS[i];
        str = str.replace(new RegExp(char, 'g'), '');
    }
    return str;
};

const mounted = function () {
    this.$TouchConfigVali = new MUIVali(this.$el);
};
const beforeDestroy = function () {};

const methods = {};
methods.$TouchConfigGetSaveParam = function () {
    let saveData = {
        mpId: this.$TouchConfigMpId,        // 营销活动ID
        channelId: this.channelId           // From Parent
    };
    // 自定义渠道ID
    if (this.getChannelId) {
        saveData.channelId = this.getChannelId();
    }
    if (this.value) {
        // 营销用语
        saveData.marketSentence = fixMarketSentence(this.value.marketSentence);
        // 特殊号码过滤
        saveData.listFilter = undefined;
    }
    if (this.$TouchConfigGetSaveParamExtend) {
        saveData = Tool.extend(saveData, this.$TouchConfigGetSaveParamExtend());
    }
    return Tool.extend({}, this.value, saveData);
};
methods.$TouchConfigGetDHXParam = function () {
    const param = {
        // 营销活动ID
        mpsid: this.$TouchConfigMpId,

        // 渠道ID
        channelType: this.getChannelId ? this.getChannelId() : this.channelId,

        // 波次
        waveNum: URL.query().waveNum,

        // 开始结束
        startTime: this.value.beginDate,
        endTime: this.value.endDate,
        frequency: '0',
        sentTime: this.value.beginDate,

        // 特殊号码过滤
        listFilter: this.value.listFilter,

        // 营销用语
        content: this.value.marketSentence,
        messageSign: '0',

        // 营销活动描述
        channeldesc: this.value.marketDesc,
        priority: ''
    };

    // 实时在线-弹窗 并且 勾选了// 瞬时营销
    if (param.channelType == '47' && this.isInsmp) {
        // isInsmp 定义在 comp/touch/config-48.vue
        param.frequency = '1';
    }

    // 周期更新
    if (this.isCycleUpdate === true) {
        param.frequency = '1';
    }

    if (this.$TouchConfigIsModify) {
        // 修改
        param.svcType = this.TouchConfigSvcType;
    } else {
        // 新增
        param.svcType = '';
    }
    return param;
};
methods.$TouchConfigSaveDHX = function () {
    return Request.putDHXTouchInfo(this.$TouchConfigGetDHXParam());
};
methods.$TouchConfigSaveTD = function (svcType) {
    const param = this.$TouchConfigGetSaveParam();
    if (this.$TouchConfigIsModify) {
        // 修改
        var url = Config.basePath + '/touchConfig/edit.action';
        param.svcType = this.TouchConfigSvcType;
    } else {
        // 新增 - 先调用dhx获取svcType
        url = Config.basePath + '/touchConfig/save.action';
        param.svcType = svcType;
    }
    const headers = {
        'Content-Type': 'application/json'
    };
    const jsonStr = JSON.stringify(param);
    return Request.post(url, jsonStr, headers).then((result) => {
        if (result.success) {
            this.TouchConfigSvcType = svcType;
            return result;
        } else {
            return Promise.reject(result);
        }
    });
};
methods.$TouchConfigSave = function () {
    if (this.TouchConfigLoading) {
        return;
    }
    if (this.$TouchConfigCheckForm() !== true) {
        return;
    }
    // check ok
    this.TouchConfigLoading = true;

    this.$TouchConfigSaveDHX().then((result) => {
        if (result.resultCode === 0) {
            return result.resultData;
        } else {
            return Promise.reject(result);
        }
    }).then((resultData) => {
        return this.$TouchConfigSaveTD(resultData.svcType);
    }).then((success) => {
        mlayer.msg('提交成功');
        this.TouchConfigLoading = false;
        this.$TouchConfigNoticeIframe();
    }).catch((err) => {
        this.TouchConfigLoading = false;
        if (err) {
            mlayer.msg(err.resultMsg || err.msg || '请求失败');
        } else {
            mlayer.msg('提交失败');
        }
        LOG(err);
    });
};
methods.$TouchConfigNoticeIframe = function () {
    const data = {
        channelId: this.channelId,
        svcType: this.TouchConfigSvcType,
        mpsId: this.$TouchConfigMpId,
        beginDate: this.value.beginDate,
        endDate: this.value.endDate
    };
    if (window.parent) {
        iframeUtil.send('saveSuccess', data, window.parent);
    }
};
methods.$TouchConfigCheckForm = function () {
    const result = this.$TouchConfigVali.check();
    const NEED_PASS_DAYS = 5;
    if (!result) {
        return false;
    }
    if (this.value.beginDate > this.value.endDate) {
        mlayer.msg('开始日期必须早于结束日期');
        return false;
    }
    // 如果选择了客群月标签，开始日期不能选择月初
    if (this.$TouchConfigIsMonthLabel) {
        const beginDate = this.value.beginDate;
        if (beginDate.indexOf('-') >= 0) {
            var day = beginDate.split('-').pop() * 1;
        } else if (beginDate.length === 8) {
            day = beginDate.substr(6, 2) * 1;
        }
        if (day <= NEED_PASS_DAYS) {
            alert('客群标签包含月标签时，生效日期不能选择月初(' + NEED_PASS_DAYS + '号及以前)');
            return false;
        }
    }
    return true;
};
// Model初始化
methods.$TouchConfigInitValue = function () {
    const earliest = TouchUtil.getEarliestAvaiableDate(this.prevtime);
    const defaults = {
        // 开始日期
        beginDate: earliest || Calendar.getYMD(new Date),

        // 特殊号码过滤
        listFilter: '1',

        // 营销活动描述
        marketDesc: '',

        // 营销用语
        marketSentence: ''
    };
    // // 结束日期
    defaults.endDate = Calendar.getOffsetStr(defaults.beginDate, 1);
    const defined = (this.getDefaults && this.getDefaults());
    const form = Tool.extend(defaults, defined);
    this.$emit('input', form);
};
// Model值修正
methods.$TouchConfigFixValue = function () {
    const earliestAvaiableDate = TouchUtil.getEarliestAvaiableDate(this.prevtime);
    const lastAvailableDate = store.getters.lastAvailableDate;
    const form = this.value;

    // 开始日期 超了
    if (earliestAvaiableDate && form.beginDate && (form.beginDate < earliestAvaiableDate)) {
        form.beginDate = '';
    }
    // 结束日期 超了
    if (lastAvailableDate && form.endDate && (form.endDate > lastAvailableDate)) {
        form.endDate = '';
    }
};
methods.$TouchConfigFixMarketSentence = function (str) {
    return fixMarketSentence(str);
};
methods.$TouchConfigInit = function () {
    if (!this.value) {
        if (this.TouchConfigSvcType) {
            // 编辑模式
            this.$TouchConfigFetchRestore();
        } else {
            this.$TouchConfigInitValue();
        }
    } else {
        this.$TouchConfigFixValue();
    }
};
methods.$TouchConfigFetchRestore = function () {
    const defined = (this.getDefaults && this.getDefaults());
    this.$emit('input', Tool.extend({
        beginDate: '',
        endDate: '',
        listFilter: '1',
        marketDesc: '',
        marketSentence: ''
    }, defined));
    this.TouchConfigFetching = true;
    const p = {
        svcType: this.TouchConfigSvcType
    };
    Request.getTouchConfigInfo(p).then((data) => {
        this.$TouchConfigRestore(data);
        this.TouchConfigFetching = false;
    }).catch((e) => {
        this.TouchConfigFetching = false;
        LOG('/touchConfig/get:', e);
    });
};
methods.$TouchConfigRestore = function (data) {
    for (let i in this.value) {
        if (this.value.hasOwnProperty(i) && data[i] !== undefined) {
            this.value[i] = data[i];
            LOG('restore:' + i + ':' + data[i]);
        }
    }
    if (this.$TouchConfigRestoreExtend) {
        this.$TouchConfigRestoreExtend(data);
    }
};
const computed = {};
computed.$TouchConfigChannels = function () {
    /**
        外呼      1
        网厅      2
        彩铃平台  3
        COMP     4
        客户经理  7
        电话经理  9
        客服热线  10
    */
    return [
        // {id: '0',  text: '短信', name: 'shortMessage'},
        // {id: '5',  text: '自助终端', name: 'selfServiceTerminal'},
        // {id: '6',  text: '营业前台', name: 'businessFront'},
        // {id: '8',  text: '营业前台周常客', name: 'businessFrontWeekly'},
        // {id: '11', text: '短厅', name: 'duanting'},
        // {id: '12', text: 'PCC签约', name: 'pcc'},
        // {id: '31', text: 'Toolbar', name: 'toolbar'},
        {id: '32', text: '流量加', name:'dataplus'},
        {id: '33', text: 'IVR', name: 'ivr'},
        {id: '34', text: '事件短信', name: 'eventMessage'},
        // {id: '35', text: '手厅', name: 'shouting'},
        // {id: '36', text: '微厅', name: 'weiting'},
        {id: '37', text: '10086弹窗', name: 'pop10086'},
        {id: '38', text: '和生活', name: 'andlive'},
        {id: '39', text: '10086官微', name: 'officialWechat'},
        {id: '40', text: '随身厅-营销助手', name: 'suiMarketAssistant'},
        {id: '41', text: '随身厅-营销外呼', name: 'suiMarketCall'},
        {id: '42', text: '随身厅-摆摊助手', name: 'suiBoothAssistant'},
        {id: '45', text: '10086外呼', name: 'onlineCall'},
        {id: '48', text: '实时在线', name: 'realtimeOnline'}
    ]
};
computed.$TouchConfigChannelMap = function () {
    const map = {};
    this.$TouchConfigChannels.forEach((item) => {
        map[item.id] = item;
    });
    return map;
};
computed.$TouchConfigSaveBtnDisabled = function () {
    return (
        this.TouchConfigLoading
        || this.TouchConfigFetching
    );
};
computed.$TouchConfigSaveBtnText = function () {
    return this.$TouchConfigIsModify ? '修改' : '保存';
};
computed.$TouchConfigFileUpAction = function () {
    if (Config.mock) {
        return '/views/upload.html';
    }
    return Config.basePath + '/dataplus/upload.action';
};
computed.$TouchConfigMpId = function () {
    return URL.query().mpsid;
};
computed.$TouchConfigInputTipMiao = function () {
    return '请提前联系在线公司苗凯芳（13674830496）';
};
computed.$TouchConfigIsMonthLabel = function () {
    return URL.query().mpLabelDay === '2';
};
computed.$TouchConfigIsModify = function () {
    if (this.TouchConfigSvcType) {
        return true;
    }
    return false;
};
module.exports = {
    data: function () {
        var o = {
            TouchConfigSvcType: URL.query().svctype,
            TouchConfigFetching: false,
            TouchConfigLoading: false
        };
        return o;
    },
    methods,
    computed,
    mounted,
    beforeDestroy
};
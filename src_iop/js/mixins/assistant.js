const $ = require('jquery');
const Vue = require('vue');
const tool = require('util/tool.js');
const Cover = require('util/cover.js');
const CubeCover = require('util/cube_cover.js');
const iframeUtil = require('iframeUtil');
const BOX_HEIGHT = 168;
// 东华信 浮床 top
const VENDOR_POPUP_TOP = 100;
const VENDOR_POPUP_WIDTH = 800;
// 东华信 标签页面 左侧百分比
const LABEL_PAGE_LEFT_PERCENT = 20.83;
const LABEL_PAGE_RIGHT_PERCENT = 68.2;
const LABEL_PAGE_PAD = 20;
const LABEL_LEFT_CALX_PARAM = {
    percent: LABEL_PAGE_LEFT_PERCENT,
    pad: LABEL_PAGE_PAD,
    offset: 20
};
// 东华信 营销案 上层
const MARKET_HEAD_HEIGHT = 374;
const MARKET_PAGE_LEFT_PERCENT = 16.67;
const MARKET_PAGE_RIGHT_PERCENT = 83.33;
const MARKET_PAGE_PAD = LABEL_PAGE_PAD;
const VENDOR_URL_MAP = {
    '用户研究': '/iop/iop_client/dist/label_manage.html',
    '新建营销案': '/iop/iop_client/dist/marketing.html'
};
const getPosition = (rect, layout) => {
    let fixedValue = Math.round((rect.height - BOX_HEIGHT) / 2);
    let top = rect.top + fixedValue;
    let left = rect.left + rect.width;
    return {
        top: top + 'px',
        left: left + 'px'
    };
};
const doc = (prop) => {
    return document.documentElement[prop] || document.body[prop];
};
const docWidth = () => {
    return doc('clientWidth');
};
const docHeight = () => {
    return doc('clientHeight');
};
const calx = (options = {}) => {
    const pad = options.pad || 0;
    const percent = options.percent || 0;
    const offset = options.offset || 0;
    let sideWidth = $('.v-side-menu').width();
    let iframeWidth = docWidth() - sideWidth;
    let availWidth = iframeWidth - pad;
    let x = Math.round(availWidth * percent / 100);
    return sideWidth + x + offset;
};
const calw = (options = {}) => {
    const pad = options.pad || 0;
    const percent = options.percent || 0;
    let sideWidth = $('.v-side-menu').width();
    let availWidth = docWidth() - sideWidth - pad;
    return Math.round(availWidth * percent / 100);
};
const caly = (y) => {
    const headerHeight = $('.comp-page-header').height();
    return headerHeight + y;
};
const getMenuElem = (menuName) => {
    let elem = document.querySelector('[menu-name=' + menuName + ']');
    if (elem && $(elem).filter(':visible').length) {
        return elem;
    }
    return null;
};
const matchPath = (src, keyword) => {
    let url = src.split('?')[0];
    url = url.split('#')[0];
    return (url.indexOf('/' + keyword + '.') >= 0);
};
const matchUrl = (src, path) => {
    let url = src.split('?')[0];
    url = url.split('#')[0];

    return (url.indexOf(path) >= 0);
};
const nextStepMap = {};
const prevStepMap = {};
const getNextStep = (step) => {
    if (nextStepMap[step]) {
        return nextStepMap[step];
    }
    let a = step.split('-');
    let i = parseInt(a[a.length - 1], 10);
    if (i) {
        a[a.length - 1] = i + 1;
        return a.join('-');
    }
    return '';
};
const getPrevStep = (step) => {
    if (prevStepMap[step]) {
        return prevStepMap[step];
    }
    let a = step.split('-');
    let i = parseInt(a[a.length - 1], 10);
    if (i) {
        a[a.length - 1] = i - 1;
        return a.join('-');
    }
    return '';
};
const getMethodName = (step) => {
    return 'assistant' + tool.capitalize(tool.camelize(step));
};

const created = function () {
};
const mounted = function () {
    window.Assistant = this;
    const menuFuncMap = {};
    menuFuncMap['event-entry-策略库'] = () => {
        setTimeout(this.assistantEvent2, 150);
    };
    menuFuncMap['event-2-事件中心'] = () => {
        this.assistantHide();
    };

    menuFuncMap['label-entry-信息库'] = () => {
        setTimeout(this.assistantLabelEntry2, 150);
    };
    menuFuncMap['label-entry2-用户研究中心'] = () => {
        setTimeout(this.assistantLabelEntry3, 150);
    };
    menuFuncMap['label-entry3-用户研究'] = () => {
        this.assistantHide();
    };

    menuFuncMap['market-entry-策略库'] = () => {
        setTimeout(this.assistantMarketEntry2, 150);
    };
    menuFuncMap['market-entry2-营销管理中心'] = () => {
        setTimeout(this.assistantMarketEntry3, 150);
    };
    menuFuncMap['market-entry3-新建营销案'] = () => {
        this.assistantHide();
    };

    this.vEventBus.on('menuClick', (e, item) => {
        //LOG('menuClick', e, item);
        let folderName = item.folderName.split('|')[0];
        let name = this.assistantStep + '-' + folderName;
        if (menuFuncMap[name]) {
            return menuFuncMap[name]();
        }
    });
    // 事件中心 - 新建事件 click
    iframeUtil.on('create_event_click', () => {
        if (this.assistantStep === 'event-3') {
            this.assistantHide();
        }
    });
    document.documentElement.addEventListener('keyup', this.onDocKeyUp);
    window.addEventListener('resize', this.assistantResize);
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    document.documentElement.removeEventListener('keyup', this.onDocKeyUp);
    window.removeEventListener('resize', this.assistantResize);
    this.assistantRemove();
};

let methods = {};
methods.onload = function () {
    let step = this.assistantStep;
    // 事件中心 列表页：提示点击创建事件
    if (this.isIframeMatch('event_list') && step === 'event-2') {
        this.assistantEvent3();
    }
    // 事件中心 创建事件：提示第一步 填写名称
    if (this.isIframeMatch('create_event') && step === 'event-3') {
        this.assistantCreateEvent1();
    }
    // 用户研究
    if (this.isIframeMatch('用户研究') && step === 'label-entry3') {
        this.assistantLabel1();
    }
    // 创建营销案
    if (this.isIframeMatch('新建营销案') && step === 'market-entry3') {
        this.assistantMarket1();
    }
};
methods.onDocKeyUp = function (e) {
    if (!this.assistantVisible) {
        return;
    }
    let code = e.keyCode;
    const MOVE_LEFT = 37;
    const MOVE_UP = 38;
    const MOVE_RIGHT = 39;
    const MOVE_DOWN = 40;
    const isActionNext = () => {
        return (code === MOVE_RIGHT || code === MOVE_DOWN)
    };
    const isActionPrev = () => {
        return (code === MOVE_LEFT || code === MOVE_UP);
    };

    if (isActionNext() && this.assistantOptions.hasNext) {
        this.assistantNext();
    } else if (isActionPrev() && this.assistantOptions.hasPrev) {
        this.assistantPrev();
    }
};
methods.setAssistantStep = function (step) {
    this.assistantStep = step;
};
methods.toggleGif = function () {
    return this.gifVisible ? this.hideGif() : this.showGif();
};
methods.showGif = function () {
    this.gifVisible = true;
};
methods.hideGif = function () {
    this.gifVisible = false;
};
methods.assistantHide = function () {
    this.assistantVisible = false;
    this.assistantRemove();
};
methods.assistantBackMenu = function () {
    this.lastAssistantStep = '';
    // 恢复初始值
    this.gifVisible = true;
    this.setAssistantStep('');
    this.assistantHide();
    // 主页面
    this.assistantShowMain();
};
methods.assistantPrev = function () {
    let prevStep = getPrevStep(this.assistantStep);
    if (!prevStep) {
        return this.assistantHide();
    }
    let methodName = getMethodName(prevStep);
    if (!this[methodName]) {
        return this.assistantHide();
    }
    this.gifVisible = true;
    this[methodName]();
};
methods.assistantNext = function () {
    let nextStep = getNextStep(this.assistantStep);
    if (!nextStep) {
        return this.assistantHide();
    }
    let methodName = getMethodName(nextStep);
    if (!this[methodName]) {
        mlayer.msg('本次引导结束');
        return this.assistantHide();
    }
    this.gifVisible = true;
    this[methodName]();
};
methods.assistantRestart = function () {
    let s = this.assistantStep.replace(/\d/g, '');
    let m = getMethodName(s + '1');
    return this[m]();
};
methods.assistantExit = function () {
    if (this.assistantStep) {
        this.lastAssistantStep = this.assistantStep;
    }
    // 恢复初始值
    this.gifVisible = true;
    this.setAssistantStep('');
    this.assistantHide();
};
methods.assistantResize = function () {
    if (!this.assistantVisible || !this.assistantStep) {
        return;
    }
    let method = getMethodName(this.assistantStep);
    if (this[method]) {
        this[method]();
    }
};
// 当时iframe的URL匹配
methods.isIframeMatch = function (name) {
    if (VENDOR_URL_MAP[name]) {
        return matchUrl(this.mySrc, VENDOR_URL_MAP[name]);
    }
    return matchPath(this.mySrc, name);
};
methods.getLastMatchedName = function (pattern) {
    let reg = new RegExp('^' + pattern + '-\\d+$');
    if (reg.exec(this.lastAssistantStep)) {
        return getMethodName(this.lastAssistantStep);
    }
};
// 智能助手
methods.assistantSmart = function () {
    if (this.isIframeMatch('用户研究')) {
        let m = this.getLastMatchedName('label');
        return m ? this[m]() : this.assistantLabel1();
    }
    if (this.isIframeMatch('create_event')) {
        let m = this.getLastMatchedName('create-event');
        return m ? this[m]() : this.assistantCreateEvent1();
    }
    if (this.isIframeMatch('新建营销案')) {
        return this.assistantMarket1();
    }
    this.assistantShowMain();
};
methods.assistantShowMain = function () {
    this.setAssistantStep('home-visible');
    this.view.homeAssistantVisible = true;
};
methods.setGifAndCube = function (o) {
    let style = {};
    for (var name in o) {
        style[name] = o[name] + 'px';
    }
    this.gifStyle = style;
    let cubeSetting = {};
    if (o.left) {
        cubeSetting.x1 = o.left;
    } else {
        cubeSetting.x1 = calx();
    }
    if (o.top) {
        cubeSetting.y1 = o.top;
    } else {
        cubeSetting.y1 = caly();
    }
    if (o.width) {
        cubeSetting.x2 = cubeSetting.x1 + o.width;
    } else if (o.right) {
        cubeSetting.x2 = docWidth() - o.right;
    }
    if (o.height) {
        cubeSetting.y2 = cubeSetting.y1 + o.height;
    } else if (o.bottom) {
        cubeSetting.y2 = docHeight() - o.bottom;
    }
    this.assistantSetCube(cubeSetting);
};
// 导航 策略库
methods.assistantEventEntry = function () {
    if (getMenuElem('事件中心')) {
        return this.assistantEvent2();
    }
    let elem = getMenuElem('策略库');
    if (!elem) {
        return false;
    }
    this.setAssistantStep('event-entry');
    let layout = '1';
    let rect = elem.getBoundingClientRect();
    this.assistantSetCube({rect});
    this.assistantOptions = {
        text: '请点击[策略库]',
        layout,
        position: getPosition(rect, layout)
    };
    this.assistantVisible = true;
    return true;
};
// 导航 策略库 事件中心
methods.assistantEvent2 = function () {
    let elem = getMenuElem('事件中心');
    if (!elem) {
        return false;
    }
    this.setAssistantStep('event-2');
    let layout = '1';
    let rect = elem.getBoundingClientRect();
    this.assistantSetCube({rect});
    this.assistantOptions = {
        text: '请点击[事件中心]',
        layout,
        position: getPosition(rect, layout)
    };
    this.assistantVisible = true;
    return true;
};
// 点击 ==> 新建事件
methods.assistantEvent3 = function () {
    this.setAssistantStep('event-3');
    this.assistantSetCube({
        x1: docWidth() - 200,
        y1: 145,
        x2: docWidth(),
        y2: 200
    });
    this.assistantOptions = {
        text: '请点击[新建事件]',
        layout: '2',
        top: 96,
        left: docWidth() - 470
    };
    this.assistantVisible = true;
};
// 创建事件第一步，填写名称
methods.assistantCreateEvent1 = function () {
    this.setAssistantStep('create-event-1');
    this.gifSrc = this.getImageUrl('/assistant/create_event_1.gif');
    let top = caly(127);
    let left = calx({offset: 16});
    let width = 809;
    let height = 105;
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '填写事件名称',
        layout: '3',
        top: caly(top + 70),
        left: calx({offset: 330}),
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建事件第二步，选择规则
methods.assistantCreateEvent2 = function () {
    this.setAssistantStep('create-event-2');
    this.gifSrc = this.getImageUrl('/assistant/create_event_2.gif');
    let top = caly(350);
    let left = calx({offset: 32});
    let width = 642;
    let height = 229;
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '选择事件规则',
        layout: '1',
        top: caly(top - 40),
        left: calx({offset: width + 100}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建事件第三步，选择渠道
methods.assistantCreateEvent3 = function () {
    this.setAssistantStep('create-event-3');
    this.gifSrc = this.getImageUrl('/assistant/create_event_3.gif');
    let top = caly(15);
    let left = calx({offset: 15});
    this.setGifAndCube({top, left, right: 15, bottom: 15});
    this.assistantOptions = {
        text: '选择事件覆盖的渠道',
        layout: '4',
        top: '-80px',
        left: calx({offset: 590}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建事件第四步，保存
methods.assistantCreateEvent4 = function () {
    this.setAssistantStep('create-event-4');
    this.gifSrc = this.getImageUrl('/assistant/create_event_4.gif');
    let width = 438;
    let height = 67;
    let top = docHeight() - height;
    let left = calx({percent: 100, offset: -width});
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '保存事件',
        layout: '4',
        top: caly(top - 240),
        left: calx({offset: left - 50}),
        hasPrev: true,
        hasNext: false,
        hasRestart: true
    };
    this.assistantVisible = true;
};
// 客群标签：信息库
methods.assistantLabelEntry = function () {
    if (getMenuElem('用户研究中心')) {
        return this.assistantLabelEntry2();
    }
    let elem = getMenuElem('信息库');
    if (!elem) {
        return false;
    }
    this.setAssistantStep('label-entry');
    let layout = '1';
    let rect = elem.getBoundingClientRect();
    this.assistantSetCube({rect});
    this.assistantOptions = {
        text: '请点击[信息库]',
        layout,
        position: getPosition(rect, layout)
    };
    this.assistantVisible = true;
    return true;
};
// 信息库 - 用户研究中心
methods.assistantLabelEntry2 = function () {
    if (getMenuElem('用户研究')) {
        return this.assistantLabelEntry3();
    }
    let elem = getMenuElem('用户研究中心');
    if (!elem) {
        return false;
    }
    this.setAssistantStep('label-entry2');
    let layout = '1';
    let rect = elem.getBoundingClientRect();
    this.assistantSetCube({rect});
    this.assistantOptions = {
        text: '请点击[用户研究中心]',
        layout,
        position: getPosition(rect, layout)
    };
    this.assistantVisible = true;
    return true;
};
// 信息库 - 用户研究中心 - 用户研究
methods.assistantLabelEntry3 = function () {
    let elem = getMenuElem('用户研究');
    if (!elem) {
        return false;
    }
    this.setAssistantStep('label-entry3');
    let layout = '1';
    let rect = elem.getBoundingClientRect();
    this.assistantSetCube({rect});
    this.assistantOptions = {
        text: '请点击[用户研究]',
        layout,
        position: getPosition(rect, layout)
    };
    this.assistantVisible = true;
    return true;
};
// 用户研究 第一步 选择日期 机构
methods.assistantLabel1 = function () {
    this.setAssistantStep('label-1');
    this.gifSrc = this.getImageUrl('/assistant/label_1.gif');
    let top = caly(15);
    let left = calx(LABEL_LEFT_CALX_PARAM);
    let height = 568;
    this.setGifAndCube({top, left, right: 10, height});
    this.assistantOptions = {
        text: '先选择日期和机构',
        layout: '2',
        top: caly(20),
        left: calx({percent: 18, offset: -220}),
        hasNext: true
    };
    this.assistantVisible = true;
};
// 用户研究 第二步 选择标签
methods.assistantLabel2 = function () {
    this.setAssistantStep('label-2');
    this.gifSrc = this.getImageUrl('/assistant/label_2.gif');
    const top = caly(3);
    const left = calx({percent: 0, offset: 1});
    const width = calw({percent: 54, pad: LABEL_PAGE_PAD});
    const height = docHeight() - caly(15);
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '选择所有涉及的标签属性',
        layout: '1',
        top: caly(200),
        left: calx({percent: 44, offset: 220}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 用户研究 第三步 配置条件(1)
methods.assistantLabel3 = function () {
    this.setAssistantStep('label-3');
    this.gifSrc = this.getImageUrl('/assistant/label_3.gif');
    const top = caly(1);
    const left = calx(LABEL_LEFT_CALX_PARAM);
    const height = 629;
    this.setGifAndCube({top, left, right: 10, height});

    this.assistantOptions = {
        text: '切换到高级视图，配置条件(1)',
        layout: '2',
        top: caly(240),
        left: calx({percent: 0, offset: -20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 用户研究 第四步 配置条件(2)
methods.assistantLabel4 = function () {
    this.setAssistantStep('label-4');
    this.gifSrc = this.getImageUrl('/assistant/label_4.gif');
    const top = caly(1);
    const left = calx(LABEL_LEFT_CALX_PARAM);
    const height = 629;
    this.setGifAndCube({top, left, right: 10, height});
    this.assistantOptions = {
        text: '配置条件(2)',
        layout: '2',
        top: caly(240),
        left: calx({percent: 0, offset: -20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 用户研究 第五步 剔除条件
methods.assistantLabel5 = function () {
    this.setAssistantStep('label-5');
    this.gifSrc = this.getImageUrl('/assistant/label_5.gif');
    const top = caly(1);
    const left = calx(LABEL_LEFT_CALX_PARAM);
    const height = 629;
    this.setGifAndCube({top, left, right: 10, height});
    this.assistantOptions = {
        text: '配置剔除条件',
        layout: '2',
        top: caly(240),
        left: calx({percent: 0, offset: -20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 用户研究 第6步 查询
methods.assistantLabel6 = function () {
    this.setAssistantStep('label-6');
    this.gifSrc = this.getImageUrl('/assistant/label_6.gif');
    const top = caly(1);
    const left = calx(LABEL_LEFT_CALX_PARAM);
    const height = 629;
    this.setGifAndCube({top, left, right: 10, height});
    this.assistantOptions = {
        text: '配置完成，点击查询，等待数据展现',
        layout: '2',
        top: caly(240),
        left: calx({percent: 0, offset: -20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 用户研究 第7步 查询
methods.assistantLabel7 = function () {
    this.setAssistantStep('label-7');
    this.gifSrc = this.getImageUrl('/assistant/label_7.gif');
    const top = caly(574);
    const left = calx(LABEL_LEFT_CALX_PARAM);
    const width = Math.round(calw({percent: 79.16, pad: 20}) * 0.74);
    const height = 210;
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '点击生成标签',
        layout: '4',
        top: (top - 200),
        left: calx({percent: 46, offset: 50}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 用户研究 第8步 生成标签
methods.assistantLabel8 = function () {
    this.setAssistantStep('label-8');
    this.gifSrc = this.getImageUrl('/assistant/label_8.gif');
    const width = 810;
    const height = 405;
    const top = caly(VENDOR_POPUP_TOP);
    const left = calx({percent: 50, offset: -(width / 2)});
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '填写标签信息',
        layout: '2',
        top: (top + 100),
        left: calx({percent: 1}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 用户研究 第9步 查看我的标签
methods.assistantLabel9 = function () {
    this.setAssistantStep('label-9');
    this.gifSrc = this.getImageUrl('/assistant/label_9.gif');
    const top = caly(1);
    const left = calx({percent: 0, offset: 10});
    const width = calw({percent: LABEL_PAGE_LEFT_PERCENT, pad: LABEL_PAGE_PAD});
    this.setGifAndCube({top, left, width, bottom: 8});
    this.assistantOptions = {
        text: '在[我的标签]中查看生成的标签；<br />提取营销客群标签流程结束。',
        layout: '1',
        top: docHeight() / 2 - 80,
        left: calx({percent: 1, offset: width}),
        hasPrev: true,
        hasNext: false,
        hasRestart: true
    };
    this.assistantVisible = true;
};
// 营销活动 入口
methods.assistantMarketEntry = function () {
    if (getMenuElem('营销管理中心')) {
        return this.assistantMarketEntry2();
    }
    let elem = getMenuElem('策略库');
    if (!elem) {
        return false;
    }
    this.setAssistantStep('market-entry');
    let layout = '1';
    let rect = elem.getBoundingClientRect();
    this.assistantSetCube({rect});
    this.assistantOptions = {
        text: '请点击[策略库]',
        layout,
        position: getPosition(rect, layout)
    };
    this.assistantVisible = true;
    return true;
};
methods.assistantMarketEntry2 = function () {
    if (getMenuElem('新建营销案')) {
        return this.assistantMarketEntry3();
    }
    let elem = getMenuElem('营销管理中心');
    if (!elem) {
        return false;
    }
    this.setAssistantStep('market-entry2');
    let layout = '1';
    let rect = elem.getBoundingClientRect();
    this.assistantSetCube({rect});
    this.assistantOptions = {
        text: '请点击[营销管理中心]',
        layout,
        position: getPosition(rect, layout)
    };
    this.assistantVisible = true;
    return true;
};
methods.assistantMarketEntry3 = function () {
    let elem = getMenuElem('新建营销案');
    if (!elem) {
        return false;
    }
    this.setAssistantStep('market-entry3');
    let layout = '1';
    let rect = elem.getBoundingClientRect();
    this.assistantSetCube({rect});
    this.assistantOptions = {
        text: '请点击[新建营销案]',
        layout,
        position: getPosition(rect, layout)
    };
    this.assistantVisible = true;
    return true;
};
// 创建营销活动 第1步
methods.assistantMarket1 = function () {
    this.setAssistantStep('market-1');
    this.gifSrc = this.getImageUrl('/assistant/market_1.gif');
    const top = caly(13);
    const left = calx({offset: 10});
    const height = 364;
    this.setGifAndCube({top, left, right: 12, height});
    this.assistantOptions = {
        text: '填写营销案信息',
        layout: '3',
        top: caly(height + 40),
        left: calx({percent: 45, offset: 20}),
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第2步
methods.assistantMarket2 = function () {
    this.setAssistantStep('market-2');
    this.gifSrc = this.getImageUrl('/assistant/market_2.gif');
    const top = caly(MARKET_HEAD_HEIGHT);
    const left = calx({offset: 10});
    const height = 452;
    this.setGifAndCube({top, left, right: 12, height});
    this.assistantOptions = {
        text: '选择营销方式：事件触发；开始创建营销活动',
        layout: '4',
        top: top - 200,
        left: calx({percent: 35, offset: 20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第3步
methods.assistantMarket3 = function () {
    this.setAssistantStep('market-3');
    this.gifSrc = this.getImageUrl('/assistant/market_3.gif');
    const width = VENDOR_POPUP_WIDTH;
    const top = caly(VENDOR_POPUP_TOP);
    const left = calx({percent: 50, offset: -(width / 2)});
    const height = 500;
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '选择已创建好的用户标签',
        layout: '2',
        top: top + 170,
        left: calx({percent: 1, offset: -35}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第4步
methods.assistantMarket4 = function () {
    this.setAssistantStep('market-4');
    this.gifSrc = this.getImageUrl('/assistant/market_4.gif');
    const top = caly(MARKET_HEAD_HEIGHT);
    const left = calx({
        percent: MARKET_PAGE_LEFT_PERCENT, pad: MARKET_PAGE_PAD, offset: 10
    });
    // const height = 449;
    this.setGifAndCube({top, left, right: 12, bottom: 5});
    this.assistantOptions = {
        text: '填写要营销的客群特征，<br />完成后点击[事件配置]',
        layout: '4',
        top: top - 220,
        left: calx({percent: 44, offset: 20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第5步
methods.assistantMarket5 = function () {
    this.setAssistantStep('market-5');
    this.gifSrc = this.getImageUrl('/assistant/market_5.gif');
    const width = VENDOR_POPUP_WIDTH;
    const top = caly(VENDOR_POPUP_TOP);
    const left = calx({percent: 50, offset: -(width / 2)});
    const height = 516;
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '选择对应的已创建好的事件',
        layout: '2',
        top: top + 173,
        left: calx({percent: 1, offset: -20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第6步
methods.assistantMarket6 = function () {
    this.setAssistantStep('market-6');
    this.gifSrc = this.getImageUrl('/assistant/market_6.gif');
    const top = caly(MARKET_HEAD_HEIGHT);
    const left = calx({
        percent: MARKET_PAGE_LEFT_PERCENT, pad: MARKET_PAGE_PAD, offset: 10
    });
    // const height = 449;
    this.setGifAndCube({top, left, right: 12, bottom: 5});
    this.assistantOptions = {
        text: '配置将要营销的商品',
        layout: '4',
        top: top - 190,
        left: calx({percent: 44, offset: 20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第7步
methods.assistantMarket7 = function () {
    this.setAssistantStep('market-7');
    this.gifSrc = this.getImageUrl('/assistant/market_7.gif');
    const width = VENDOR_POPUP_WIDTH;
    const top = caly(VENDOR_POPUP_TOP);
    const left = calx({percent: 50, offset: -(width / 2)});
    const height = 510;
    this.setGifAndCube({top, left, width, height});
    this.assistantOptions = {
        text: '选择想要营销的商品（多选）',
        layout: '2',
        top: top + 168,
        left: calx({percent: 1, offset: -20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第8步
methods.assistantMarket8 = function () {
    this.setAssistantStep('market-8');
    this.gifSrc = this.getImageUrl('/assistant/market_8.gif');
    const top = caly(MARKET_HEAD_HEIGHT);
    const left = calx({
        percent: MARKET_PAGE_LEFT_PERCENT, pad: MARKET_PAGE_PAD, offset: 10
    });

    this.setGifAndCube({top, left, right: 12, bottom: 5});
    this.assistantOptions = {
        text: '确认所有配置无误后，点击[创建活动]',
        layout: '4',
        top: top - 190,
        left: calx({percent: 44, offset: 20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第9步
methods.assistantMarket9 = function () {
    this.setAssistantStep('market-9');
    this.gifSrc = this.getImageUrl('/assistant/market_9.gif');
    const top = caly(MARKET_HEAD_HEIGHT);
    const left = calx({offset: 10});
    const height = 447;
    this.setGifAndCube({top, left, right: 12, height});
    this.assistantOptions = {
        text: '选择营销触点（例：事件短信），并填写相应内容',
        layout: '4',
        top: top - 200,
        left: calx({percent: 35, offset: 20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第10步
methods.assistantMarket10 = function () {
    this.setAssistantStep('market-10');
    this.gifSrc = this.getImageUrl('/assistant/market_10.gif');
    const top = caly(MARKET_HEAD_HEIGHT);
    const left = calx({
        percent: MARKET_PAGE_LEFT_PERCENT, pad: MARKET_PAGE_PAD, offset: 10
    });

    this.setGifAndCube({top, left, right: 12, bottom: 5});
    this.assistantOptions = {
        text: '填写完配置项和营销语，点击[创建]',
        layout: '4',
        top: top - 190,
        left: calx({percent: 44, offset: 20}),
        hasPrev: true,
        hasNext: true
    };
    this.assistantVisible = true;
};
// 创建营销活动 第11步
methods.assistantMarket11 = function () {
    this.setAssistantStep('market-11');
    this.gifSrc = this.getImageUrl('/assistant/market_11.gif');
    const top = caly(13);
    const left = calx({offset: 10});
    const height = 371;
    this.setGifAndCube({top, left, right: 12, height});
    this.assistantOptions = {
        text: [
            '点击右上角图标，查看已创建的营销活动；',
            '点击营销活动右侧图标进行修改或删除；',
            '确认无误后，点击[提交审批]，提交后将不可修改；',
            '提交审批后，创建营销活动流程完成。'
        ].join('<br />'),
        layout: '3',
        top: caly(height + 40),
        left: calx({percent: 45, offset: 20}),
        hasPrev: true,
        hasRestart: true
    };
    this.assistantVisible = true;
};
methods.assistantRemove = function () {
    if (this.cube) {
        this.cube.remove();
    }
    if (this._assistantCover) {
        this._assistantCover.hide();
    }
    this.gifStyle = {};
    this.gifSrc = '';
    this.cube = undefined;
};
methods.assistantSetCube = function (options) {
    if (this.cube) {
        this.cube.update(options);
    } else {
        this.cube = new CubeCover(options);
    }
};
methods.assistantCover = function () {
    if (this._assistantCover) {
        this._assistantCover.show();
    } else {
        this._assistantCover = new Cover({opacity: .5});
    }
};
methods.assistantFocus = function () {
    let elem = document.querySelector('.assistant-next-step-btn');
    if (elem) {
        elem.focus();
    }
};
let computed = {};
computed.gifBtnText = function () {
    return this.gifVisible ? '关闭演示' : '开启演示';
};
const watch = {};
watch.assistantVisible = function (v) {
    if (v) {
        this.$nextTick(() => {
            setTimeout(this.assistantFocus, 50);
        });
    }
};
module.exports = {
    props: [],
    data: function () {
        var o = {
            assistantVisible: false,
            assistantStep: '',
            lastAssistantStep: '',
            assistantOptions: {},
            gifVisible: true,
            gifSrc: '',
            gifStyle: {}
        };
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    components: {}
};
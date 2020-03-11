
const URL = require('util/url.js');
const dev = require('global/dev.js');

// 开发环境
let mock = dev.isMock;

// 路径定义
let global = window.global || {};
let basePath = mock ? ('') : (global.basePath || '/iop');
let staticPath = mock ? (basePath) : (basePath + '/static');
let imgPath = staticPath + '/images';
let ajaxUrlBase = mock ? (basePath + '/mock') : basePath;
// 链接定义
let pageUrlExt = mock ? 'html' : 'jsp';
const user = {
    name: global.userName,
    branchId: global.branchId,
    id: global.userId || URL.query().userId
};
const replaceUrlVar = (url) => {
    url = url.replace(/{user_id}/, user.id);
    url = url.replace(/{ticket}/, global.ticket || '');
    return url;
};
const vendorUrlBase = 'http://10.220.19.71:8080';
const vendorUrlBaseTest = 'http://10.220.19.71:8081';
const vendorUrlPath = vendorUrlBase + '/iop/iop_client';
// let labelLinkUrlPath = vendorUrlBase + '/iop/iop_client/dist/label_manage.html';
const labelLinkUrlPath = vendorUrlPath + '/dist/label_paper.html';

module.exports = {
    debug: false,
    dev: mock,
    basePath,
    staticPath,
    imgPath,
    ajaxUrlBase,
    vendorUrlBase,
    vendorUrlBaseTest,
    vendorUrlPath,
    labelLinkUrlPath,
    mock,
    pageUrlExt,
    replaceUrlVar,
    BASS_SSO_URL: global.BASS_SSO_URL || '',
    indexIframeFolderId: 'IOP01',
    uploadUrl: basePath + '/dataplus/upload.action',

    user,
    ticket: global.ticket,
    msg: {
        formError: '存在错误，请检查',
        confirmDelete: '确定删除吗？',
        fetchFail: '获取数据失败，请稍后再试',
        opSuccess: '操作成功！',
        opfail: '操作失败，请稍后再试'
    },
    vendorNameMap: {
        31: 'ToolBar',
        32: '流量加',
        33: 'IVR',
        35: '手厅',
        36: '微厅'
    },
    contactPriorityHash: {
        1: '高',
        2: '中',
        3: '低'
    },
    contactPriorityMap: {
        '高': 1,
        '中': 2,
        '低': 3
    },
    leftWidthNormal: '330px',
    leftWidthMini: '140px',
    midLeftWidthNormal: '230px',
    midLeftWidthMini: '80px',
    mqMidWidth: 1400,
    themeColor: '#5FAEE3',
    GIS_URL_BASE: 'http://10.220.19.27:8080/iopgis',
    channelAreaAtomId: ['am004', 'am008', 'am009', 'mme036']
};

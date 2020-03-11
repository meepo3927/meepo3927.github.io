/**
 * 请求数据
 */

let Promise = require('promise');
let tool = require('tool');
let store = require('util/store');
let config = require('config');
let URL = require('util/url');
let UtilAjax = require('util/ajax');
let Fetch = require('util/fetch');
let MockData = require('util/mock.js');

const ajaxUrlBase = config.ajaxUrlBase;
const mock = config.mock;
const vendorUrlPrefix = Config.vendorUrlBase + '/iop';
const vendorJSONPCallback = 'jsonPCallback';

// 事件
const eventPath = '/event';
const salt = () => {
    const n = (new Date).getTime() + Math.random();
    return n.toString(30).substr(2);
};
const fetch0 = (url, data) => {
    return Fetch.getJSON(url, data).then((result) => {
        if (result.success) {
            return result;
        }
        // error
        return Promise.reject(result);
    });
};
const getMockData = (key) => {
    if (MockData[key]) {
        return new Promise((resolve) => {
            const result = MockData[key];
            setTimeout(() => {
                resolve(result.data || result);
            }, Math.random() * 300 + 100);
        });
    }
    LOG('getMockData:' + key);
    return Promise.reject({success: false, msg: '暂无数据'});
};
const fetch1 = (url, data) => {
    return Fetch.getJSON(url, data).then((result) => {
        if (result && result.success === undefined) {
            return result;
        }

        if (result.success) {
            return result.data;
        }
        // error
        return Promise.reject(result);
    });
};
const fetch2 = (path, param) => {
    return getMockData(path);
    // return fetch1(ajaxUrlBase + `${path}.action`, param);
};
const fetch3 = (path, param) => {
    return fetch2(path, param).then((r) => {
        if (r && r[0]) {
            return Promise.resolve(r[0]);
        }
        return Promise.reject(r);
    });
};
const fetch4 = (path, param) => {
    if (mock) {
        return fetch0(ajaxUrlBase + `${path}.json`, param);
    }
    return fetch0(ajaxUrlBase + `${path}.action`, param);
};
const op = (url, data, method) => {
    if (mock) {
        LOG('[Request]' + url, data);
        return new Promise((resolve, reject) => {
            resolve({success: true});
        });
    }
    return Fetch.getJSON(url, data, method);
};
const post = (url, data, headers = {}) => {
    if (mock) {
        LOG('POST:', url, data);
        return new Promise((resolve, reject) => {
            resolve({success: true});
        });
    }
    return new Promise((resolve, reject) => {
        const method = 'POST';
        const dataType = 'json';
        let p = {
            url, dataType, data, type: method,
            headers
        };
        return $.ajax(p).success((json) => {
            json ? resolve(json) : reject(json);
        }).error(reject);
    });
};
const jsonp = (url, data) => {
    return new Promise((r, j) => {
        $.ajax({
            url,
            data: data,
            type: 'GET',
            dataType: 'jsonp'
        }).success((result) => {
            r(result);
        }).error((e) => {
            j(e);
        });
    });
};
const autoSendScreen = () => {
    let sn = window.screen;
    let p = {
        screenSize: sn.width + '*' + sn.height
    };
    let url = ajaxUrlBase + '/login/getScreenSize.action';
    Fetch.getHTML(url, p).catch(() => {
    });
};
const autoSendNMCCSession = () => {
    let url = 'http://10.220.19.39:8080/nmcccimweb/syncSessionUser';
    let p = {
        j_username: config.user.id
    };
    UtilAjax.jsonp(url, {
        data: p
    });
};
const isEntryPage = () => {
    return (location.pathname.indexOf('/login.action') >= 0);
};
if (isEntryPage()) {
    autoSendScreen();
    autoSendNMCCSession();
}
var exports = {
    post,
    fetch2,
    fetch4
};
exports.eventPath = eventPath;
exports.op = op;
exports.fetch1 = fetch1;
exports.ajaxUrlBase = ajaxUrlBase;
var adaptCaselist = (list) => {
    return list.map((item) => {
        item.childView = '';
        return item;
    });
};
exports.getEventsList = (p) => {
    let param = tool.filterEmpty(p);
    if (mock) {
        return fetch0(ajaxUrlBase + eventPath + `/getEventsList.json`, param);
    }
    return fetch0(ajaxUrlBase + eventPath + `/getEventsList.action`, param);
};
// 旧api，没有分页
exports.getAllEvents = function (p) {
    return fetch2(eventPath + '/getEventsList', tool.filterEmpty(p));
};
exports.getMenuOnce = Fetch.once(() => {
    return getMockData('/getMenuCommon');
});
exports.getPath = (p) => {
    if (mock) {
        let str = p.folderId;
        return fetch1(ajaxUrlBase + '/menu/getPath_' + str + '.json').then((result) => {
            if (result[0]) {
                return result[0];
            }
            return Promise.reject(r);
        });
    }
    const param = {
        appId: p.appId,
        folderId: p.folderId
    };
    return fetch1(ajaxUrlBase + '/menu/getPath.action', param).then((result) => {
        if (result[0]) {
            return result[0];
        }
        return Promise.reject(r);
    });
};
exports.getIndexTopUrl = () => {
    return exports.getMenuOnce().then((r) => {
        let result = {};
        const handle = (item) => {
            if (!item) {
                return;
            }
            let name = item.folderName;
            if (!name || (name.indexOf('|') < 0)) {
                return;
            }
            let num = parseInt(name.split('|')[1], 10);
            if (num >= 1 && num <= 4) {
                result[num] = item;
            }
        };
        const loop = (list) => {
            if (!list || !list.length) {
                return;
            }
            for (let i = 0; i < list.length; i++) {
                handle(list[i]);
                loop(list[i].children);
            }
        };
        loop(r);
        return Promise.resolve(result);
    });
};
exports.getIndexIframeUrl = () => {
    let url = '';
    const loop = (list) => {
        if (!list || !list.length) {
            return;
        }

        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (item.folderId === config.indexIframeFolderId) {
                let prefix = '?url=';
                let p = item.moduleUrl.indexOf(prefix);
                url = item.moduleUrl.substr(p + prefix.length);
                break;
            }
            loop(item.children);
        }
    };
    
    return exports.getMenuOnce().then((r) => {
        loop(r);
        return url ? Promise.resolve(url) : Promise.reject();
    });
};
exports.getMenu = function (type = 'common') {
    let path = '/menu/getMenu';
    if (mock) {
        return fetch1(ajaxUrlBase + `${path}-${type}.json`);
    }
    return fetch2(path, {
        type
    });
};

exports.getHomeFirstLine = () => {
    return fetch2('/firstPage/firstLineData');
};

exports.getUserLabelText = () => {
    return fetch3('/firstPage/userLabelText');
};
exports.getUserLabelChart1 = (p) => {
    return fetch2('/firstPage/userLabelChart1', p);
};
exports.getUserLabelChart2 = () => {
    return fetch3('/firstPage/userLabelChart2');
};
exports.getUserLabelChart3 = () => {
    return fetch2('/firstPage/userLabelChart3');
};
exports.getMarketingResource1 = () => {
    return fetch2('/firstPage/marketingResource1');
};
exports.getMarketingResource2 = () => {
    return fetch2('/firstPage/marketingResource2');
};
exports.getMarketingAssessment = () => {
    return fetch2('/firstPage/marketingAssessment');
};

exports.editEventSet = function (json) {
    let url = ajaxUrlBase + eventPath + '/editEventSet.action';
    let str = JSON.stringify(json);
    // store.set('eventset', str);
    return post(url, {
        json: str
    });
};
exports.addEventSet = (json) => {
    let url = ajaxUrlBase + eventPath + '/addNewEventSet.action';
    let str = JSON.stringify(json);
    // store.set('eventset', str);
    return post(url, {
        json: str
    });
};

exports.getEventConfig = Fetch.once(() => {
    return fetch2(eventPath + '/getEventBaseInfo');
});
exports.getEventConditionConfig = () => {
    return exports.getEventConfig().then((result) => {
        return result.calcPrinc
            ? Promise.resolve(result.calcPrinc)
            : Promise.reject(result);
    });
};
exports.getEventCoreConfig = () => {
    return exports.getEventConfig().then((result) => {
        if (!result.evtSrcs) {
            return Promise.reject(result);
        }
        let arr = result.evtSrcs;
        let o = {};
        // 数组转对象
        arr && arr.forEach((item) => {
            o[item.evtSrcId] = item;
            item.ruleMap = {};
            item.rules && item.rules.forEach((v) => {
                item.ruleMap[v.atomId] = v;
            });
        });
        return Promise.resolve({arr, obj: o});
    });
};
exports.getEventSetPageConfig = (id) => {
    if (mock) {
        return fetch2(eventPath + `/getEvtSetPageCfg_${id}`);
    }
    return fetch2(eventPath + '/getEvtSetPageCfg', {
        evtSetId: id
    })
};
exports.getEventDetail = (id) => {
    return fetch2(eventPath + '/getEvtSetList', {
        evtSetId: id
    });
};

exports.getArgsByAtomId = Fetch.onceParam((id) => {
    if (mock) {
        return fetch1(ajaxUrlBase + eventPath + `/getArgsByAtomId-${id}.json`);
    }
    return fetch1(ajaxUrlBase + eventPath + `/getArgsByAtomId.action`, {
        atomId: id
    });
});
exports.products = function (p) {
    return fetch2('/dataplus/products', p);
};

exports.postBase64 = function (data) {
    let url = ajaxUrlBase + '/dataplus/uploadImg.action';
    let param = data;
    if (typeof data === 'string') {
        param = {file: data};
    }
    return post(url, param);
};

exports.saveWapConfig = function (json) {
    let url = ajaxUrlBase + '/dataplus/save.action';
    return post(url, json);
};
exports.saveToolbar = function (json) {
    let url = ajaxUrlBase + '/toolbar/save.action';
    return post(url, json);
};
exports.saveIVR = function (json) {
    let url = ajaxUrlBase + '/ivr/save.action';
    return post(url, json);
};
exports.saveCallin = function (json) {
    let url = ajaxUrlBase + '/callin/save.action';
    return post(url, json);
};
exports.saveAndlive = function (json) {
    let url = ajaxUrlBase + '/andLifeApp/save.action';
    return post(url, json);
};
exports.saveOfficialWechat = function (json) {
    let url = ajaxUrlBase + '/officialWechat/save.action';
    return post(url, json);
};
exports.saveSuiMarketAssistant = function (json) {
    let url = ajaxUrlBase + '/saleAsistantIn/save.action';
    return post(url, json);
};
exports.saveSuiMarketCall = function (json) {
    let url = ajaxUrlBase + '/saleAsistantOut/save.action';
    return post(url, json);
};
exports.saveSuiBoothAssistant = function (json) {
    let url = ajaxUrlBase + '/stallage/save.action';
    return post(url, json);
};
exports.saveOnlineCall = (json) => {
    let url = ajaxUrlBase + '/onlineCall/save.action';
    return post(url, json);
};
exports.saveRealtimeOnline = (json) => {
    let url = ajaxUrlBase + '/realTimeOnline/save.action';
    return post(url, json);
};
exports.getTouchData = function () {
    let r = exports.getWapConfig();
    if (r && r.data && r.data[0]) {
        return r.data[0];
    }
};
exports.getWapConfig = function () {
    if (window.touchData) {
        try {
            let r = JSON.parse(window.touchData);
            return r;
        } catch(e) {
            return null;
        }
    }
};

exports.logout = function () {
    return fetch1(ajaxUrlBase + '/login/logout.action');
};

exports.getContactList = function (p) {
    return fetch2('/contact/getInfoList', p);
};

exports.getContactSelect = Fetch.once(() => {
    return fetch2('/contact/getContactSelect');
});
exports.getVgopMarketTreeList = (p) => {
    if (mock) {
        return fetch1(ajaxUrlBase + `/vgop/queryMarketPolicyListTd.json`, p);
    }
    let url = [
        vendorUrlPrefix,
        `/iop/marketing/queryMarketPolicyListTd?${vendorJSONPCallback}=?`
        // `/iop/marketing/queryMarketTreeList?${vendorJSONPCallback}=?`
    ].join('');
    return jsonp(url, p);
};
exports.getMarketList = (p) => {
    return exports.getVgopMarketTreeList(p).then((l) => {
        if (!l || !l.length) {
            return Promise.reject(l);
        }
        return l;
    });
};
exports.postChannelInfo = (p) => {
    let url = [
        vendorUrlPrefix,
        `/iop/marketing/maintainPolicyChannelInfo?${vendorJSONPCallback}=?`
    ].join('');
    return jsonp(url, p).then((r) => {
        if (!r) {
            return Promise.reject(r);
        }
        if (r.code) {
            return Promise.reject(r);
        }
        return r;
    });
};

exports.getSessionUser = (p) => {
    return fetch4('/login/getSessionUser', p);
};

exports.getLoginStat = (p) => {
    return fetch2('/log/report', p);
};
exports.getChannelInfo = (p) => {
    return fetch2('/event/getChannelInfo', p);
};
exports.saveChannelInfo = (p) => {
    let url = ajaxUrlBase + '/event/saveChannelInfo.action';
    
    return post(url, p);
};
exports.queryChannelPasser = (p) => {
    return fetch2('/channelPasser/query', p);
};
exports.saveChannelPasser = (p) => {
    let url = ajaxUrlBase + '/channelPasser/save.action';
    return post(url, p);
};
exports.gisStationLacCells = (p) => {
    if (mock) {
        return fetch0(ajaxUrlBase + `/station/getLacCells.json`, p);
    }
    let url = config.GIS_URL_BASE + '/station/getLacCells.do';
    return jsonp(url, p)
};
// 营销语模板列表
exports.getMarketSentenceList = (p) => {
    if (mock) {
        return fetch1(ajaxUrlBase + `/vgop/marketingManageTD.json`, p);
    }
    let url = [
        vendorUrlPrefix,
        `/iop/marketcontent/marketingManageTD?${vendorJSONPCallback}=?`
    ].join('');
    return jsonp(url, p);
};
// 营销活动模板列表
exports.getPolicyTemplateList = (p) => {
    if (mock) {
        return fetch1(ajaxUrlBase + `/vgop/getPolicyTemplateListTD.json`, p);
    }
    let url = [
        vendorUrlPrefix,
        `/iop/marketing/getPolicyTemplateListTD?${vendorJSONPCallback}=?`
    ].join('');
    return jsonp(url, p);
};
// 营销活动模板详情
exports.getPolicyTemplateInfo = (p) => {
    if (mock) {
        return fetch1(ajaxUrlBase + `/vgop/getPolicyTemplateInfoTD.json`, p);
    }
    let url = [
        vendorUrlPrefix,
        `/iop/marketing/getPolicyTemplateInfoTD?${vendorJSONPCallback}=?`
    ].join('');
    return jsonp(url, p);
};
exports.getStaticInfo = (keyName) => {
    let param = {keyName};
    if (mock) {
        return fetch1(ajaxUrlBase + `/getStaticInfo/${keyName}.json`, param);
    }
    return fetch1(ajaxUrlBase + '/realTimeOnline/getStaticInfo.action', param);
};
exports.getModelInfo = (param) => {
    if (mock) {
        if (param.modelId) {
            return fetch1(ajaxUrlBase + '/modelInfo/selModelInfo.json', param);
        } else {
            return fetch1(ajaxUrlBase + '/modelInfo/selModelInfoAll.json', param);
        }
    }
    return fetch1(ajaxUrlBase + '/modelInfo/selModelInfo.action', param);
};
exports.getTouchConfigInfo = (p) => {
    const path = '/touchConfig/get';
    if (mock) {
        return fetch1(ajaxUrlBase + `${path}_${p.svcType}.json`, p);
    }
    p._ = salt();
    return fetch1(ajaxUrlBase + `${path}.action`, p);
};
exports.putDHXTouchInfo = function (param) {
    const url = Config.vendorUrlBase + '/iop/iop/newsubchannelmanage/saveSubChannel';
    const headers = {
        'Content-Type': 'application/json'
    };
    if (typeof param === 'object') {
        // param = JSON.stringify(param);
    }
    const ajaxParam = {
        url,
        data: param,
        dataType: 'json',
        type: 'GET',
        headers
    };
    return new Promise((resolve, reject) => {
        return $.ajax(ajaxParam).success((json) => {
            json ? resolve(json) : reject(json);
        }).error(reject);
    });
    // return Fetch.getJSON(url, p);
};
module.exports = exports;
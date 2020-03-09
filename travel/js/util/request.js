
const Promise = require('Promise');
const config = require('global/config');
const Fetch = require('util/fetch.js');
const URL = require('util/url.js');
const MDate = require('lib/mdate.js');
const localCache = require('util/localCache.js');
const MockData = require('util/mock.js');


let mock = config.dev ? true : false;
let local = (URL.query().local === 'rlocal') ? true : false;
// config.root: /TD-nmtravel-web
const chartDataActionPrefix = '/flowmonitor';
const analysisActionPrefix = '/flowanalysis';
const MOCK_PATH = config.staticPath + '/mock';
const REST_PATH = config.root + '/travel';

const randtime = () => {
    return Math.floor(Math.random() * 500) + 150;
};
const getMockSuccess = (data) => {
    LOG('getMockSuccess:', data);
    let j = {success: true};
    return Promise.resolve(data || j);
};
const getJSON1 = (url, param) => {

    return Fetch.getJSON(url, param).then(function (result) {
        if (!result) {
            return Promise.reject();
        }
        if (!result.success) {
            return Promise.reject(result);
        }
        if (!mock) {
            return Promise.resolve(result.data);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(result.data);
            }, Math.random() * 400 + 100);
        });
    });
};
const getJSON2 = (action, param = {}, mockSubfix = '') => {
    let mockAction = action;
    if (mockSubfix) {
        mockAction += '_' + mockSubfix;
    }
    if (mock) {
        return getJSON1(MOCK_PATH + `${mockAction}.json`, param);
    } else if (local) {
        return getJSON1(config.root + `${action}.action`, param);
    } else {
        param.action = action + '.action';
        return getJSON1(config.ajaxPath, param);
    }
};
const getJSON3 = (path, param = {}, mockSubfix = '') => {
    if (mock) {
        if (mockSubfix) {
            path += '_' + mockSubfix;
        }
        return getJSON1(MOCK_PATH + `${path}.json`, param);
    } else {
        return getJSON1(config.root + path, param);
    }
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
// 不走InnerGate
const getActionJSON = (action, param = {}, mockSubfix) => {
    return getMockData(action);
    if (mock) {
        let mockAction = action;
        if (mockSubfix) {
            mockAction += '_' + mockSubfix;
        }
        return getJSON1(MOCK_PATH + `${mockAction}.json`, param);
    }
    return getJSON1(config.root + `${action}.action`, param);
};
const REST = (path, param = [], mockSubfix = '') => {
    if (mock) {
        let subfix = mockSubfix ? ('_' + mockSubfix) : '';
        LOG('getRESTParam:', param);
        return getJSON1(config.root + path + subfix + '.json');
    }
    if (Array.isArray(param)) {
        let p = param.join('/');
        if (p) {
            p = '/' + p;
        }
        return getJSON1(config.root + path + p);
    } else {
        return getJSON1(config.root + path, param);
    }
};
const getREST = (path, param = [], mockSubfix = '') => {
    return getMockData(path);
    if (Array.isArray(param)) {
        let p = param.join('/');
        if (p) {
            p = '/' + p;
        }
        return getJSON1(REST_PATH + path + p);
    } else {
        return getJSON1(REST_PATH + path, param);
    }
};
const getJSONP = (url, param) => {
    return Fetch.jsonp(url, param).then(function (result) {
        if (!result || !result.success) {
            return Promise.reject(result);
        }
        return Promise.resolve(result.data);
    });
};

const post1 = (action, param = {}) => {
    let url = config.ajaxPath + '?' + URL.buildQuery({action: action + '.action'});
    return Fetch.post(url, param);
};

const post2 = (action, param = {}) => {
    const url = config.root + action + '.action';
    return Fetch.post(url, param);
};

const PinyinHash = {
    '阿': 'a',
    '巴': 'ba',
    '包': 'bao',
    '赤': 'chi',
    '鄂': 'e',
    '呼': 'hu',
    '乌': 'wu',
    '通': 'tong',
    '锡': 'xi',
    '兴': 'xing'
};
let adaptDateParam = (str) => {
    if (!str) {
        return str;
    }
    if (typeof str === 'object') {
        if (str.deal_date) {
            str.deal_date = adaptDateParam(str.deal_date);
        }
        if (str.start_date) {
            str.start_date = adaptDateParam(str.start_date);
        }
        if (str.startDate) {
            // 开始+结束日期
            str.start_date = adaptDateParam(str.startDate);
            delete str.startDate;
        }

        if (str.end_date) {
            str.end_date = adaptDateParam(str.end_date);
        }
        if (str.endDate) {
            str.end_date = adaptDateParam(str.endDate);
            delete str.endDate
        }
        return str;
    }
    return str.replace(/\-/g, '');
};
var exports = {
    getJSON2,
    getJSON3,
    REST,
    getREST,
    getActionJSON
};

exports.getPinyin = function (word) {
    return PinyinHash[word.charAt(0)] || '';
};
exports.getRealtimeDayPeople = (p) => {
    return getREST('/realtime/day/people', p);
};
exports.getAttractionRealtime1 = (id) => {
    // 架构升级
    return getREST('/realtime/day/people/get', [id]);
};
exports.getAttractionRealtime2 = (id) => {
    return getREST('/realtime/day/move/get', [id]);
};
exports.getCityRealtime1 = (id) => {
    return getActionJSON(chartDataActionPrefix + '/scenAreaUserCurrentDay', {
        scenery_city: id
    });
};
exports.getCityRealtime2 = (id) => {
    return exports.getCityFirstAttraction(id).then((attraction) => {
        return exports.getAttractionRealtime2(attraction.placeID)
    });
};

const buildAnalysisCommonParam = (path, o) => {
    let param = {
        user_id: o.user_id
    };
    if (o.startDate && !o.endDate) {
        // 单日期
        param.deal_date = adaptDateParam(o.startDate);
    } else if (o.startDate && o.endDate) {
        // 开始+结束日期
        param.start_date = adaptDateParam(o.startDate);
        param.end_date = adaptDateParam(o.endDate);
    }
    var action = path + '.action';
    if (path.indexOf('/') < 0) {
        action = analysisActionPrefix + '/' + action;
        path = analysisActionPrefix + '/' + path;
    }
    return {
        param,
        newPath: path,
        action
    };
};

exports.getAttractionAnalysisCommon = (path, id, startDate, endDate, user_id) => {
    let {param, action, newPath} = buildAnalysisCommonParam(path, {
        id, startDate, endDate, user_id
    });
    return getMockData(action);
};
exports.getCityAnalysisCommon = (path, id, startDate, endDate, user_id) => {
    let {param, action, newPath} = buildAnalysisCommonParam(path, {
        id, startDate, endDate, user_id
    });
    return getMockData(action);
};
// 地市 - 逗留时间
exports.getCityAnalysisStayTime = (...args) => {
    return exports.getCityAnalysisCommon('scenAreaPeopleStayDate', ...args);
};
// 地市 - 全年人流量
exports.getCityAnalysisUserCommon = (...args) => {
    return exports.getCityAnalysisCommon('scenAreaUserCommon', ...args);
};
// 地市 - 终端品牌
exports.getCityAnalysisUserBrandType = (...args) => {
    return exports.getCityAnalysisCommon('scenAreaUserBrandType', ...args);
};
// 地市 - 消费
exports.getCityAnalysisUserArpuType = (...args) => {
    return exports.getCityAnalysisCommon('scenAreaUserArpuType', ...args);
};
// 地市 - 年龄
exports.getCityAnalysisUserAgeType = (...args) => {
    return exports.getCityAnalysisCommon('scenAreaUserAgeType', ...args);
};
// 地市 - 综合分析
exports.getCityAnalysisUserAllType = (...args) => {
    return exports.getCityAnalysisCommon('scenAreaUserAllType', ...args);
};

// 地市数据分析 - 语音流量分析 - 流量饼图
exports.cityRptNmComeGPRSLevDailyPie = (...args) => {
    return exports.getCityAnalysisCommon('/v2/vwRptNmComeGPRSLevDailyPie', ...args);
};
// 地市数据分析 - 语音流量分析 - 流量柱图
exports.cityRptNmComeGPRSLevDailyBar = (...args) => {
    return exports.getCityAnalysisCommon('/v2/vwRptNmComeGPRSLevDailyBar', ...args);
};
// 地市数据分析 - 语音流量分析 - 语音饼图
exports.cityRptNmComeGSMLevDailyPie = (...args) => {
    return exports.getCityAnalysisCommon('/v2/vwRptNmComeGSMLevDailyPie', ...args);
};
// 地市数据分析 - 语音流量分析 - 语音柱图
exports.cityRptNmComeGSMLevDailyBar = (...args) => {
    return exports.getCityAnalysisCommon('/v2/vwRptNmComeGSMLevDailyBar', ...args);
};

// 景区 - 逗留时间统计
exports.getAttractionAnalysisStaytime = (...args) => {
    return exports.getAttractionAnalysisCommon(
        'sceneryPeopleStayDate', ...args
    );
};
// 景区 - 人流量统计
exports.getAttractionAnalysisCount = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountCurrentWeek', ...args);
};
// 景区 - 客流来源 - 省外
exports.getAttractionSource = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountOtherProvince', ...args);
};
// 景区 - 客流来源 - 省内
exports.getAttractionSource2 = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountCurrentProvince', ...args);
};
// 景区 - 客流来源 - 区县
exports.getAttractionSource3 = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountCountyLvl', ...args);
};
// 景区数据分析 客流来源 境外
exports.getAttractionSourceCountry = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountCountry', ...args);
};
// 景区来源-省外：实时
exports.getAttractionSource1 = (id, startDate, endDate, user_id) => {
    let path = 'sceneryCountOtherProvince1';
    let {param, action, newPath} = buildAnalysisCommonParam(path, {
        id, startDate, endDate, user_id
    });
    param.scenery_id = id;
    return getJSON2(newPath, param);
    // return exports.getAttractionAnalysisCommon('sceneryCountOtherProvince1', ...args);
};
// 景区来源-省内：实时
exports.getAttractionSource12 = (id, startDate, endDate, user_id) => {
    let path = 'sceneryCountCurrentProvince1';
    let {param, action, newPath} = buildAnalysisCommonParam(path, {
        id, startDate, endDate, user_id
    });
    param.scenery_id = id;
    return getJSON2(newPath, param);
    // return exports.getAttractionAnalysisCommon('sceneryCountCurrentProvince1', ...args);
};
// 景区 - 综合分析
exports.getAttractionCountAllType = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountAllType', ...args);
};
// 景区 - 驻留
exports.getAttractionPeopleVisitDate = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryPeopleVisitDate', ...args);
};
// 景区 - 品牌
exports.getAttractionCountPhoneBrand = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountPhoneBrand', ...args);
};
// 景区 - ARPU
exports.getAttractionCountArpuType = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountArpuType', ...args);
};
// 景区 - 年龄
exports.getAttractionCountAgeType = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountAgeType', ...args);
};
// 景区数据分析 - 游客构成分析 - 单项分析 - 流量分析 - 饼图
exports.vwRptNmComeGPRSLevDailyPie = (...args) => {
    return exports.getAttractionAnalysisCommon('/v2/vwRptNmComeGPRSLevDailyPie', ...args);
};
// 景区数据分析 - 游客构成分析 - 单项分析 - 流量分析 - 柱图
exports.vwRptNmComeGPRSLevDailyBar = (...args) => {
    return exports.getAttractionAnalysisCommon('/v2/vwRptNmComeGPRSLevDailyBar', ...args);
};
// 景区数据分析 - 游客构成分析 - 单项分析 - 语音分析 - 饼图
exports.vwRptNmComeGSMLevDailyPie = (...args) => {
    return exports.getAttractionAnalysisCommon('/v2/vwRptNmComeGSMLevDailyPie', ...args);
};
// 景区数据分析 - 游客构成分析 - 单项分析 - 语音分析 - 柱图
exports.vwRptNmComeGSMLevDailyBar = (...args) => {
    return exports.getAttractionAnalysisCommon('/v2/vwRptNmComeGSMLevDailyBar', ...args);
};

// 景区数据分析 - 游客构成分析 - 游客特征分析
exports.vwRptSceneryUserLevDay = (p) => {
    p = adaptDateParam(p);
    return getActionJSON('/v2/vwRptSceneryUserLevDay', p, p.userType);
};
// 景区数据分析 - 游客构成分析 - 互联网偏好分析
exports.vwRptSceneryNetPreferDay = (p) => {
    p = adaptDateParam(p);
    let subfix = p.userType || '0';
    subfix += '_' + p.sumType;
    return getActionJSON('/v2/netPreferDayAll', p, subfix);
};

// 来市数据分析 - 驻留时间分析
exports.rptSiteLongDailyPie = (p) => {
    p = adaptDateParam(p);
    return getActionJSON('/v2/rptSiteLongDailyPie', p, p.home);
};
// 来市数据分析 - 游客来源分析
exports.vwRPTOuterUserDaily = (p) => {
    p = adaptDateParam(p);
    return getActionJSON('/v2/vwRPTOuterUserDaily', p, p.userType);
};
// 来市数据分析 - 假日出行分析
exports.vwRptNmTravelerDaily = (p) => {
    p = adaptDateParam(p);
    return getActionJSON('/v2/vwRptNmTravelerDaily', p, p.userType);
};

// 来市首页 - (时间轴) 客流量排行榜
exports.vwRptCurrentRomaAtDay1 = (p) => {
    return getJSON2('/travelV2/vwRptCurrentRomaAtDay1', p, p.userType);
};
// 来市首页 - (时间轴) 热力图
let vwRptCurrentRomaAtDay2Cache = {};
exports.vwRptCurrentRomaAtDay2 = (p) => {
    p = adaptDateParam(p);
    let str = JSON.stringify(p);
    if (vwRptCurrentRomaAtDay2Cache[str]) {
        return Promise.resolve(vwRptCurrentRomaAtDay2Cache[str]);
    }
    return getJSON2('/travelV2/vwRptCurrentRomaAtDay2', p, p.userType).then((r) => {
        r = r.map((v) => ({
            userNum: v.i,
            lacCellIid: v.v
        }));
        vwRptCurrentRomaAtDay2Cache[str] = r;
        return r;
    });
};

// 出省数据分析 - 客流量分析
exports.vwRptNmOutProvDaily = (...args) => {
    return exports.getCityAnalysisCommon('/v2/vwRptNmOutProvDaily', ...args);
};
// 出省数据分析 - 游客去向分析
exports.vwRptNmOutProvDailyMap = (...args) => {
    return exports.getCityAnalysisCommon('/v2/vwRptNmOutProvDailyMap', ...args);
};
// 出省数据分析 - 游客驻留时长分析
exports.rptNmOutSiteLongPie = (p) => {
    p = adaptDateParam(p);
    return getActionJSON('/v2/rptNmOutSiteLongPie', p);
};

// 互联网偏好分析 - 词云
exports.wordCloud = (p) => {
    p = adaptDateParam(p);
    return getActionJSON('/v2/wordCloud', p);
};

// 获取城市实时客流数据 (for table)
exports.getCityTableData = () => {
    return getREST('/realtime/current/get/sum');
};
// 获取城市列表客流数据 (for table)
exports.getAttractionList = (cityId) => {
    return getMockData('/realtime/current/get_city');
    // return getREST('/realtime/current/get', [cityId], 'city');
};
// 获取城市列表客流数据 (for hot areas)
exports.getHotAreas = (cityId) => {
    return getActionJSON('/travel/core', {
        scenery_city: cityId,
        user_id: config.user.id
    }, 'city');
};
// 获取景区客流数据 (概况)
exports.getAttractionDetail = (id) => {
    return exports.getCityIdByAttractionId(id).then((cityId) => {
        return getREST('/realtime/current/get', [cityId, id]);
    });
};
exports.getAttrctionDetailOne = (id) => {
    return exports.getAttractionDetail(id);
};
// 获取城市列表 (for city select)
exports.getCities = Fetch.once(() => {
    return getActionJSON('/travel/cities', {
        user_id: config.user.id
    });
});
// 获取景区人数 (for gis)
exports.getMapCities = Fetch.once(() => {
    return getREST('/realtime/current/get/all')
});
exports.getCityById = (id) => {
    return exports.getCitiesMap().then((map) => {
        return map[id] ? Promise.resolve(map[id]) : Promise.reject();
    });
};
exports.getCityIdByAttractionId = (id) => {
    return exports.getCities().then((result) => {
        for (let i = 0; i < result.length; i++) {
            let city = result[i];
            for (let j = 0; j < city.places.length; j++) {
                if (city.places[j].placeID == id) {
                    return city.placeID;
                }
            }
        }
        return Promise.reject();
    });
};
exports.getCitiesMap = () => {
    return exports.getCities().then((result) => {
        var hash = {};
        result.forEach((city) => {
            if (city.placeID) {
                hash[city.placeID] = city;
            }
            city.places.forEach((item) => {
                item.parent = city;
                hash[item.placeID] = item;
            });
        });

        return Promise.resolve(hash);
    });
};

// 获取所有地市人数最多的top3景区
exports.getAllAttractionsTop3 = () => {
    return exports.getMapCities().then(function (result) {
        var list = [];
        result.forEach((city) => {
            if (!city.places) {
                return;
            }
            // 取前3
            list = list.concat(city.places.slice(0, 3));
        });

        return Promise.resolve(list);
    });
};
// 获取某地市下的所有景区
exports.getAttractionsOfCity = (cityId) => {
    return exports.getCities().then((result) => {
        for (var i = 0; i < result.length; i++) {
            if (result[i].placeID === cityId) {
                return Promise.resolve(result[i].places || []);
            }
        }
        return Promise.reject();
    });
};

exports.getCityFirstAttraction = (cityId) => {
    return exports.getCities().then((result) => {
        for (var i = 0; i < result.length; i++) {
            if (result[i].placeID === cityId) {
                return result[i].places
                    ? Promise.resolve(result[i].places[0])
                    : Promise.reject();
            }
        }
        return Promise.reject();
    });
};
// 获取景区
exports.getAttractionById = (id) => {
    return exports.getCitiesMap().then((result) => {
        if (result[id]) {
            return Promise.resolve(result[id]);
        } else {
            return Promise.reject(result);
        }
    });
};
// 搜索地市、景区
exports.searchPlace = (keyword) => {
    let userId = config.user.id;
    if (mock) {
        return getJSON1(MOCK_PATH + `/travel/place.json`, {
            scenery_name: keyword,
            user_id: userId
        });
    }
    return getREST('/realtime/scenery/autocomplate', [userId, keyword]);
};

exports.fetch = (options = {}) => {
    var p = $.Deferred();
    $.ajax({
        url: '/TD-nmtravel-web/InnerGate',
        dataType: 'json',
        data: options.data,
        success: function (result) {
            result.success ? p.resolve(result.data, result) : p.reject(result);
        },
        error: function () {
            p.reject();
        }
    });
    return p.promise();
};
exports.fetch2 = function (url, options = {}) {
    var p = $.Deferred();
    $.ajax({
        url,
        dataType: 'json',
        data: options.data || {},
        success: function (result) {
            result.data ? p.resolve(result.data) :　p.reject();
        },
        error: function () {
            p.reject();
        }
    });
    return p.promise();
};

exports.getBigBoard = function (p) {
    return getActionJSON('/travel/bigBoard', p);
};

exports.getGlobe = (id) => {
    return getActionJSON('/travel/bigEarth', {
        scenery_id: (id || 7112)
    });
};
exports.getGlobe2 = () => {
    return $.getJSON(MOCK_PATH + '/data-1491909692146-S1NH24cTe.json');
};

exports.getBigShowInOut = (id) => {
    return exports.getAttractionRealtime2(id);
};

exports.getBigShowRealtimeUser = (id) => {
    return exports.getAttractionRealtime1(id);
};

exports.getBigShowPie1 = (...args) => {
    // return getJSON1(mockAjaxPath + '/scenAreaUserBrandType.json');
    return exports.getAttractionCountPhoneBrand(...args);
};
exports.getBigShowPie2 = (...args) => {
    // return getJSON1(mockAjaxPath + '/scenAreaUserArpuType.json');
    return exports.getAttractionCountArpuType(...args);
};
exports.getBigShowPie3 = (...args) => {
    // return getJSON1(mockAjaxPath + '/scenAreaUserAgeType.json');
    return exports.getAttractionCountAgeType(...args);
};
let mockAjaxPath = './mock';
exports.getBigShowStayTime = (...args) => {
    return getJSON1(mockAjaxPath + `/scenAreaPeopleStayDate.json`);
};
exports.gitBigShowAllType = (...args) => {
    // return getJSON1(mockAjaxPath + `/scenAreaUserAllType.json`);
    return exports.getAttractionCountAllType(...args);
};
exports.gitBigShowAllType1 = () => {
    return exports.getCityAnalysisUserAllType();
};
exports.gitBigShowAllType2 = () => {
    return exports.getCityAnalysisUserAllType();
};

exports.getHeatMap = (p) => {
    return getJSON2('/travel/heatMap', p);
};

exports.getSelectSceneryAlarm = (p) => {
    return getActionJSON('/sceneryInfo/selectSceneryAlarm', p);
};

exports.updateSceneryAlarm = (p) => {
    if (mock) {
        return getMockSuccess();
    }
    return getActionJSON('/sceneryInfo/updateSceneryAlarm', p);
};

exports.getAlarmMessage = (p) => {
    return getActionJSON('/sceneryInfo/selectAlarmMessage', p);
};
exports.deleteAlarmMessage = (p) => {
    if (mock) {
        return getMockSuccess();
    }
    return getActionJSON('/sceneryInfo/deleteAlarmMessage', p);
};
exports.updateAlarmMessage = (p) => {
    if (mock) {
        return getMockSuccess();
    }
    return getActionJSON('/sceneryInfo/updateAlarmMessage', p);
};
exports.changePassword = (p) => {
    if (mock) {
        return getMockSuccess({success: true, data: p});
    }
    return getActionJSON('/user/updatePassword', p);
};
exports.updateUserName = (p) => {
    if (mock) {
        return getMockSuccess();
    }
    return getActionJSON('/user/updateUserName', p);
};
exports.addUser = (p) => {
    if (mock) {
        return getMockSuccess({userId:'7020170715113124'});
    }
    return getActionJSON('/user/insertUserInfo', p);
};
exports.deleteUser = function (p) {
    if (mock) {
        return getMockSuccess();
    }
    return getActionJSON('/user/deleteUserInfo', p);
};
exports.getAuthUsers = function (p) {
    return getActionJSON('/user/selectUsers', p);
};

exports.getAuthParam = function () {
    let p = {};
    if (config.user.flag === 'city') {
        p.cityId = config.user.code;
    } else if (config.user.flag === 'scenery') {
        p.sceneryId = config.user.code;
    }
    return p;
};
exports.getAttractionPath = function (p) {
    return getActionJSON('/travel/path', p);
};
exports.getCityAccounts = function (p) {
    return getActionJSON('/cityAccount', p);
};
// 景区管理 - 获取景区列表
exports.getSceneryInfo = (p) => {
    return getActionJSON('/sceneryInfo/getSceneryInfo', p);
};
// 景区管理 - 获取基站信息
exports.getSceneryDetail = (p) => {
    return getActionJSON('/sceneryInfo/getSceneryDetail', p);
};
const debounceRequest = (func) => {
    func._debounceRequestId = 0;
    return function () {
        func._debounceRequestId++;
        var args = Array.prototype.slice.call(arguments);
        var p = func.apply(this, args);
        var myId = func._debounceRequestId;
        return p.then((r) => {
            // 对比id
            if (myId === func._debounceRequestId) {
                return r;
            }
            // Will Never Excute
            return new Promise(() => {});
        });
    };
};
exports.getCityChildrenAccounts = debounceRequest((p) => {
    return getActionJSON('/user/selectUserRole', p);
});
exports.updateUserRole = function (p) {
    if (mock) {
        LOG('param:', p);
        return getMockSuccess();
    }
    return post2('/user/updateUserRole', p);
};
exports.getStaticCityList = (o = {}) => {
    let list = [
        {id: 471, name: '呼和浩特'},
        {id: 470, name: '呼伦贝尔'},
        {id: 472, name: '包头'},
        {id: 473, name: '乌海'},
        {id: 474, name: '乌兰察布'},
        {id: 475, name: '通辽'},
        {id: 476, name: '赤峰'},
        {id: 477, name: '鄂尔多斯'},
        {id: 478, name: '巴彦淖尔'},
        {id: 479, name: '锡林郭勒'},
        {id: 482, name: '兴安盟'},
        {id: 483, name: '阿拉善'}
    ];
    if (o.withAll) {
        list.unshift({id: 400, name: '全区'});
    }

    return list;
};
exports.getStaticCityOptions = (o) => {
    return exports.getStaticCityList(o).map((v) => {
        return {
            value: v.id,
            text: v.name
        };
    });
};

/**
 * 数据请求封装
 */
exports.r1 = (url, p = {}, m) => {
    p = adaptDateParam(p);
    return getActionJSON(url, p, m);
};
let UUID_SPACE = {};
exports.U = (p, name = 'space') => {
    UUID_SPACE[name] = UUID_SPACE[name] || 0;
    UUID_SPACE[name]++;
    let uuid = UUID_SPACE[name];
    return p.then((result) => {
        if (uuid === UUID_SPACE[name]) {
            return result;
        } else {
            // will never resolve
            return new Promise(() => {});
        }
    });
};
// 获取地市的区县
exports.getCountyByCityID = Fetch.onceParam((cityId) => {
    return getActionJSON('/sceneryInfo/getCountyByCityID', {
        scenery_city: cityId
    });
});
// 新增景区
exports.insertSceneryInfoExtend = (p) => {
    if (mock) {
        return getMockSuccess({
            success: true,
            data:{sceneryID: 7000}
        });
    }
    return post1('/sceneryInfo/insertSceneryInfoExtend', {
        json: JSON.stringify(p)
    });
};
// 编辑景区
exports.editSceneryInfoExtend = (p) => {
    if (mock) {
        return getMockSuccess({
            success: true,
            data: {sceneryID: 7000}
        });
    }
    return post1('/sceneryInfo/editSceneryInfoExtend', {
        json: JSON.stringify(p)
    });
};
// 获取景区信息(编辑)
exports.getSceneryInfoExtend = (id) => {
    let p = {scenery_id: id};
    return getActionJSON('/sceneryInfo/getSceneryInfoExtend', p).then((r) => {
        if (r && r[0]) {
            return r[0];
        }
        return Promise.reject(r);
    });
};
exports.fetchHome = () => {
    return Fetch.getHTML(config.root);
};

exports.sceneryRelationAnalyze = (p) => {
    return getActionJSON('/v2/sceneryRelationAnalyze', p);
};
exports.fetchGisToken = () => {
    if (mock) {
        var req = getJSON1(MOCK_PATH + `/gisToken.json`);
    } else {
        req = getJSON1(config.root + `/gisToken`);
    }
    return req;
};
module.exports = exports;
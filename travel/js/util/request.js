import {$} from 'common';
import Promise from 'Promise';
import config from 'global/config';
import Fetch from 'util/fetch.js';
import URL from 'util/url.js';
let global = window.global || {};
let mock = true;

let local = false;
if (URL.query().local === 'rlocal') {
    local = true;
}
let ajaxPath = config.ajaxPath;
let chartDataActionPrefix = '/flowmonitor';
let analysisActionPrefix = '/flowanalysis';

if (mock) {
    ajaxPath = './mock';
} else if (local) {
    ajaxPath = config.root;
}

let randtime = () => {
    return Math.floor(Math.random() * 500) + 150;
};
let getMockSuccess = () => {
    let j = {success: true};
    return Promise.resolve(j);
};
let getJSON1 = (url, param) => {
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
    if (mock) {
        let mockAction = action;
        if (mockSubfix) {
            mockAction += '_' + mockSubfix;
        }
        return getJSON1(ajaxPath + `${mockAction}.json`, param);
    } else if (local) {
        return getJSON1(ajaxPath + `${action}.action`, param);
    } else {
        param.action = action + '.action';
        return getJSON1(ajaxPath, param);
    }
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
    return str.replace(/\-/g, '');
};
var exports = {};
exports.getPinyin = function (word) {
    return PinyinHash[word.charAt(0)] || '';
};
exports.getAttractionRealtime1 = (id) => {
    return getJSON2(chartDataActionPrefix + '/scenUserCurrerntDay', {
        scenery_id: id
    });
};
exports.getAttractionRealtime2 = (id) => {
    return getJSON2(chartDataActionPrefix + '/sceneryInAndOut', {
        scenery_id: id
    });
};
exports.getCityRealtime1 = (id) => {
    return getJSON2(chartDataActionPrefix + '/scenAreaUserCurrentDay', {
        scenery_city: id
    });
};
exports.getCityRealtime2 = (id) => {

    return exports.getCityFirstAttraction(id).then((attraction) => {
        return getJSON2(chartDataActionPrefix + '/sceneryInAndOut', {
            scenery_id: attraction.placeID
        });
    });
};

exports.getAttractionAnalysisCommon = (path, id, startDate, endDate) => {
    if (mock) {
        return getJSON1(ajaxPath + `/${path}.json`);
    }
    var action = analysisActionPrefix + `/${path}.action`;
    var param = {
        scenery_id: id
    };
    if (startDate && !endDate) {
        param.deal_date = adaptDateParam(startDate);
    } else if (startDate && endDate) {
        param.start_date = adaptDateParam(startDate);
        param.end_date = adaptDateParam(endDate);
    }

    if (local) {
        return getJSON1(config.root + action, param);
    }
    param.action = action;
    return getJSON1(ajaxPath, param);
};
exports.getCityAnalysisCommon = (path, id, startDate, endDate) => {
    if (mock) {
        return getJSON1(ajaxPath + `/${path}.json`);
    }
    var action = analysisActionPrefix + `/${path}.action`;
    var param = {
        scenery_city: id
    };
    // 单日期和区间
    if (startDate && !endDate) {
        param.deal_date = adaptDateParam(startDate);
    } else {
        param.start_date = adaptDateParam(startDate);
        param.end_date = adaptDateParam(endDate);
    }
    if (local) {
        return getJSON1(config.root + action, param);
    }
    param.action = action;
    return getJSON1(ajaxPath, param);
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
// 景区来源：bt_book_fair
exports.getAttractionSource1 = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountOtherProvince1', ...args);
};
exports.getAttractionSource12 = (...args) => {
    return exports.getAttractionAnalysisCommon('sceneryCountCurrentProvince1', ...args);
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

// 获取城市实时客流数据 (for table)
exports.getCityTableData = () => {
    return getJSON2('/travel/board');
};
// 获取城市列表客流数据 (for table)
exports.getAttractionList = (cityId) => {
    return getJSON2('/travel/board', {
        scenery_city: cityId
    }, 'city');
};
// 获取景区客流数据 (概况)
exports.getAttrctionDetail = (id) => {
    return getJSON2('/travel/board', {
        scenery_id: id
    }, 'attraction');
};
exports.getAttrctionDetailOne = (id) => {
    return exports.getAttrctionDetail(id).then((result, state) => {
        if (result && result.length) {
            return Promise.resolve(result[0]);
        } else {
            return Promise.reject(result, state);
        }
    });
};
// 获取城市列表 (for city select)
exports.getCities = Fetch.once(() => {
    return getJSON2('/travel/cities');
});
exports.getCityById = (id) => {
    return exports.getCitiesMap().then((map) => {
        return map[id] ? Promise.resolve(map[id]) : Promise.reject();
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
exports.getAllAttractionsTop3 = () => {
    return exports.getCities().then(function (result) {
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
    var action = '/travel/place.action';
    if (local) {
        return getJSON1(ajaxPath + action, {
            scenery_name: keyword
        });
    } else {
        let p = {
            action: action,
            scenery_name: keyword
        };
        if (global.city) {
            p.scenery_id = global.city;
        }
        return getJSON1(ajaxPath, p);
    }
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

exports.getBigBoard = function () {
    return getJSON2('/travel/bigBoard');
};

exports.getGlobe = (id) => {
    return getJSON2('/travel/bigEarth', {
        scenery_id: (id || 7112)
    });
};
exports.getGlobe2 = () => {
    return $.getJSON(ajaxPath + '/data-1491909692146-S1NH24cTe.json');
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
    // return exports.getCityAnalysisStayTime(...args);
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
    return getJSON2('/sceneryInfo/selectSceneryAlarm', p);
};

exports.updateSceneryAlarm = (p) => {
    if (mock) {
        return getMockSuccess();
    }
    return getJSON2('/sceneryInfo/updateSceneryAlarm', p);
};

exports.getAlarmMessage = (p) => {
    return getJSON2('/sceneryInfo/selectAlarmMessage', p);
};
exports.deleteAlarmMessage = (p) => {
    if (mock) {
        return getMockSuccess();
    }
    return getJSON2('/sceneryInfo/deleteAlarmMessage', p);
};
exports.updateAlarmMessage = (p) => {
    if (mock) {
        return getMockSuccess();
    }
    return getJSON2('/sceneryInfo/updateAlarmMessage', p);
};

export default exports;
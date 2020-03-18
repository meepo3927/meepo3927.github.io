
import Promise from 'Promise';
import config from 'global/config';
import Fetch from 'util/fetch.js';
import URL from 'util/url.js';
import MockData from 'util/mock.js';

let global = window.global || {};
let mock = true;

let local = false;
if (URL.query().local === 'rlocal') {
    local = true;
}
let ajaxPath = config.ajaxPath;
let chartDataActionPrefix = '/flowmonitor';

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
const getMockData = (path) => {
    if (MockData[path]) {
        const result = MockData[path].data || MockData[path];
        return Promise.resolve(result);
    }
    console.log('getMockData:' + path);
    return Promise.reject();
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
    const path = mockSubfix ? (action + '_' + mockSubfix) : action;
    return getMockData(path);
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
var exports = {};
exports.getPinyin = function (word) {
    return PinyinHash[word.charAt(0)] || '';
};
exports.getAttractionAnalysisCommon = (path, id, startDate, endDate) => {
    return getMockData(path);
};
exports.getCityAnalysisCommon = (path, id, startDate, endDate) => {
    return getMockData(path);
};

// 地市 - 综合分析
exports.getCityAnalysisUserAllType = () => {
    return getMockData('scenAreaUserAllType');
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
    return getMockData('data-S1NH24cTe')
};

exports.getBigShowInOut = (id) => {
    return getJSON2(chartDataActionPrefix + '/sceneryInAndOut');
};

exports.getBigShowRealtimeUser = (id) => {
    return getJSON2(chartDataActionPrefix + '/scenUserCurrerntDay');
};

exports.getBigShowPie1 = (...args) => {
    return exports.getAttractionCountPhoneBrand(...args);
};
exports.getBigShowPie2 = (...args) => {
    return exports.getAttractionCountArpuType(...args);
};
exports.getBigShowPie3 = (...args) => {
    return exports.getAttractionCountAgeType(...args);
};
let mockAjaxPath = './mock';
exports.getBigShowStayTime = (...args) => {
    return getMockData(`scenAreaPeopleStayDate`);
};
exports.gitBigShowAllType = (...args) => {
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

export default exports;
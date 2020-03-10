/**
 * 请求数据
 */

let Promise = require('promise');
let config = require('config');
let URL = require('util/url');
let Fetch = require('util/fetch');
let mock = !config.isProduction;
let ajaxUrlBase = config.ajaxUrlBase;

const handleResult = (result) => {
    if (!result || result.success === false) {
        return Promise.reject(result);
    }
    return result;
};
const handleResult2 = (result) => {
    if (!result) {
        return Promise.reject(result);
    }
    if (result.success === true) {
        return result.data;
    }
    if (result.success === undefined && result.data !== undefined) {
        return result.data;
    }
    return Promise.reject(result);
};
const baseFetch = (url, data) => {
    return Fetch.getJSON(url, data).then((result) => {
        return handleResult(result);
    });
};
const fetch1 = (path, param) => {
    
    return baseFetch(`./mock${path}.json`, param);
    
    // return baseFetch(ajaxUrlBase + `${path}`, param);
};
const fetch2 = (path, param) => {
    return fetch1(path, param).then((result) => {
        return handleResult2(result);
    });
};
const post = (path, param) => {
    let url = ajaxUrlBase + path + '.do';
    return Fetch.post(url, param).then((r) => {
        return handleResult(r);
    });
};

const cityIdNameMap = {
    471: '呼和浩特',
    470: '呼伦贝尔',
    472: '包头',
    473: '乌海',
    474: '乌兰察布',
    475: '通辽',
    476: '赤峰',
    477: '鄂尔多斯',
    478: '巴彦淖尔',
    479: '锡林郭勒',
    482: '兴安盟',
    483: '阿拉善'
};
const cityIdNameArray = [];
for (let cityId in cityIdNameMap) {
    if (!cityIdNameMap.hasOwnProperty(cityId)) {
        continue;
    }
    cityIdNameArray.push({
        id: cityId,
        name: cityIdNameMap[cityId]
    });
}
const getNameCityById = (cityId) => {
    return cityIdNameMap[cityId]
};
const exports = {
    fetch1,
    fetch2,
    post,
    citylist: cityIdNameArray,
    getNameCityById
};

module.exports = exports;
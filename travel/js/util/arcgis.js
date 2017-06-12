var config = require('global/config');
var IframeUtil = require('util/iframe');
const STATE_HASH = {
    'ok':    '0',
    'alarm': '1'
};
const CAMTYPE = {
    'province': 2,
    'city': 3,
    'attraction': 1
};
const URL_BASE = config.gisUrlBase + '/travel/showTravel.jsp';
var exports = {};
let getUrlQuery = (list) => {
    var query = '';
    var IDlist = [];
    list = list || [];
    list.forEach((item, index) => {
        item = item || {};
        let id = item.id || item.placeID;
        if (!id) {
            return;
        }
        let i = index + 1;
        let userNum = item.userNum || item.user_num || 0;
        let state = (!item.state || item.state === '正常') ? STATE_HASH.ok : STATE_HASH.alarm;
        let str = `id${i}=${id},${userNum},${state}`;
        IDlist.push(str);
    });
    query += IDlist.join('&');
    return query;
};

exports.getUrl = (list, level, options = {}) => {
    if (config.dev) {
        return 'about:blank';
    }
    let query = getUrlQuery(list);
    let camtype = CAMTYPE[level] || CAMTYPE.province;
    let url = `${URL_BASE}?${query}&camtype=${camtype}`;
    if (options.cityId) {
        url += `&cityid=${options.cityId}`;
    }
    return url;
};
exports.sendEvent = (list, level = 'province', options = {}) => {
    var data = {};
    list = list || [];
    list.forEach((item, index) => {
        item = item || {};
        let id = item.id || item.placeID;
        if (!id) {
            return;
        }
        let i = index + 1;
        let userNum = item.userNum || item.user_num || 0;
        let state = (!item.state || item.state === '正常') ? STATE_HASH.ok : STATE_HASH.alarm;
        // let str = `id${i}=${id},${userNum},${state}`;
        data['id' + i] = {
            id, userNum, state
        };
    });
    if (options.cityId) {
        data.cityId = options.cityId;
    }

    IframeUtil.send('render_' + level, data);
};
exports.sendHeatmap = (list, level, options = {}) => {
    var data = {};
    list = list || [];
    list.forEach((item, index) => {
        let i = index + 1;
        data['id' + i] = item;
    });
    if (options.cityId) {
        data.cityId = options.cityId;
    }
    let eventName = `render_${level}_heatmap`;
    // LOG(eventName, data);
    IframeUtil.send(eventName, data);
};
exports.getUrlQuery = getUrlQuery;
module.exports = exports;
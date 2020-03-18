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
const formatItem = (item) => {
    if (!item) {
        return {};
    }
    let statusNormal = false;
    if (!item.state && !item.status) {
        statusNormal = true;
    } else if (item.state === '正常' || item.status === '正常') {
        statusNormal = true;
    }
    return {
        id: item.id || item.placeID || item.placeId || item.city_id,
        userNum: item.userNum || item.peopleNum || item.user_num || 0,
        state: statusNormal ? STATE_HASH.ok : STATE_HASH.alarm
    }
};
var exports = {};
let getUrlQuery = (list) => {
    var query = '';
    var IDlist = [];
    list = list || [];
    list.forEach((item, index) => {
        item = formatItem(item);
        if (!item.id) {
            return;
        }
        let i = index + 1;
        let str = `id${i}=${item.id},${item.userNum},${item.state}`;
        IDlist.push(str);
    });
    query += IDlist.join('&');
    return query;
};

exports.getUrl = (list, level, options = {}) => {
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
        item = formatItem(item);
        if (!item.id) {
            return;
        }
        let i = index + 1;
        data['id' + i] = item;
    });
    if (options.cityId) {
        data.cityId = options.cityId;
    }
    LOG('[gis sendEvent]' + level, data);
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
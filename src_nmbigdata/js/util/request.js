/**
 * 请求数据
 */

let Promise = require('promise');
let config = require('config');
let URL = require('util/url');
let Fetch = require('util/fetch');
let mock = !config.isProduction;
let ajaxUrlBase = config.ajaxUrlBase;

const parseNum = (str) => {
    let r = str.match(/\d+/g);
    if (!r) {
        return 0;
    }
    return parseInt(r[0], 10);
};
const parseNumArray = (str) => {
    let r = str.match(/\d+/g);
    if (!r) {
        return 0;
    }
    return r.map((v) => {
        return parseInt(v, 10);
    });
};

const handleResult = (r) => {
    if (!r || r.success === false) {
        return Promise.reject(r);
    }
    return r;
};
const fetch1 = (url, data) => {
    return Fetch.getJSON(url, data).then((result) => {
        return handleResult(result);
    });
};
const fetch2 = (path, param) => {
    if (mock) {
        return fetch1(ajaxUrlBase + `${path}.json`, param);
    }
    return fetch1(ajaxUrlBase + `${path}.do`, param);
};
const fetch3 = (path, param) => {
    const handle = (r) => {
        if (!r || !r.respCode) {
            return Promise.reject(r);
        }
        return r.data;
    };
    let p = (param.func) ? ('_' + param.func) : '';
    return Fetch.getJSON(`./mock${path}${p}.json`, param).then((r) => {
        return handle(r);
    });
};
const post = (path, param) => {
    let url = ajaxUrlBase + path + '.do';
    return Fetch.post(url, param).then((r) => {
        return handleResult(r);
    }).catch(() => {
        LOG(`post ${path} error`);
    });
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
const getCommonParam = (point, radius) => {
    return {
        wLatitude: point.lat,
        jLongitude: point.lng,
        queryDistance: radius
    };
};
let exports = {
    fetch3
};
exports.menu = function () {
    return fetch1(ajaxUrlBase + '/data_json/left_menu.json');
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
exports.goodsTypes = Fetch.once(() => {
    return fetch3('/rest/adService', {func: 'goodsTypes'});
});
exports.opinionCate = (p = {}) => {
    p.func = 'opinionCate';
    return fetch3('/rest/monitor', p);
};
exports.publicoWordBubble = () => {
    return fetch3('/rest/monitor', {
        func: 'opinionListByCate',
        limit: 3000
    });
};
// 热力图数据
exports.totalCust = (point, radius = 1000) => {
    let param = getCommonParam(point, radius);
    param.func = 'totalCust';
    return fetch3('/rest/custService', param);
};
// 商圈总人数
exports.totalCustDisNum = (point, radius) => {
    let param = getCommonParam(point, radius);
    param.func = 'totalCustDisNum';
    return exports.fetch3('/rest/custService', param);
};
// 管理员登录
exports.login = (p = {}) => {
    p.func = 'adminLogin';
    return exports.fetch3('/rest/account', p);
};
// 查询账号列表
exports.queryAccount = (p = {}) => {
    p.func = 'accountManage';
    return exports.fetch3('/rest/account', p);
};
exports.account = (p) => {
    return exports.fetch3('/rest/account', p);
};
module.exports = exports;
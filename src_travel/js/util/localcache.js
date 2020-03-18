const Store = require('util/store.js');
const config = require('global/config.js');
const tool = require('util/tool.js');
const Promise = require('Promise');

function localCache(url, param) {
    let o = tool.extend({}, param, {
        _url: url,
        _version: config.staticVersion
    });

    let key = Store.makeKey(o);
    this.param = tool.extend({}, param);
    this.key = key;
    this.isParamDated = this.hasDateParam(param);
    this.data = null;
}

let proto = localCache.prototype;
proto.hasDateParam = function (param) {
    if (!param) {
        return false;
    }
    if (param.deal_date || param.start_date || param.end_date || param.startDate || param.endDate) {
        return true;
    }
    return false;
};
proto.get = function () {
    if (this.data) {
        return this.data;
    }
    this.data = Store.get(this.key, 'json');
    return this.data;
};
proto.delayReturn = function () {
    let data = this.get();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 350)
    });
};
proto.set = function (str) {
    if (this.key) {
        return Store.set(this.key, str);
    }
};
proto.save = function (data) {
    if (!data || !this.isParamDated) {
        return false;
    }
    let str = JSON.stringify(data);
    // 异步，防止报错中断
    setTimeout(() => {
        this.set(str);
    });
};

module.exports = localCache;
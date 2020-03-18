/**
 * 本地存储
 */
const Store = {};
const ls = window.localStorage;
let hasOwn = Object.prototype.hasOwnProperty;
Store.makeKey = function (param, param2 = {}) {
    let a = [];
    let o = {};
    for (let i in param) {
        if (hasOwn.call(param, i)) {
            o[i] = param[i];
        }
    }
    for (let i in param2) {
        if (hasOwn.call(param2, i)) {
            o[i] = param2[i];
        }
    }
    for (let i in o) {
        a.push(i + '=' + o[i]);
    }
    a.sort();
    return a.join('&');
};
if (ls) {
    /**
     * 取
     *
     * @param      {string}  key     The key
     * @param      {string}  type    The type
     * @return     {string|object}
     */
    Store.get = function (key, type) {
        var val = ls.getItem(key);
        if (!val) {
            return null;
        }
        if (type === 'json') {
            try {
                val = JSON.parse(val);
            } catch(e) {
                val = null;
            }
        }
        return val;
    };

    /**
     * 存
     *
     * @param      {string}           key     The key
     * @param      {(object|string)}  val     The value
     * @return     {boolean}
     */
    Store.set = function (key, val) {
        if (typeof val === 'function') {
            val = val();
        }
        if (typeof val === 'object') {
            try {
                val = JSON.stringify(val);
            } catch(e) {
                val = null;
            }
        }
        try {
            return ls.setItem(key, val);
        } catch(e) {
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED' 
                || e.name === 'QuotaExceededError'
                || e.message === 'QuotaExceededError') {
                ls.clear();

                return ls.setItem(key, val);
            }
        }
    };

} else {
    Store.get = function () {
        return null;
    };

    Store.set = function () {
        return false;
    };
}

module.exports = Store;
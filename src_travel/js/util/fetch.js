/**
 * @描述  轻量级fetch
 * @用法  fetch(url, data)
 */

var $ = require('jquery');
var Promise = require('Promise');

let fetch = (url, data = {}, method = 'GET', dataType = 'json') => {
    return new Promise((resolve, reject) => {
        let p = {
            url, dataType, data, type: method
        };
        return $.ajax(p).success((json) => {
            json ? resolve(json) : reject(json);
        }).error(reject);
    });
};

fetch.getJSON = (url, data) => {
    return fetch(url, data, 'GET', 'json');
};
fetch.getHTML = (url, data) => {
    return fetch(url, data, 'GET', 'html');
};
fetch.post = (url, data) => {
    return fetch(url, data, 'POST');
};
fetch.jsonp = (url, data) => {
    return fetch(url, data, 'GET', 'jsonp');
};
fetch.once = function (func) {
    let result;
    return (...args) => {
        if (result === undefined) {
            result = func(...args);
        }
        return result;
    };
};
fetch.onceParam = function (func) {
    let result = {};
    return function () {
        let args = Array.prototype.slice.call(arguments) || [];
        let key = '';
        args.forEach((o) => {
            if (typeof o === 'string') {
                key += o;
            } else {
                key += JSON.stringify(o);
            }
        });
        if (!key) {
            key = 'default';
        }
        if (result[key] === undefined) {
            result[key] = func.apply(null, args);
        }
        return result[key];
    };
};

module.exports = fetch;
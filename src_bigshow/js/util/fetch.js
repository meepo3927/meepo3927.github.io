/**
 * @描述  封装Promise
 * @用法  同jQuery.ajax()
 */

import Promise from 'promise';

const fetch = function () {
    const args = Array.prototype.slice.call(arguments);
    return new Promise((resolve, reject) => {
        return $.ajax.apply(null, args).success((result) => {
            result ? resolve(result) : reject(result);
        }).error(reject);
    });
};
fetch.getJSON = (url, data) => {
    return fetch({
        url, data,
        type: 'GET',
        dataType: 'json'
    });
};
fetch.once = function (func) {
    let result;
    return () => {
        if (result === undefined) {
            result = func();
        }
        return result;
    };
};
export default fetch;
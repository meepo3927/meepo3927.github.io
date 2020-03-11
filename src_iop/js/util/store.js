/**
 * 本地存储
 */

define([], function () {
    var exports = {};
    var ls = window.localStorage;
    if (ls) {


        /**
         * 取
         *
         * @param      {string}  key     The key
         * @param      {string}  type    The type
         * @return     {string|object}
         */
        exports.get = function (key, type) {
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
        exports.set = function (key, val) {
            if (typeof val === 'function') {
                val = val();
            }
            if (val && typeof val === 'object') {
                try {
                    val = JSON.stringify(val);
                } catch(e) {
                    val = '';
                }
            }
            return ls.setItem(key, val);
        };

    } else {
        exports.get = function () {
            return null;
        };

        exports.set = function () {
            return false;
        };
    }

    return exports;
});
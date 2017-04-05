/**
 * @author guoye (guoye01@baidu.com)
 * @desc   轻量级AJAX库
 * @date   2015-02-28
 */
define([], function () {

    /**
     * 空函数
     */
    var noop = function () {};

    /**
     * 将字符串解析为对象
     * @param  {string} str JSON字符串
     * @return {Object}
     */
    var parseJSON = function (str) {
        var obj;
        try {
            obj = (
                new Function(
                    'return (' + str + ')'
                )
            )();
        } catch (e) {
            obj = null;
        }
        return obj;
    };

    /**
     * 获取XMLHttpRequest对象
     * @return {XMLHttpRequest}
     */
    var getXhr = function () {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            return new ActiveXObject('Microsoft.XMLHttp');
        } else {
            return null;
        }
    };

    function getRequestData(data) {
        if (!data) {
            return '';
        }

        if (typeof data === 'string') {
            return data;
        }

        if (typeof data !== 'object') {
            return data + '';
        }

        var arr = [];
        for (var i in data) {
            if (!data.hasOwnProperty(i)) {
                continue;
            }

            arr.push(
                encodeURIComponent(i)
                + '='
                + encodeURIComponent(data[i])
            );
        }
        return arr.join('&');
    }

    /**
     * Main
     * 
     * @param  {string} url
     * @param  {Object=} options
     *         callback: Function
     *         type: GET|POST
     *         data: 'a=1&b=2'
     *         dataType: 'json'
     * @return void
     */
    var exports = function (url, options) {
        var xhr = getXhr();
        if (!url || !xhr) {
            return;
        }
        options = options || {};
        var dataType = options.dataType ? (options.dataType.toLowerCase()) : 'json';
        var onCallback = options.callback || noop;
        var onSucc = options.success || noop;
        var onError = options.error || noop;

        /**
         * 状态发生改变时
         */
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            var text = xhr.responseText || '';
            var status = xhr.status || 0;
            if (dataType === 'json') {
                // JSON形式的callback逻辑不同
                var obj = parseJSON(text || '');
                onCallback(obj, status, xhr);

                if (obj && obj.status === 0) {
                    onSucc(obj.data || {});
                } else {
                    onError(obj);
                }
            } else {
                onCallback(text, status, xhr);
            }
        };

        if (options.type && options.type.toLowerCase() === 'post') {
            xhr.open('POST', url, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(getRequestData(options.data));
        } else {
            url += (url.indexOf('?') >= 0) ? '&' : '?';
            url += getRequestData(options.data);
            xhr.open('GET', url, true);
            xhr.send();
        }
        return xhr;
    };

    /**
     * POST请求
     * @param  {string} url     请求URL
     * @param  {[type]} options 参数配置
     */
    exports.post = function (url, options) {
        options = options || {};
        options.type = 'post';
        return exports(url, options);
    };

    return exports;
});

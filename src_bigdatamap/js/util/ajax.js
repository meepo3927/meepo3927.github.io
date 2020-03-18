/**
 * 轻量级AJAX库
 */

 (function (name, factory) {
     if (typeof define === 'function' && (define.amd || define.cmd)) {
         define([], factory);
     } else {
         window[name] = factory();
     }
 }('UtilAjax', function () {
     "use strict";

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

     var getIEVersion = function () {
         var versions = {
             objectobject: 7, //IE7-8
             objectundefined: 6, //IE6
             undefinedfunction: 0, // other modern browsers
             undefinedobject: 0
         };
         return document.documentMode || versions[typeof document.all + typeof XMLHttpRequest];
     };
     var IE = getIEVersion();

     var loadJS = function (url, callback) {
         var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
         var script = document.createElement("script");
         script.async = "async";
         script.src = url;
         script.onerror = function () {
             script.onload = script.onreadystatechange = script.onerror = null;
         };
         script.onload = script.onreadystatechange = function(event) {
             event = event || window.event;
             if (event.type === "load" || (/loaded|complete/.test(script.readyState) && (!IE || IE < 9))) {
                 // Handle memory leak in IE
                 script.onload = script.onreadystatechange = script.onerror = null;
                 if (head && script.parentNode) {
                     head.removeChild(script);
                 }
                 // Dereference the script
                 script = undefined;
                 if (callback) {
                     setTimeout(callback, 1);
                     callback = null;
                 }
             }
         };
         head.appendChild(script);
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
      * @param  {string}   url
      * @param  {Object=}  options
      *         options.callback: Function
      *         options.success: Function
      *         options.error: Function
      *         options.type: 'GET'|'POST'
      *         options.data: 'a=1&b=2'
      *         options.dataType: 'json'
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
      * @param  {Object} options 参数配置
      */
     exports.post = function (url, options) {
         options = options || {};
         options.type = 'post';
         return exports(url, options);
     };
     var callbackId = 1000;
     var getCallbackId = function () {
         var p = (++callbackId);
         var d = (new Date()).getTime() + '';
         var r = parseInt(Math.random() * 9999999, 10) + '';
         return 'jsonp_callback_' + p + d + r;
     };

     /**
      * JSONP请求
      * @param  {string} url      请求URL
      * @param  {Object} options
      *                  options.data    参数
      *                  options.success 成功
      */
     exports.jsonp = function (url, options) {
         if (url === undefined || url === null) {
             return;
         }
         url = url || location.href;
         options = options || {};

         var success = options.success || noop;
         var id = getCallbackId();
         var called = false;
         window[id] = function () {
             if (called) {
                 return;
             }
             called = true;
             var args = Array.prototype.slice.call(arguments);
             success.apply(null, args);
             window[id] = null;
         };

         url += (url.indexOf('?') >= 0) ? '&' : '?';
         url += getRequestData(options.data) + '&callback=' + id;

         loadJS(url);
     };

     return exports;
 }));

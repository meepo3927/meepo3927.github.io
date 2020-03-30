;(function (window) {
    function printlog(arg) {
        if (window.console) {
            window.console.log(arg);
        }
    }
    function findIframe(event, href) {
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow === event.source) {
                return iframes[i];
            }
        }
        for (i = 0; i < iframes.length; i++) {
            if (iframes[i].src === href) {
                return iframes[i].src;
            }
        }
    }
    function handleMessage(e) {
        try {
            var o = JSON.parse(e.data)
        } catch (e) {
            printlog('parse message to json fail: ' + e.data);
            throw e;
        }
        var iframe = findIframe(e, o.href || o.src);
        if (!iframe) {
            printlog('no matched iframe');
            printlog(o);
            return false;
        }
        var height = Math.round(o.height);
        if (!height) {
            return printlog('height error:' + o.height);
        }
        iframe.style.height = height + 'px';
    }
    if (window.addEventListener) {
        window.addEventListener('message', function (e) {
            handleMessage(e);
        });
    } else if (window.attachEvent) {
        window.attachEvent('onmessage', function (e) {
            handleMessage(e);
        });
    }
})(window);
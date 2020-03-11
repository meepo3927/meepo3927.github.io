
var $ = require('jquery');
const noop = $.noop;
let prefix = 'form-async-prefix-';
let uuid = 1;
let defaults = {
    dataType: 'json'
};
function fetchContent(iframe, callback) {
    if (!iframe) {
        return null;
    }
    callback = callback || function () {};
    if (callback.is_iframe_fetch_callback) {
        var call = callback;
    } else {
        call = function (result) {
            if (call.called) {
                return;
            }
            call.called = true;
            iframe.onload = null;
            if (result instanceof Error) {
                return callback('', result);
            }
            try {
                var o = JSON.parse(result);
            } catch(e) {
                o = null;
            }
            return callback(result, o);
        };
        call.is_iframe_fetch_callback = true;
    }
    var runNext = function () {
        return fetchContent.call(null, iframe, call);
    };
    var next = function () {
        return setTimeout(runNext, 100);
    };
    var getContent = function () {
        try {
            var win = iframe.contentWindow;
            var doc = win.document;
            if (!doc) {
                return false;
            }
            if (doc.readyState === 'uninitialized') {
                return false;
            }
            // 正在loading
            if (doc.readyState === 'loading') {
                return false;
            }
            // 文档 not ready
            if (doc.body === null) {
                return false;
            }
            return doc.body.textContent || doc.body.innerText;
        } catch(e) {
            return e;
        }
    };
    iframe.onload = function () {
        call(getContent());
    };
    var content = getContent();
    if (content) {
        return call(content);
    }
    return next();
}
function FormAsync($form, options = {}) {
    this.$form = $form;
    this.options = $.extend(true, {}, defaults, options);
}
var proto = FormAsync.prototype;
proto.init = function () {
    this.$form.attr({
        'method': 'POST',
        'enctype': 'multipart/form-data'
    });
};
proto.send = function () {
    this.makeIframe();
    this.$form.submit();
    this.startFetch();
};
proto.handleContent = function (html, obj) {
    if (!html) {
        return this.handleError(obj);
    }
    const onSuccess = this.options.success || noop;
    const onError = this.options.error || noop;
    if (this.options.dataType === 'json') {
        if (html && obj) {
            onSuccess(obj);
        } else {
            onError(obj);
        }
    } else {
        html ? onSuccess(html) : onError(obj);
    }
};
// 跨域
proto.handleError = function (o) {
    const onError = this.options.error || noop;
    onError(o);
};
proto.makeIframe = function () {
    this.removeIframe();
    let name = prefix + (uuid++);
    this.$iframe = $(`<iframe name="${name}" src="about:blank" style="display: none;"></iframe>`);
    this.$iframe.insertAfter(this.$form);
    this.$form.attr('target', name);
};
proto.removeIframe = function () {
    if (this.$iframe) {
        this.$iframe.remove();
        this.$iframe = null;
    }
};
proto.startFetch = function () {
    fetchContent(this.$iframe[0], (str, obj) => {
        this.handleContent(str, obj);
        this.removeIframe();
    });
};

proto.isPending = function () {
    if (this.$iframe) {
        return true;
    }
    return false;
};
module.exports = function (form, options) {
    let fa;
    if (form.jquery) {
        fa = new FormAsync(form, options);
    } else {
        fa = new FormAsync($(form), options);
    }
    fa.init();
    return fa;
};
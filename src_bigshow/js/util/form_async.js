import Promise from 'promise';

const noop = () => {};
const PREFIX = 'form-async-prefix-';
/**
 * 用法：
 * FormAsync(formElem).send().then((result) => {});
 */
function FormAsync(formElem) {
    if (!(this instanceof FormAsync)) {
        return new FormAsync(formElem);
    }
    this.form = formElem;
    this.form.setAttribute('enctype', 'multipart/form-data');
}
FormAsync.UUID = 1000;
FormAsync.fetch = (iframe, callback) => {
    if (!iframe) {
        throw Error('FormAsync.fetch [iframe] param error');
    }
    if (typeof callback !== 'function') {
        throw Error('FormAsync.fetch [callback] param error');
    }
    // 包装回调
    if (!callback.IS_IFRAME_FETCH_CALLBACK) {
        var myCallFunc = (result) => {
            if (myCallFunc.IS_CALLED) { // 防止重复执行
                return;
            }
            myCallFunc.IS_CALLED = true;
            iframe.onload = undefined;
            if (result === undefined || result === null) {
                return callback(false, result);
            }
            if (result instanceof Error) {
                return callback(false, result);
            }
            try {
                var o = JSON.parse(result);
                return callback(true, o);
            } catch(e) {
                return callback(false, result);
            }
        };
        myCallFunc.IS_IFRAME_FETCH_CALLBACK = true;
    } else {
        myCallFunc = callback;
    }
    const loop = () => {
        setTimeout(() => {FormAsync.fetch(iframe, myCallFunc)}, 300);
    };
    const getContent = () => {
        try {
            if (!iframe.contentWindow) {
                return false;
            }
            const doc = iframe.contentWindow.document;
            if (!doc || (doc.readyState === 'uninitialized')
                || (doc.readyState === 'loading')
                || (doc.body === null)) {
                return false;
            }
            return doc.body.textContent || doc.body.innerText;
        } catch(e) {
            return e;
        }
    };
    const theContent = getContent();
    if (theContent) {
        return myCallFunc(theContent);
    } else {
        iframe.onload = () => {
            myCallFunc(getContent());
        };
    }
    loop();
};
var proto = FormAsync.prototype;
proto.makeIframe = function () {
    this.removeIframe();
    const name = PREFIX + (FormAsync.UUID++);
    const parent = this.form.parentNode || this.form.parentElement;
    if (!parent) {
        return;
    }
    try {
        var iframe = document.createElement(`<iframe name="${name}"></iframe>`);
    } catch (e) {
        iframe = document.createElement('iframe');
        iframe.name = name;
    }
    iframe.src = 'about:blank';
    iframe.style.display = 'none';
    parent.insertBefore(iframe, this.form);
    this.form.setAttribute('target', name);
    this.iframe = iframe;
};
proto.removeIframe = function () {
    if (this.iframe) {
        let p = this.iframe.parentNode || this.iframe.parentElement;
        if (p) {
            p.removeChild(this.iframe);
        }
        this.iframe = null;
    }
};
proto.send = function () {
    this.makeIframe();
    this.form.submit();
    return new Promise((resolve, reject) => {
        FormAsync.fetch(this.iframe, (bool, result) => {
            // LOG('fetch:' + bool, result);
            // handle result
            bool ? resolve(result) : reject(result);
            // clean
            this.removeIframe();
        });
    });
};
proto.isPending = function () {
    if (this.iframe) {
        return true;
    }
    return false;
};
export default FormAsync;
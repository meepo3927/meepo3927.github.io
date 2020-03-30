import store from 'global/center_store.js';
import MUIMsg from 'extend/vue.mui-msg.js';
const getJSON = (xhr) => {
    if (!xhr) {
        return null;
    }
    if (xhr.responseJSON) {
        return xhr.responseJSON;
    }
    try {
        return JSON.parse(xhr.responseText);
    } catch(e) {
        return null;
    }
};
const popXHR = (xhr) => {
    if (xhr.status === 0) {
        return MUIMsg('REQUEST_URL Not Found');
    } else {
        return MUIMsg(xhr.status + ':' + xhr.statusText);
    }
};
const popJSON = (json, xhr) => {
    return MUIMsg(
        json.message || json.msg
        || json.error
        || xhr.responseText
    );
};
const NEED_LOGIN_MSG = 'Full authentication is required to access this resource';
const needLogin = () => {
    alert('你的会话已失效，请重新登录！');
    try {
        store.commit('unsetUser');
        store.commit('removeToken');
    } catch(e) {
    }
    Vue.$replace('/login');
};
const AjaxCatch = (xhr) => {
    const type = Object.prototype.toString.call(xhr);
    if (type !== '[object XMLHttpRequest]') {
        return LOG('AjaxCatch:', xhr);
    }
    LOG('AjaxCatch:', xhr);
    const statusCode = xhr.status;
    const json = getJSON(xhr);
    if (!json) {
        return popXHR(xhr);
    }
    if (json.error === NEED_LOGIN_MSG || json.message === NEED_LOGIN_MSG) {
        return needLogin();
    }
    return popJSON(json, xhr);
};

export default AjaxCatch;
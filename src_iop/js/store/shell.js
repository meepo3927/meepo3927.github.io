const Vue = require('vue');
const Vuex = require('vuex');
const ls = require('util/store.js');
Vue.use(Vuex);

const SIDE_MODE_CACHE_KEY = 'SideModeCache';

const addRandomParam = (url) => {
    let a = url.split('#');
    if (a[0].indexOf('?') >= 0) {
        a[0] += '&_r=' + Math.random();
    } else {
        a[0] += '?_r=' + Math.random();
    }
    return a.join('#');
};

const mutations = {
    jump: function (state, payload) {
        state.src = addRandomParam(payload);
        state.innerUrl = '#';
    },
    innerJump: function (state, payload) {
        let url = addRandomParam(payload);
        state.src = url;
        state.innerUrl = url;
    },
    setActive: function (state, payload) {
        if (typeof payload === 'string') {
            state.actived = payload;
        } else if (payload && payload.folderId) {
            state.actived = payload.folderId;
        }
    },
    toggleMode: function (state) {
        if (state.sideMode === 'mini') {
            state.sideMode = 'normal';
        } else {
            state.sideMode = 'mini';
        }
        ls.set(SIDE_MODE_CACHE_KEY, state.sideMode);
    },
    setMenuVisible: function (state, payload) {
        state.menuVisible = payload;
    }
}
let store = new Vuex.Store({
    state: {
        src: 'about:blank',
        actived: '',
        innerUrl: '#',
        sideMode: ls.get(SIDE_MODE_CACHE_KEY) || 'normal',
        menuVisible: false
    },
    mutations,
    getters: {
        isSideModeNormal: function (state) {
            return (state.sideMode === 'normal')
        },
        isSideModeMini : function (state) {
            return (state.sideMode === 'mini')
        }
    }
});

module.exports = store;
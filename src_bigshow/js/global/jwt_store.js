import Vuex from 'vuex';
import localstore from 'util/localstore.js';
Vue.use(Vuex);
const TOKEN_KEY = 'JWT_TOKEN';
const mutations = {
    saveToken: function (state, payload) {
        state.token = payload;
        localstore.set(TOKEN_KEY, payload);
    },
    removeToken: function (state) {
        state.token = '';
        localstore.remove(TOKEN_KEY);
    }
}
const store = new Vuex.Store({
    mutations,
    state: {
        token: localstore.get(TOKEN_KEY)
    },
    getters: {
        signed: function (state, getters) {
            return getters.tokenInfo ? true : false;
        },
        tokenInfo: function (state) {
            const arr = (state.token || '').split('.');
            const str = arr[1] ? atob(arr[1]) : '';
            try {
                const token = str ? JSON.parse(str) : null;
                if (!token) {
                    return null;
                }
                const exp = token.exp;
                // 已过期
                if (exp * 1000 < (new Date().getTime())) {
                    return null;
                }
                return token;
            } catch(e) {
                return null;
            }
        },
        userInfo: function (s, g) {
            const str = g.tokenInfo ? g.tokenInfo.sub : null;
            if (!str) {
                return null;
            }
            try {
                return JSON.parse(str);
            } catch(e) {
                return null;
            }
        }
    }
});

export default store;
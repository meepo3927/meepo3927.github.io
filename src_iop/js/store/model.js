
var Vue = require('vue');
var Vuex = require('vuex');
Vue.use(Vuex);

const mutations = {
    setTypes: function (state, payload) {
        state.types = payload
    }
};
const getters = {
    typeMap: function (state) {
        let map = {};
        state.types.forEach((item) => {
            map[item.typeId] = item.typeName;
        });
        return map;
    }
};
let store = new Vuex.Store({
    state: {
        types: []
    },
    mutations,
    getters
});

module.exports = store;
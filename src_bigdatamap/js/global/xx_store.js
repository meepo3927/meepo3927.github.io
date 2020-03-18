let Vue = require('vue');
let Vuex = require('vuex');
// Vue.use(Vuex);

const mutations = {
    test: function (state, payload) {
    },
}
let store = new Vuex.Store({
    mutations,
    state: {},
    getters: {}
});

module.exports = store;
let Vue = require('vue');
let Vuex = require('vuex');

const mutations = {
    setCity: function (state, payload) {
        state.city = payload;
    }
}
let store = new Vuex.Store({
    mutations,
    state: {
        city: null
    },
    getters: {
        cityId: function (state) {
            return (state.city ? state.city.id : undefined)
        },
        cityName: function (state) {
            return (state.city ? state.city.name : undefined)
        },
        cityParam: function (state) {
            let p = {};
            if (state.city) {
                p.cityId = state.city.id;
            }
            return p;
        }
    }
});

module.exports = store;
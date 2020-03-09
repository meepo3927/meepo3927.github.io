
var Vuex = require('vuex');
let store =  new Vuex.Store({
    state: {
        realtimeScenery: null
    },
    mutations: {
        setRealtimeScenery: function (state, payload) {
            state.realtimeScenery = payload;
        }
    },
    getters: {
        realtimeUserNum: function (state) {
            if (state.realtimeScenery) {
                return state.realtimeScenery.peopleNum;
            }
        },
        realtimePlaceName: function (state) {
            if (state.realtimeScenery) {
                return state.realtimeScenery.placeName;
            }
        }
    }
});

module.exports = store;
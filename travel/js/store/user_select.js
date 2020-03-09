
var Vuex = require('vuex');
let store =  new Vuex.Store({
    state: {
        editInfo: null,
        selectInfo: null
    },
    mutations: {
        clean: function (state) {
            state.editInfo = null;
            state.selectInfo = null;
        },
        updateEditInfo: function (state, payload) {
            state.editInfo = payload;
        },
        updateSelectInfo: function (state, payload) {
            state.selectInfo = payload;
        }
    },
    getters: {
        
    }
});

module.exports = store;
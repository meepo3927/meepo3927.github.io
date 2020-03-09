
var Vuex = require('vuex');
let store =  new Vuex.Store({
    state: {
        flag: 'normal',
        area: {
            name: '',
            id: 0
        }
    },
    mutations: {
        toggle: function (state) {
            if (state.flag === 'normal') {
                state.flag = 'heatmap';
            } else {
                state.flag = 'normal';
            }
        },
        changeArea: function (state, payload) {
            state.area.name = payload.name;
            state.area.id = payload.id;
        }
    },
    getters: {
        areaId: function (state) {
            return state.area.id;
        },
        areaName: function (state) {
            return state.area.name;
        },
        label: function (state) {
            return (state.flag === 'normal') ? '显示热力图' : '隐藏热力图';
        }
    }
});

module.exports = store;
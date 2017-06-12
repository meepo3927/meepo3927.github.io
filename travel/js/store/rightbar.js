
var Vuex = require('vuex');

let store =  new Vuex.Store({
    state: {
        flag: 'normal'
        // label: '显示热力图'
    },
    mutations: {
        toggle: function (state) {
            if (state.flag === 'normal') {
                state.flag = 'heatmap';
            } else {
                state.flag = 'normal';
            }
        }
    },
    getters: {
        label: function (state) {
            return (state.flag === 'normal') ? '显示热力图' : '隐藏热力图';
        }
    }
});

module.exports = store;
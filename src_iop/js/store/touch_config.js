const Vuex = require('vuex');
const Calendar = require('util/calendar.js');
Vue.use(Vuex);

const mutations = {
    setEarliestDate: function (state, payload) {
        state.earliestDate = payload;
    },
    setMode: function (state, payload) {
        state.mode = payload;
    }
};
const getters = {
    isModeAdd: function (state) {
        return (state.mode === 'default');
    },
    isModeModify: function (state) {
        return (state.mode === 'modify');
    },
    // 所有波次最早的开始日期+90天
    lastAvailableDate: function (state) {
        if (!state.earliestDate) {
            return undefined;
        }
        const date = Calendar.parseDate(state.earliestDate);
        date.setTime(date.getTime() + 24 * 3600 * 1000 * 91 + 1000);
        return Calendar.getYMD(date);
    }
};
let store = new Vuex.Store({
    state: {
        // 模式: 正常-default , 编辑-modify
        mode: 'default',
        earliestDate: undefined
    },
    mutations,
    getters
});

module.exports = store;
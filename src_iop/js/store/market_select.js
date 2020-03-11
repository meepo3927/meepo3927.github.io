
var Vue = require('vue');
var Vuex = require('vuex');
Vue.use(Vuex);

const mutations = {
    id: function (state, payload) {
        state.mpId = payload;
    },
    setName: function (state, payload) {
        state.mpName = payload;
    },
    change: function (state, payload) {
        state.mpLabelDay = payload.day;
        state.mpLabelType = payload.type;
        state.mpName = payload.name;
    }
};
const mpLabelUpdateTextMap = {
    1: '日',
    2: '月'
};
const getters = {
    mpLabelUpdateText: function (state, getters) {
        let text = mpLabelUpdateTextMap[state.mpLabelDay] || '周期';
        return '按' + text + '更新';
    },
    mpLabelUpdateTip: function (state, getters) {
        let text = mpLabelUpdateTextMap[state.mpLabelDay] || '';
        if (!text) {
            return '';
        }
        return `从活动开始日期至活动结束日期名单每${text}更新`;
    }
};
let store = new Vuex.Store({
    state: {
        mpId: '',
        mpLabelDay: '',
        mpLabelType: '',
        mpName: ''
    },
    getters,
    mutations
});

module.exports = store;
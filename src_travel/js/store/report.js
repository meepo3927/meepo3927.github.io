
var Vuex = require('vuex');
let store =  new Vuex.Store({
    state: {
        inited: false,
        submitCount: 0,
        loading: false,
        dateType: 'month',
        dimType: 'scenery',
        condition: undefined,
        status: 'default'
    },
    mutations: {
        init: function (state, payload) {
            state.inited = payload;
        },
        setStatus: function (state, payload) {
            state.status = payload;
        },
        loadStart: function (state) {
            state.loading = true;
        },
        setCondition: function (state, payload) {
            state.condition = payload;
        },
        loadEnd: function (state) {
            state.loading = false;
        },
        submitCountReset: function (state) {
            state.submitCount = 0;
        },
        submitCountPlus: function (state) {
            state.submitCount++;
        },
        setDim: function (state, payload) {
            state.dimType = payload;
        },
        setDateType: function (state, payload) {
            state.dateType = payload;
        }
    },
    getters: {
        isDimCity: function (state) {
            return (state.dimType === 'city');
        },
        isDimScenery: function (state) {
            return (state.dimType === 'scenery');
        },
        isMonthDateType: function (state) {
            return (state.dateType === 'month');
        },
        isYearDateType: function (state) {
            return (state.dateType === 'year');
        },
        isDiyDateType: function (state) {
            return (state.dateType === 'diy');
        },
        mCondition: function (state) {
            return state.condition || {};
        }
    }
});

module.exports = store;
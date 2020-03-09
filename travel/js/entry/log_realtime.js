const Vue = require('vue');
let methods = {};
let computed = {};
let data = {};
const mounted = function () {};
var vm = new Vue({
    el: '#main',
    methods,
    computed,
    data,
    mounted,
    components: {
        'v-main': require('pages/log-realtime.vue')
    }
});
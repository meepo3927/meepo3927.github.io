const Vue = require('vue');
let methods = {};

let computed = {};

let data = {
};
let mounted = function () {
};
var vm = new Vue({
    el: '#main',
    methods,
    computed,
    data,
    mounted,
    components: {
        'v-main': require('comp/notice/main.vue')
    }
});
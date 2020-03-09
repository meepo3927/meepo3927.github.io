const Vue = require('vue');
const mounted = function () {};
new Vue({
    el: '#main',
    data: {},
    mounted,
    components: {
        'v-main': require('pages/acct_unlock.vue')
    }
});
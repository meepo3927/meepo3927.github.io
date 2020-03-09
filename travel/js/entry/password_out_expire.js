const Vue = require('vue');
var vm = new Vue({
    el: '#main',
    components: {
        'v-main': require('pages/password-out-expire.vue')
    }
});
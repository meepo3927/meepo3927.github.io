const Vue = require('vue');
var vm = new Vue({
    el: '#main',
    components: {
        'v-main': require('pages/scenery_source.vue')
    }
});
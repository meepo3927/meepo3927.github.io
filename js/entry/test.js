var mlayer = require('mlayer');
var Test = require('comp/test.vue');

var methods = {};
methods.onClick = function () {
    mlayer.msg('some-thing');
    setTimeout(() => {
        this.yell();
    }, 540);
};
methods.yell = function () {
    let o = 'oMeepo';
    mlayer.msg('yell!');
};
var mounted = function () {};
var vm = new Vue({
    el: '#main',
    data: {
        name: 'test-1233-' + Math.random()
    },
    methods: methods,
    mounted: mounted,
    components: {
        'vue-test': Test
    }
});
window.Test = vm;

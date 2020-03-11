/**
 * 创建事件
 */
import {Vue, $, request} from 'common';
var vData = {};
var vMethods = {};
var computed = {};
var onReady = function () {
};
var comps = {
    'create-event': require('pages/create-event.vue')
};
var vm = new Vue({
    el: '#main',
    data: vData,
    methods: vMethods,
    computed: computed,
    mounted: onReady,
    mixins: [],
    components: comps
});

window.CreateEvent = vm;

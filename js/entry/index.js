import {Vue} from 'common';

let methods = {};
methods.alert = function () {
};

window.Index = new Vue({
    el: '#main',
    methods,
    data: {
        name: 'index-123'
    }
});

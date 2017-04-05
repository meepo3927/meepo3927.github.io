import {Vue} from 'common';
var mlayer = require('lib/mlayer');

let methods = {};
methods.alert = function () {
    mlayer.msg('alert123');
    require.ensure([], function () {
        var URL = require('util/url');
        
        mlayer.msg(URL.query().name);
    });
};

window.Index = new Vue({
    el: '#main',
    methods,
    data: {
        name: 'index-123'
    }
});
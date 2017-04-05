import {Vue} from 'common';
import detect from 'util/detect';
let methods = {};
methods.alert = function () {
};
let computed = {};
computed.className = function () {
    let env = this.env;
    let os = 'os-' + (env.os.phone ? 'phone' : (env.os.tablet ? 'tablet' : 'pc'));
    return [os];
};
let mounted = function () {
};
window.Index = new Vue({
    el: '#main',
    mounted,
    computed,
    methods,
    data: {
        name: 'index-123',
        env: detect()
    }
});

import {Vue} from 'common';
import detect from 'util/detect';
let methods = {};
methods.init = function () {
    this.stage = 2;
};
methods.start = function () {
    this.stage = 2;
};
let computed = {};
computed.className = function () {
    let env = this.env;
    let os = 'os-' + (env.os.phone ? 'phone' : (env.os.tablet ? 'tablet' : 'pc'));
    return [os];
};
let mounted = function () {
    this.$nextTick(this.init);
};
window.Index = new Vue({
    el: '#main',
    mounted,
    computed,
    methods,
    data: {
        env: detect(),
        stage: 0
    },
    components: {
        'stage-1': require('global/stage-1.vue'),
        'stage-2': require('global/stage-2.vue')
    }
});

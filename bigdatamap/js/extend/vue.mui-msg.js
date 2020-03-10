
let Vue = require('vue');
let Main = require('comp/mui/msg.vue');
let MsgConstructor = Vue.extend(Main);

// let instances = [];
const convertOptions = (options) => {
    if (options === undefined || options === null) {
        return {};
    }
    if (typeof options === 'object') {
        return options;
    } else {
        return {text: options + ''}
    }
};
let Msg = function (options) {
    options = convertOptions(options);
    let instance = new MsgConstructor({
        data: options
    });

    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    return instance.vm;
};

['success', 'warning', 'info', 'error'].forEach(type => {
    Msg[type] = function (options) {
        options = convertOptions(options);
        options.type = type;
        return Msg(options);
    };
});

module.exports = Msg;
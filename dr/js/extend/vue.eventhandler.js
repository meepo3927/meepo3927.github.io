var Plugin = {};
Plugin.install = function (Vue, options) {
    var methods = {};
    methods.handleEvent = function (e) {
        var type = e.type.charAt(0).toUpperCase() + e.type.substr(1);
        var methodsName = 'handle' + type;
        if (typeof this[methodsName] === 'function') {
            return this[methodsName](e);
        }
    };
    Vue.mixin({
        methods: methods
    });
};

module.exports = Plugin;
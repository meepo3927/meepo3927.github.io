var Plugin = {};
Plugin.install = function (Vue, options) {
    var methods = {};
    methods.handleEvent = function (e) {
        let eventName = 'handle-' + e.type.toLowerCase();
        this.$emit(eventName, e);

        var type = e.type.charAt(0).toUpperCase() + e.type.substr(1);
        var methodsName = 'handle' + type;
        if (typeof this[methodsName] === 'function') {
            this[methodsName](e);
        }
    };
    Vue.mixin({
        methods: methods
    });
};

module.exports = Plugin;
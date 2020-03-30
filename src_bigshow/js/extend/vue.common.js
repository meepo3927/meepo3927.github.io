const Plugin = {};
Plugin.install = function (Vue, options) {
    // 路径封装
    Vue.$getPageUrl = (path, param = '') => {
        if (localEnv) {
            if (path.charAt(0) === '/') {
                return '.' + path + '.html' + param;
            } else {
                return './' + path + '.html' + param;
            }
        }
        if (Config.isProduction) {
            return Config.basePath + path + '.jsp' + param;
        }
        return Config.basePath + path + '.html' + param;
    };
    Vue.$getImageUrl = (path) => {
        if (Config.isProduction) {
            return Config.basePath + '/images' + path;
        }
        const localEnv = !(location.host);
        if (localEnv) {
            return './images' + path;
        }
        return '/images' + path;
    };
    Vue.$newComponent = (component, data, options = {}) => {
        const Constructor = Vue.extend(component);
        const instance = new Constructor({
            data,
            propsData: options.propsData
        });
        const el = options.el;
        if (el && el !== document.body) {
            instance.$mount(el);
        } else {
            document.body.appendChild(instance.$mount().$el);
        }
        return instance;
    };
    Vue.$disposeComponent = (instance) => {
        const $el = instance.$el;
        if ($el.parentNode) {
            $el.parentNode.removeChild($el);
        }
        instance.$destroy(true);
        return instance;
    };
    Vue.SPACE_CHAR = '　';
    const mounted = function () {
        this.$_promiseHolder = {};
    };
    const methods = {};
    methods.$setPromise = function (name, p) {
        if (this.$_promiseHolder[name]) {
            this.$_promiseHolder[name].cancel();
            this.$_promiseHolder[name] = undefined;
        }
        this.$_promiseHolder[name] = p;
        return p;
    };
    methods.$cancelPromise = function (name) {
        if (this.$_promiseHolder[name]) {
            this.$_promiseHolder[name].cancel();
            this.$_promiseHolder[name] = undefined;
        }
    };
    methods.$cleanPromise = function () {
        for (let i in this.$_promiseHolder) {
            if (this.$_promiseHolder.hasOwnProperty(i)) {
                let p = this.$_promiseHolder[i];
                if (p && p.cancel) {
                    p.cancel();
                }
            }
        }
        this.$_promiseHolder = {};
    };
    methods.$newComponent = function (component, data, options = {}) {
        if (!this.$_componentHolder) {
            this.$_componentHolder = {};
        }
        const t = (new Date).getTime();
        const name = (Math.random().toString(32)).substr(2) + t;
        // 不重复生成
        if (this.$_componentHolder[name]) {
            return;
        }
        const instance = Vue.$newComponent(component, data, options);
        instance.$once('dispose', () => {
            this.$disposeComponent(name);
        });
        this.$_componentHolder[name] = instance;
        return instance;
    };
    methods.$disposeComponent = function (name) {
        if (this.$_componentHolder[name]) {
            Vue.$disposeComponent(this.$_componentHolder[name]);
            this.$_componentHolder[name] = null;
        }
    };
    methods.$disposeAllComponent = function () {
        for (let name in this.$_componentHolder) {
            if (this.$_componentHolder.hasOwnProperty(name)) {
                this.$disposeComponent(name);
            }
        }
        this.$_componentHolder = {};
    };
    methods.$IMG = function (path) {
        return Vue.$getImageUrl(path);
    };
    methods.$CATCH = function (err) {
        const msg = err ? (err.msg || err.message || err.error) : '';
        this.$msg(msg || '请求失败');
        LOG('$CATCH:', err);
    };
    methods.$HACK_VUE_ROUTER_IE = function () {
        const versions = {
            objectobject: 7, //IE7-8
            objectundefined: 6, //IE6
            undefinedfunction: NaN, // other modern browsers
            undefinedobject: NaN
        };
        const IE = document.documentMode || versions[typeof document.all + typeof XMLHttpRequest];
        if (IE) {
            window.addEventListener('hashchange', () => {
                if (!this.$route || !this.$router) { // NO VueRouter
                    return;
                }
                var currentPath = window.location.hash.slice(1);
                if (this.$route.path !== currentPath) {
                    this.$router.push(currentPath);
                }
            }, false);
        }
    };
    const beforeDestroy = function () {
        this.$cleanPromise();
        this.$disposeAllComponent();
    };
    Vue.mixin({
        mounted,
        methods,
        beforeDestroy
    });
    if (Config.mock) {
        Vue.prototype.$ = jQuery;
    }
};

module.exports = Plugin;

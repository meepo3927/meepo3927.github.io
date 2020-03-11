let request = require('util/request');

let mounted = function () {
};
let destroyed = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
methods.fetchArgs = function () {
    return request.getArgsByAtomId(this.atomId);
};
methods.fetchOptions = function () {
    this.fetchArgs().then((r) => {
        this.options = r.map && r.map((v) => {
            return {
                value: v.code,
                text: v.name
            };
        });
    }).catch(() => {
        this.options = null;
    });
};
let computed = {};
computed.atomId = function () {
    if (this.data && this.data.atomId) {
        return this.data.atomId;
    }
    return 0;
};
computed.v0 = function () {
    return this.value ? this.value[0] : undefined;
};
computed.v1 = function () {
    return this.value ? this.value[1] : undefined;
};
computed.v2 = function () {
    return this.value ? this.value[2] : undefined;
};
let watch = {};
watch.v = function (val) {
    if (Array.isArray(val)) {
        this.$emit('input', val);
    } else {
        this.$emit('input', [val]);
    }
};
module.exports = {
    props: ['value', 'data', 'ruleDesc', 'mesh'],
    data: function () {
        var o = {
            errmsg: ''
        };
        return o;
    },
    watch,
    methods,
    computed,
    activated,
    deactivated,
    mounted: mounted,
    destroyed: destroyed
};
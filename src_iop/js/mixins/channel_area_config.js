let config = require('config');
let tool = require('util/tool.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.hasChannelAreaRule = (json) => {
    if (!json || !json.evts) {
        return false;
    }
    for (let i = 0; i < json.evts.length; i++) {
        let evt = json.evts[i];
        let rules = evt.rules;
        for (let j = 0; j < rules.length; j++) {
            let rule = rules[j];
            if (~config.channelAreaAtomId.indexOf(rule.atomId)) {
                return true;
            }
        }
    }
    return false;
};
methods.patchChannelAreaName = (name) => {
    let d = new Date();
    let subfix = [
        d.getFullYear(),
        tool.padZero(d.getMonth() + 1),
        tool.padZero(d.getDate())
    ].join('')
    + '_' + [
        tool.padZero(d.getHours()),
        tool.padZero(d.getMinutes()),
        tool.padZero(d.getSeconds()),
        d.getMilliseconds()
    ].join('');
    return name + '_' + subfix;
};
let computed = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    components: {}
};
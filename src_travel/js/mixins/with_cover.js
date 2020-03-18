let Cover = require('util/cover');
let mounted = function () {
    this._cover = new Cover();
};
let destroyed = function () {
    if (this._cover) {
        this._cover.remove();
        this._cover = null;
    }
};
let activated = function () {
    if (this._cover) {
        this._cover.show();
    }
};
let deactivated = function () {
    if (this._cover) {
        this._cover.hide();
    }
};
let methods = {};
let computed = {};
module.exports = {
    props: [],
    methods,
    computed,
    activated,
    deactivated,
    mounted: mounted,
    destroyed: destroyed
};
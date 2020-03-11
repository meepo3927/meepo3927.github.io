let mounted = function () {
};
let destroyed = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
methods.childChangeLogic = function (child, val) {
    child.relation.logic = val;
};
methods.childToggleLeft = function (child) {
    child.relation.left = !child.relation.left;
    this.renderHighlightQuotes();
};
methods.childToggleRight = function (child) {
    child.relation.right = !child.relation.right;
    this.renderHighlightQuotes();
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
    activated,
    deactivated,
    mounted: mounted,
    destroyed: destroyed
};
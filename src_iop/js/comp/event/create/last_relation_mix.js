let coreUtil = require('util/event_core.js');

let mounted = function () {
};
let destroyed = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
methods.lastToggleLeft = function (rule) {
    this.lastRelation.left = !this.lastRelation.left;
    this.renderHighlightQuotes();
};
methods.lastToggleRight = function (rule) {
    this.lastRelation.right = !this.lastRelation.right;
    this.renderHighlightQuotes();
};
methods.renderHighlightQuotes = function () {
    var arr = coreUtil.highlightQuotes(this.childrens.map((rule) => {
        return rule.relation;
    }));

    if (this.lastRelation.right) {
        this.lastRelation.view.right = 'count-' + (arr.pop() || 0);
    } else {
        this.lastRelation.view.right = '';
    }
};
let computed = {};
computed.lastRelationVisible = function () {
    return this.childrens.length > 2;
};
computed.lastRelationOption = function () {
    var option = {};
    option.length = this.childrens.length;
    option.lastRelation = true;
    return option;
};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        o.lastRelation = coreUtil.getRelationOption();
        return o;
    },
    methods,
    computed,
    activated,
    deactivated,
    mounted: mounted,
    destroyed: destroyed
};
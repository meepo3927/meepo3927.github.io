let mounted = function () {
};
let destroyed = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
// 通知父级
methods.iChangeLogic = function (val) {
    this.$emit('change-logic', val);
};
// 通知父级
methods.iToggleRight = function () {
    this.$emit('toggle-right');
};
// 通知父级
methods.iToggleLeft = function () {
    this.$emit('toggle-left');
};
let computed = {};
computed.isFirst = function () {
    return (this.index === 0);
};
computed.isLast = function () {
    return (this.index + 1 === this.childcount);
};
computed.isRelationVisible = function () {
    return this.childcount > 1;
};
computed.relationOption = function () {
    var option = {};
    option.isFirst = this.isFirst;
    option.isLast = this.isLast;
    option.length = this.childcount;
    return option;
};
module.exports = {
    props: ['childcount', 'index'],
    data: function () {
        var o = {
        };
        return o;
    },
    methods,
    computed,
    activated,
    deactivated,
    mounted: mounted,
    destroyed: destroyed
};
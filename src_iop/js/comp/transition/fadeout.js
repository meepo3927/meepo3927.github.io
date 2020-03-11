let mounted = function () {
};
let destroyed = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
methods.leaveTransition = function (el, done) {
    $(el).fadeOut(500, done);
};
methods.leaveTrTransition = function (el, done) {
    $(el).children('td').animate({opacity: 0}, 500, done);
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
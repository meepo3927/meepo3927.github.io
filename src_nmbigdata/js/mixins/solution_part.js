const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getSolutionArticleImg = function (file) {
    return this.getImageUrl('/articles/' + file + '.png');
};
let computed = {};
computed.myItemName = function () {
    return this.myItem ? this.myItem.name : '';
};
computed.myItemIcon = function () {
    return this.myItem ? this.myItem.faIcon : '';
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [
        require('mixins/solution.js')
    ],
    components: {}
};
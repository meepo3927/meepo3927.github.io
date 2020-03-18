const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getSolutionUrl = function (i) {
    return this.getPageUrl('/solution', '#nav-' + i);
};
methods.getSolutionImg = function (item) {
    return this.getImageUrl('/solution/' + item.img);
};
let computed = {};
computed.solutionPart1 = function () {
    return [
        {img: '1.jpg', name: '旅游业', faIcon: 'fa-globe'},
        {img: '2.jpg', name: '金融业', faIcon: 'fa-money'},
        {img: '3.jpg', name: '航空业', faIcon: 'fa-plane'},
        {img: '4.jpg', name: '交通', faIcon: 'fa-car'},
        {img: '5.jpg', name: '政府', faIcon: 'fa-star'}
    ];
};
computed.solutionPart2 = function () {
     return [
        {img: '6.jpg', name: '商业', faIcon: 'fa-building'},
        {img: '7.jpg', name: '保险业', faIcon: 'fa-heart'},
        {img: '8.jpg', name: '烟草业', faIcon: 'fa-bullseye'},
        {img: '9.jpg', name: '传媒业', faIcon: 'fa-bullhorn'},
        {img: '10.jpg', name: '医疗行业', faIcon: 'fa-medkit'}
    ];
};
computed.solutions = function () {
    return this.solutionPart1.concat(this.solutionPart2);
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
    mixins: [],
    components: {}
};
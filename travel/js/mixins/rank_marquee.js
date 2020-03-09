const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.stopMarquee = function (elem, i) {
    var item = this.olist[i] || {};
    var style = item.textStyle || {};
    item.textMarquee = false;
    style.transform = 'translateX(0px)';
};
methods.restartMarquee = function (elem, i) {
    this.stopMarquee(elem, i);
    setTimeout(() => {
        this.startMarquee(elem, i);
    }, 50);
};
methods.startMarquee = function (elem, i) {
    var textElem = elem.parentNode || elem.parentElement;
    var w1 = textElem.clientWidth || textElem.offsetWidth;
    var w2 = elem.scrollWidth;
    var v = w2 - w1;
    if (v < 5) {
        return;
    }

    var x = v + 20;
    var item = this.olist[i] || {};
    var style = item.textStyle || {};
    item.textMarquee = true;
    style.transform = 'translateX(-' + x + 'px)';
};
methods.marqueeItem = function (i) {
    var node = this.$refs.item[i];
    if (node) {
        var line1 = node.children[0];
        var textElem = line1.children[1];
        var textSupElem = textElem.children[0];
        this.restartMarquee(textSupElem, i);
    }
};
let computed = {};
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
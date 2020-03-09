const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};

methods.rotate = function (item, i) {
    item.rotate = true;

    setTimeout(() => {
        // 翻滚
        item.rotate = false;
        // 更新数据
        let newItem = this.list && this.list[i];
        if (newItem) {
            item.city_title = newItem.city_title || item.city_title;
            item.user_num = newItem.user_num || item.user_num;
            item.state = newItem.state || item.state;
        }
    }, 520);
};
methods.rotateOneByOne = function (i) {
    let item = this.olist && this.olist[i];
    if (!item) {
        return;
    }
    this.rotate(item, i);
    setTimeout(() => {
        this.marqueeItem(i);
    }, 500);
    setTimeout(() => {
        this.rotateOneByOne(i + 1);
    }, 120);
};
methods.rotateAll = function () {
    this.rotateOneByOne(0);
    // this.startMarquee();
    setTimeout(() => {
        this.rotateAll();
    }, this.loopInterval);
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
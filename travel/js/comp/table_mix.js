
var mix = {
};
var methods = {};
methods.rowClick = function (item) {
    if (item.city_title === '合计') {
        return;
    }
    item.id = item.city_id;
    item.name = item.city_title;
    this.$emit('row-click', item);
};

var computed = {};
computed.mlist = function () {
    return (this.list || []).sort((a, b) => {
        return (b.user_num - a.user_num);
    });
};
mix.computed = computed;
mix.methods = methods;
mix.props = ['list'];
module.exports = mix;

var mix = {
};
var methods = {};
methods.rowClick = function (item) {
    if (item.placeName === '合计') {
        return;
    }
    item.id = item.placeId;
    item.name = item.placeName;
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
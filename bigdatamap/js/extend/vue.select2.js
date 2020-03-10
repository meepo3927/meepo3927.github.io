/**
 * Vue结合select2 插件
 */
const Vue = require('vue');
const $ = require('jquery');
require('select2');

const bind = function (el, binding) {
};
const inserted = function (el, binding) {
    var value = binding.value || {};
    var onChange = value.onChange || function () {};
    var $el = $(el);
    var options = {};
    if (value.theme) {
        options.theme = value.theme;
    }
    if (value.ajax) {
        options.ajax = value.ajax;
    }

    var args = value.args || [];
    $el.select2(options);
    $el.on('change', function (e) {
        var elem = e.currentTarget;
        var option = elem.children[elem.selectedIndex];
        var val = option ? option.value : '';
        onChange.apply(this, [val, e, option].concat(args));
    });
};
const unbind = function (el, binding) {
    var value = binding.value || {};
    var $el = $(el);
    $el.select2('destroy');
    $el.off('change');
};
module.exports = {
    bind: bind,
    inserted: inserted,
    unbind: unbind
};

/**
 * Vue结合select2 插件
 */

define(['vue', 'select2'], function (Vue, select2) {
	var bind = function (el, binding) {
	};
	var inserted = function (el, binding) {
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
	var unbind = function (el, binding) {
		var value = binding.value || {};
		var $el = $(el);
		$el.select2('destroy');
		$el.off('change');
	};
	return Vue.directive('select2', {
		bind: bind,
		inserted: inserted,
		unbind: unbind
	});
});
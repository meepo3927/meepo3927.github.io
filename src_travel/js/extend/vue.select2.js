/**
 * Vue结合select2 插件
 */

define(['vue', 'select2'], function (Vue, select2) {
	var bind = function (el, binding) {
		// $(el).select2();
	};
	var inserted = function (el, binding) {
		// console.log(el);
		var value = binding.value || {};
		var onChange = value.onChange || function () {};
		var $el = $(el);
		$el.select2();
		$el.on('change', function (e) {
			var elem = e.currentTarget;
			var option = elem.selectedOptions[0];
			var val = option ? option.value : '';
			onChange.call(this, e, val);
		});
	};
	var unbind = function (el, binding) {
		// console.log('select2 - unbind');
		// console.log(el);
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
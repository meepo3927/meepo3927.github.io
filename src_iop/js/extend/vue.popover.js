define(['vue', 'bootstrap'], function (Vue, boot) {
	var inserted = function (el, binding) {
		var value = binding.value || {};
		$(el).popover({
			placement: 'right',
			html: true,
			container: 'body',
			trigger: 'hover focus',
			content: value.content
		});
	};
	return Vue.directive('popover', {
		inserted: inserted,
		unbind: function (el) {
			$(el).popover('destroy');
		}
	});
});
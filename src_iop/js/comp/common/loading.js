/**
 * loading
 * @Vue
 * @date  2017.02.24
 */

define(['vue'], function (Vue) {
	var template = `<div class="loading-1">
		<span></span><span></span>
		<span></span><span></span>
		<span></span><span></span>
		<span></span><span></span>
	</div>`;
	var methods = {};

	var onReady = function () {
	};
	var data = function () {
		return {};
	};
	return Vue.component('vue-loading', {
		template: template,
		methods: methods,
		data: data,
		props: [],
		mounted: onReady
	});
});
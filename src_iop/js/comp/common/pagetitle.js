/**
 * 页面标题
 * @Vue
 * @date  2017.02.24
 */

define(['vue'], function (Vue) {
	var template = `<div class="page-title" v-if="main">
		<h3 v-if="sub">{{main}} - <span class="h4" v-text="sub"></span></h3>
		<h3 v-else>{{main}}</h3>
	</div>`;
	var methods = {};
	var computed = {};
	var onReady = function () {
	};
	var data = function () {
		return {};
	};
	return Vue.component('page-title', {
		template: template,
		methods: methods,
		computed: computed,
		data: data,
		props: ['main', 'sub'],
		mounted: onReady
	});
});
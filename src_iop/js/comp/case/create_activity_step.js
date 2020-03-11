/**
 * 创建营销 - 步骤
 * @Vue
 * @date  2017.02.24
 */

define(['vue'], function (Vue) {
	var template = `<div class="create-activity-step" :class="['count-' + list.length, 'cur-' + curStep]">
		<div class="back-bar">
			<div class="inner-bar"></div>
		</div>

		<ul>
			<li v-for="(item, index) in list" :class="{active: (index + 1) <= curStep}">
				<span v-text="index + 1"></span>
				<p v-text="item"></p>
			</li>
		</ul>
	</div>`;
	var methods = {};
	var computed = {};
	computed.curStep = function () {
		return this.step || 1;
	};
	var onReady = function () {
	};
	var data = function () {
		return {
			list: ['目标客群配置', '事件配置', '产品配置', '营销规则配置', '预览完成']
		};
	};
	return Vue.component('create-activity-step', {
		template: template,
		methods: methods,
		computed: computed,
		data: data,
		props: ['step'],
		mounted: onReady
	});
});
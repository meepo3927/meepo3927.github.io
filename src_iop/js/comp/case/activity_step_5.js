/**
 * 创建营销活动 - 步骤5
 * @Vue
 * @date  2017.03.01
 */

define(['vue'], function (Vue) {
	var template = `<div class="activity-step-5">
		<div class="x-title">
			<a href="javascript:;" class="x-edit-btn">
				<i class="fa fa-edit"></i>
				<span>修改</span>
			</a>
			<h4>活动配置内容预览</h4>
		</div>
		
		<ul >
			<li class="text-field" v-for="item in list">
				<label v-text="item.field + '：'"></label>
				<span v-text="item.text"></span>
			</li>
		</ul>
	</div>`;
	var methods = {};
	var computed = {};
	var onReady = function () {
	};
	var data = function () {
		var list = [
			{field: '归属营销案', text: '2017年春节营销案'},
			{field: '营销活动名称', text: '2017年春节营销案-活动1'},
			{field: '选择客群名单', text: '选择客群标签'},
			{field: '客群标签', text: '客群标签或编码'},
			{field: '客群名单拆分', text: '不拆分'},
			{field: '特殊号码过滤', text: '黑名单，红名单，敏感客户'},
			{field: '配置事件1', text: '事件名称'},
			{field: '配置事件2', text: '事件名称'},
			{field: '营销产品名称', text: '鄂尔多斯增值业务10元包'},
			{field: '推送渠道', text: '实时短信'},
			{field: '活动开始时间', text: '2017-02-01'},
			{field: '活动结束时间', text: '2017-02-08'},
			{field: '推送时段', text: '08:20-11:50，14:00-18:00'},
			{field: '推送频次', text: '每小时1次'},
			{field: '营销语', text: '营销语营销语营销语营销语营销语营销语营销语'},
		];
		return {
			list: list
		};
	};
	return Vue.component('activity-step-5', {
		template: template,
		methods: methods,
		computed: computed,
		data: data,
		props: [],
		mounted: onReady
	});
});
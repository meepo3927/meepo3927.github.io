/**
 * 创建营销活动 - 步骤2
 * @Vue
 * @date  2017.03.01
 */

define(['vue', 'autoComplete'], function (Vue, autoComplete) {
	var template = `<div class="activity-step-2">

		<form class="common-form pt30" @submit.prevent>
			<div class="layout-row cell-ver-mid x-row-1">
				<label class="x-cell x-col-1">
					<span class="color-red">*</span>选择事件名称：
				</label>
				<div class="x-cell x-col-2">
					<input type="text" class="form-control input-lg" ref="eventNameInput" 
						placeholder="请输入事件名称.."
						v-placeholder
						v-model="eventName" />
				</div>

				<div class="x-cell pl15">
					<i class="fa fa-check-circle inline-icon" v-show="view.chooseRight"></i>
					<i class="fa fa-info-circle inline-icon ml15"
						v-show="view.chooseRight"
						v-popover="{content: '事件规则1 <br />事件规则2 <br />事件规则3'}"></i>
				</div>
			</div>

			<div class="layout-row mt10">
				<div class="x-cell x-col-1"></div>
				<div class="x-cell">
					<a href="javascript:;" class="icon-text-link">
						<i class="fa fa-pencil"></i> 规则编辑
					</a>
				</div>
			</div>

		</form>
	</div>`;
	var methods = {};
	var computed = {};
	var onReady = function () {
		$(this.$refs.eventNameInput).autoComplete({
			showOnFocus: true,
			getData: function (val, callback) {
				var arr = ['Apple', 'Orange', 'Duke', 'Night'];
				callback(arr);
			},
			onClick: (val) => {
				this.eventName = val;
				this.view.chooseRight = true;
			}
		});
	};
	var data = function () {
		return {
			view: {
				chooseRight: false
			},
			eventName: ''
		};
	};
	return Vue.component('activity-step-2', {
		template: template,
		methods: methods,
		computed: computed,
		data: data,
		props: [],
		mounted: onReady
	});
});
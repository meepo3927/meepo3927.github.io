<template>
<div class="create-event-core">
	<!-- 逻辑运算 -->
	<div is="rule-relation" class="pb20 sup-style" 
		v-show="isRelationVisible"
		:option="relationOption"
		:relation="option.relation"
		@change-logic="iChangeLogic"
		@toggle-right="iToggleRight"
		@toggle-left="iToggleLeft"></div>
	<div class="panel ph20 pb20 pt10 pos-r">
		<!-- 标题 -->
		<h4 class="text-muted x-title">配置事件源（{{index + 1}}）</h4>

		<!-- 操作按钮 -->
		<div class="op-btn-box">
			<!-- 最大化按钮 -->
			<a href="javascript:;" class="win-max-btn" title="最大化" @click="maxWindow" v-show="view.win === 'min'">
				<i class="fa fa-window-maximize"></i>
			</a>
			<!-- 最小化按钮 -->
			<a href="javascript:;" class="win-min-btn" title="最小化" @click="minWindow" v-show="view.win !== 'min'">
				<i class="fa fa-window-minimize"></i>
			</a>
			<!-- 删除按钮 -->
			<a href="javascript:;" class="delete-core-btn " v-if="index > 0" @click="$emit('remove')"
				title="删除事件源">
				<i class="fa fa-times" ></i>
				<!-- <span>删除事件源</span> -->
			</a>
		</div>
		<div ref="content">
			<!-- 选择事件源 -->
			<div class="select-type-section layout-row cell-ver-mid">
				<div class="x-cell x-col-1">
					<label class="fs16">选择事件源：</label>
				</div>
				<!-- 实时事件 or 非实时事件 -->
				<div class="x-cell btn-col">
					<div class="btn-group">
						<button class="btn " @click="onRealtimeChange(false)"
							:class="[!isRealtime ? 'btn-primary' : 'btn-default']"
							:disabled="realtimeDisabled"
							:title="realtimeTitle">非实时事件</button>
						<button class="btn " @click="onRealtimeChange(true)"
							:class="[isRealtime ? 'btn-primary' : 'btn-default']"
							:disabled="realtimeDisabled"
							:title="realtimeTitle">实时事件</button>
					</div>
				</div>
				<div class="x-cell lb-col-2">
					<label class="fs16">选择事件类别：</label>
				</div>
				<!-- 事件类别 -->
				<div class="x-cell pl10">
					<v-chosen :options="evtSrcOptions" class="evt-type-select" 
						v-model="srcId" />
				</div>
			</div>

			<!-- 规则列表 -->
			<div class="config-box mt20" >
				<ul>
					<li v-for="(rule,index) in rules" 
						is="comp-rule"
						ref="rules"
						:key="rule" 
						:index="index" 
						:childcount="childrens.length"
						:rule="rule"
						:srctype="srcId"
						@change-logic="childChangeLogic(rule, $event)"
						@toggle-right="childToggleRight(rule)"
						@toggle-left="childToggleLeft(rule)"
						@remove="remove(index)"
						@moveUp="moveUp(index)"
						@moveDown="moveDown(index)"
						@set-value="setValue(rule, $event)">
					</li>

					<li v-if="lastRelationVisible" class="mt10">
						<div is="rule-relation" :option="lastRelationOption" :relation="lastRelation"
							@toggle-right="lastToggleRight"
							@toggle-left="lastToggleLeft"></div>
					</li>
				</ul>
				<button class="common-default-btn add-rule-btn" @click="addRule" 
					style="display: none;"
					:class="{'with-relation': lastRelationVisible}">
					<i class="fa fa-plus"></i> 添加规则
				</button>

				<div class="text-center mt15" >
					<button class="common-default-btn add-rule-btn" @click="addRule">
						<i class="fa fa-plus"></i> 添加规则
					</button>
				</div>
			</div>
		</div>
	</div><!-- panel -->
</div>
</template>

<script>
import coreUtil from 'util/event_core.js';
import tool from 'util/tool.js';
import config from 'config';
import request from 'util/request';

var getRelationOption = coreUtil.getRelationOption;
var getDefaultRule = coreUtil.getDefaultRule;
var methods = {};
const zeroPadCount = 6;
// 非实时事件 类型
const NON_REALTIME_SRC_TYPE = 0;
// 实时事件类型
const REALTIME_SRC_TYPE = 1;

const ruleNameFunc = (i) => {
	return 'rule' + tool.padZero(i + 1, zeroPadCount);
};
// 检查内容
methods.check = function () {

	// no rule
	if (!this.$refs.rules) {
		return true;
	}
	let pass = true;
	this.$refs.rules.forEach((rule) => {
		if (rule.check() === false) {
			pass = false;
		}
	});
	return pass;
};
methods.getEvtId = function () {
	if (this.json.evtId) {
		return this.json.evtId;
	}
	let num = tool.padZero(this.index + 1, zeroPadCount);
	return 'evt' + num;
};
methods.getRuleId = function (i) {
	if (this.json.rules && this.json.rules[i]) {
		return this.json.rules[i].ruleId || ruleNameFunc(i);
	}
	return ruleNameFunc(i);
};
methods.getRuleFormula = function () {
	let list = this.rules.map((v) => (v.relation));
	return coreUtil.getFormula(list, (i) => {
		return this.getRuleId(i);
	}, this.lastRelation);
};
methods.updateRealtime = function () {
	if (!this.eventSrcType || !this.srcId) {
		return;
	}
	// 根据srcId获取type，然后反推
	for (let i = 0; i < this.eventSrcType.length; i++) {
		if (this.eventSrcType[i].evtSrcId === this.srcId) {
			this.isRealtime = (this.eventSrcType[i].evtSrcType === REALTIME_SRC_TYPE);
			return;
		}
	}
};
methods.setValue = function (rule, arr) {
	let [key, value] = arr;
	rule.config[key] = value;
};
methods.conditionValue = function (rule, val) {
	rule.config.calcPrincId = val;
};

methods.remove = function (index) {
	let rule = this.rules[index];
	$(this.$refs.rules[index].$el).fadeOut(300, () => {
		let i = this.rules.indexOf(rule);
		if (i >= 0) {
			this.rules.splice(i, 1);
		}
		mlayer.msg('删除成功');
		this.$nextTick(this.renderRules);
	});
};
methods.moveUp = function (index) {
	if (index <= 0) {
		return false;
	}
	var rule = this.rules[index];
	if (!rule) {
		return false;
	}
	this.rules.splice(index, 1);
	this.rules.splice(index - 1, 0, rule);

	this.renderRules();
};
methods.moveDown = function (index) {
	if (index >= this.childrens.length) {
		return false;
	}
	var rule = this.rules[index];
	if (!rule) {
		return false;
	}
	this.rules.splice(index, 1);
	this.rules.splice(index + 1, 0, rule);

	this.renderRules();
};
methods.addRule = function () {
	this.rules.push(getDefaultRule());

	this.renderRules();
};
methods.renderRules = function () {
	this.renderHighlightQuotes();
};
methods.minWindow = function () {
	$(this.$refs.content).slideUp();
	this.view.win = 'min';
};
methods.maxWindow = function () {
	$(this.$refs.content).slideDown();
	this.view.win = 'max';
};
methods.fadeOut = function (callback) {
	$(this.$el).fadeOut(300, callback);
};
methods.toJSON = function () {
	let rules = [];
	this.rules.forEach((rule, i) => {
		let o = rule.config;
		o.ruleId = this.getRuleId(i);
		rules.push(o);
	});
	return {
		evtId: this.getEvtId(),
		evtSrcId: this.srcId,
		ruleSetFormula: this.getRuleFormula(),
		rules
	};
};
methods.restore = function (json) {
	this.json = json;

	let rules = [];

	// 还原事件源类型
	if (json.evtSrcId === 0) { // 旧的非实时事件
		this.srcId = this.notRealtimeSrcType[0].evtSrcId;
	} else {
		this.srcId = json.evtSrcId;
	}
	// 还原实时or非实时
	this.updateRealtime();

	// 还原公式
	let formula = json.ruleSetFormula;
	let formulaMap = coreUtil.parseFormula(formula);
	if (formulaMap.lastRight) {
		this.lastRelation.right = true;
	}

	// 还原规则 (原子)
	json.rules && json.rules.forEach((r) => {
		let rule = getDefaultRule();
		// 还原逻辑关系
		rule.relation = tool.extend(rule.relation, formulaMap[r.ruleId]);
		// 还原 选项和值
		rule.config.atomId = r.atomId;
		rule.config.calcPrincId = r.calcPrincId;
		rule.config.princArg = r.princArg;
		rule.config.ruleDesc = r.ruleDesc;

		rules.push(rule);
	});

	this.rules = rules;
	this.renderRules();
};
methods.onRealtimeChange = function (bool) {
	this.isRealtime = bool;
	this.srcId = this.evtSrcOptions[0].value;
}
var computed = {};
computed.childrens = function () {
	return this.rules || [];
};
computed.realtimeTitle = function () {
	if (this.realtimeDisabled) {
		return '事件源叠加后，不能修改事件源类型.';
	}
	return '事件源类型';
};
computed.realtimeDisabled = function () {
	return (this.childcount > 1);
};
// 事件类别选项
computed.evtSrcOptions = function () {
	let o = this.isRealtime ? this.realtimeSrcType : this.notRealtimeSrcType;
	return o.map((v) => {
		return {
			text: v.evtSrcText,
			value: v.evtSrcId
		}
	});
}
// 非实时事件 options
computed.notRealtimeSrcType = function () {
	return this.eventSrcType.filter((v) => {
		return (v.evtSrcType === NON_REALTIME_SRC_TYPE);
	});
};
computed.realtimeSrcType = function () {
	return this.eventSrcType.filter((v) => {
		return (v.evtSrcType === REALTIME_SRC_TYPE);
	});
};
const created = function () {
	request.getEventCoreConfig().then(({arr, obj}) => {
		this.eventSrcType = arr;
		if (this.fill) {
			return this.restore(this.fill);
		}
		// 默认选中 实时 or 非实时
		let defaultEvtSrcType = (this.isRealtime === true)
			? REALTIME_SRC_TYPE
			: NON_REALTIME_SRC_TYPE;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].evtSrcType === defaultEvtSrcType) {
				this.srcId = arr[i].evtSrcId;
				break;
			}
		}
	});
};
var mounted = function () {
};
let watch = {};
watch.isRealtime = function (v) {
	this.$emit('on-realtime-changed', v);
};
export default {
	data: function () {
		let view = {
			win: ''
		};
		return {
			isRealtime: !!this.mainRealtime,
			json: {},
			eventSrcType: [],
			srcId: null,
			view: view,
			rules: [getDefaultRule()]
		};
	},
	watch,
	created,
	methods,
	computed,
	props: ['option', 'fill', 'childcount', 'mainRealtime'],
	mounted,
	mixins: [
		require('./last_relation_mix.js'),
		require('./relation_parent_mix.js'),
		require('./relation_child_mix.js')
	],
	components: {
		'comp-rule': require('./rule.vue'),
		'rule-relation': require('./rule_relation.vue')
	}
};
</script>

<style scoped lang="less">
.create-event-core {
	.x-title {
		font-size: 16px;
		margin-top: 5px;
		margin-bottom: 20px;
	}
	.select-type-section {
		.x-col-1 {
			width: 100px;
			// text-align: right;
		}
		.lb-col-2 {
			width: 128px;
			padding-left: 15px;
		}
		.btn-col {
			width: 180px;
		}
		.evt-type-select {
			width: 140px;
		}
	}
	.config-box {
		background-color: #e4f1f9;
		padding: 15px 15px;
		box-shadow: 0px 0px 5px #ccc;
	}
	.op-btn-box {
		position: absolute;
		right: 10px;
		top: 10px;

		.delete-core-btn {
			font-size: 20px;
			margin-left: 6px;
		}
		.win-min-btn {
			vertical-align: 5px;
		}
	}
	.add-rule-btn {
		font-size: 14px;
		padding: 6px 10px;
		&.with-relation {
			margin-top: -45px;
		}
	}
}
</style>
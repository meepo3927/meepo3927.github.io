/**
 * 创建事件 - 规则
 * @Vue
 * @date  2017.03.08
 */

<template>
<li class="rule">

	<div is="rule-relation" class="pb10 " 
		:option="relationOption"
		:relation="rule.relation"
		@change-logic="iChangeLogic"
		@toggle-right="iToggleRight"
		@toggle-left="iToggleLeft"
		v-if="hasRelation"></div>

	<div is="rule-config" 
		ref="config"
		:option="configOption" 
		:config="rule.config"
		:srctype="srctype"
		class="mb10"
		@set-value="setValue"
		@remove="remove"
		@goUp="goUp"
		@goDown="goDown"></div>

</li>
</template>

<script>
var methods = {};
methods.check = function () {

	if (this.$refs.config.check()) {
		return true;
	}
	return false;
};
methods.setValue = function (v1) {
	this.$emit('set-value', v1);
};
methods.remove = function () {
	this.$emit('remove');
};
methods.goUp = function () {
	if (this.isFirst) {
		return false;
	}
	this.$emit('moveUp');
};
methods.goDown = function () {
	if (this.isLast) {
		return false;
	}
	this.$emit('moveDown');
};
var computed = {};
computed.hasRelation = function () {
	if (this.isFirst && this.isLast) {
		return false;
	}
	if (this.isFirst && this.length <= 2) {
		return false;
	}
	return true;
};
computed.configOption = function () {
	var option = {};
	option.isFirst = this.isFirst;
	option.isLast = this.isLast;
	return option;
};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	computed,
	props: ['rule', 'srctype'],
	mounted,
	mixins: [
		require('./relation_child_mix.js')
	],
	components: {
		'rule-relation': require('./rule_relation.vue'),
		'rule-config': require('./rule_config.vue')
	}
};
</script>

<style scoped lang="less">

</style>
/**
 * 创建事件 - 规则(逻辑)关系
 * @Vue
 * @date  2017.03.08
 */
<template>
<div class="rule-relation">
	<button class="x-right-btn" @click="iToggleRight"
		v-show="showRight"
		:class="rightClass"> ) </button>

	<div class="btn-group btn-group-lg" v-show="showLogic">
		<button class="" :class="{active: isAnd}"
			@click="iChangeLogic('and')">并</button>
		<button class="" :class="{active: isOr}"
			@click="iChangeLogic('or')">或</button>
	</div>

	<button class="x-left-btn" @click="iToggleLeft"
		v-show="showLeft"
		:class="leftClass"> ( </button>
</div>
</template>

<script>
var methods = {};
var computed = {};
computed.isAnd = function () {
	return (this.relation && this.relation.logic === 'and');
};
computed.isOr = function () {
	return (this.relation && this.relation.logic === 'or');
};
computed.rightClass = function () {
	var active = '';
	var view = '';
	if (this.relation) {
		if (this.relation.right) {
			active = 'active';
		}
		view = this.relation.view ? this.relation.view.right : '';
	}
	return [active, view];
};
computed.leftClass = function () {
	var active = '';
	var view = '';
	if (this.relation) {
		if (this.relation.left) {
			active = 'active';
		}
		view = this.relation.view ? this.relation.view.left : '';
	}
	return [active, view];
};
computed.showRight = function () {
	if (this.option) {
		// 第一条规则，没有 ')'
		if (this.option.isFirst) {
			return false;
		}
		// 就两条规则，不需要括号
		if (this.option.length <= 2) {
			return false;
		}
	}
	return true;
};
computed.showLeft = function () {
	// 下方关系配置(最后一条规则)，没有 '('
	if (this.lastRelation) {
		return false;
	}
	if (this.option) {
		// 就两条规则，不需要括号
		if (this.option.length <= 2) {
			return false;
		}
	}
	return true;
};
computed.showLogic = function () {
	if (this.lastRelation) {
		return false;
	}
	if (this.option && this.option.isFirst) {
		return false;
	}
	return true;
};
computed.lastRelation = function () {
	return this.option ? this.option.lastRelation : false;
};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	mixins: [
		require('./relation_child_mix.js')
	],
	computed,
	props: ['option', 'relation'],
	mounted
};
</script>

<style scoped lang="less">
@lessDirPath: "../../../../less";
@import (reference) "@{lessDirPath}/global/config.less";
@import (reference) "@{lessDirPath}/bootstrap/bootstrap.less";
.rule-relation {
	@small-colors: #66FF99, #9966CC, #3366FF, 
			 #993399, #FFFF33, #FF33CC,
			 #CC9966, #99CC33, #666699;
	@big-colors: #666699, #99CC33, #CC9966, #FF33CC, #FFFF33, #993399, #3366FF, #9966CC, #66FF99;
	text-align: center;
	.loopButtonBgColor(@colors, @num) when(@num > 0) {
		&.count-@{num} {
			background-color: extract(@colors, @num);
		}
		.loopButtonBgColor(@colors, @num - 1);
	}
	.x-right-btn,
	.x-left-btn {
		.loopButtonBgColor(@small-colors, length(@small-colors));
	}
	&.sup-style {
		.x-right-btn, .x-left-btn {
			.loopButtonBgColor(@big-colors, length(@big-colors));
		}
	}
	&.sup-style button {
		padding: 8px 0;
		width: 48px;
		font-size: 18px;
	}
	.btn-group > button.active {
		background-color: @btn-primary-bg;
		color: @btn-primary-color;
		border-color: @btn-primary-border;
	}
	button {
		&:extend(.btn);
		&:extend(.btn-lg);
		&:extend(.btn-default);
		font-size: 16px;
		padding: 4px 0;
		width: 38px;
		text-align: center;
		&:hover {
			border-color: #888;
		}
		&.active {
			background-color: #e6e6e6;
			border-color: #adadad;
			.box-shadow(inset 0 3px 5px rgba(0,0,0,.125));
		}
	}
}
</style>
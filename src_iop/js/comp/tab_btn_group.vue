<template>
<ul class="tab-btn-group">
	<li v-for="(item, index) in mylist" :class="{active: index + 1 === currIndex}">
		<a href="javascript:;" @click="onClick(index + 1)" v-text="item"></a>
	</li>
</ul>
</template>

<script>
var methods = {};
methods.onClick = function (index) {
	this.currIndex = index;
	this.$emit('click', index);
};
var computed = {};
computed.mylist = function () {
	return this.list ? this.list.split(';') : [];
};
var mounted = function () {
};
export default {
	data: function () {
		return {
			currIndex: this.index || 1
		};
	},
	methods,
	computed,
	props: ['list', 'index'],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../less/global/config.less";
.tab-btn-group {
	& > li {
		display: inline-block;
	}
	& > li > a {
		display: inline-block;
		color: #999;
		padding: 15px 22px;
		font-size: 18px;
		margin-right: 10px;
	}
	& > li.active a {
		color: #333;
		border-top: 3px solid @themeColor;
		background-color: #fff;
		border-radius: 5px 5px 0 0;
	}
}
</style>
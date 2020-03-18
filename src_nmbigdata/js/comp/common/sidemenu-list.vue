<template>
<ul class="sidemenu-list" :class="[lvClass]">
	<li v-for="(v, i) in list" :class="{active: isActive(i)}">

		<!-- 链接 -->
		<a href="javascript:;" @click="onClick(v, i)" >
			<i class="fa fa-th-large"></i>
			<span v-text="v.name"></span>
			<i class="fa" v-if="hasChild(v)" :class="[getAngleClass(i)]"></i>
		</a>
		
		<!-- 子菜单 -->
		<v-list v-if="hasChild(v)" 
			:data="v.childMenus"
			:level="lv + 1"
			:visible="isActive(i)"></v-list>
	</li>
</ul>
</template>

<script>
require('slimscroll');
const beforeCreate = function () {
	this.$options.components['v-list'] = require('./sidemenu-list.vue');
};
let methods = {};
methods.onClick = function (item, i) {
	if (this.active === i) {
		this.active = -1;
	} else {
		this.active = i;
	}
};
methods.hasChild = function (item) {
	return (item.childMenus && item.childMenus.length);
};
methods.initScroll = function () {
	$(this.$el).slimScroll({
		width: 'auto',
		height: '100%'
	});
};
methods.isActive = function (i) {
	return (this.active === i);
};
methods.getAngleClass = function (i) {
	return this.isActive(i) ? 'fa-angle-down' : 'fa-angle-right';
};
methods.show = function () {
	$(this.$el).slideDown();
};
methods.hide = function () {
	$(this.$el).slideUp();
};
let computed = {};
computed.list = function () {
	return this.data || [];
};
computed.lv = function () {
	if (this.level === undefined) {
		return 1;
	}
	return this.level;
};
computed.lvClass = function () {
	return 'lv-' + this.lv;
};
let watch = {};
watch.visible = function (v) {
	if (v) {
		this.$nextTick(this.show);
	} else {
		this.$nextTick(this.hide);
	}
};
const created = function () {};
const mounted = function () {
	if (this.lv === 1) {
		this.initScroll();
	}
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		active: -1
	};
	return o;
};
module.exports = {
	data: dataFunc,
	beforeCreate,
	created,
	methods,
	computed,
	watch,
	props: ['data', 'level', 'visible'],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.sidemenu-list {
	list-style: none;
	display: none;
	padding-left: 0;
	& > li {

	}
}
@back-active-color:  #293846;
@border-active-color:  #19aa8d;
// 通用
.sidemenu-list > li > a {
	color: #a7b1c2;
	padding-top: 7px;
	padding-bottom: 7px;
	padding-right: 20px;
	display: block;
	font-weight: 600;
	&:focus {
		text-decoration: none;
	}
	&:hover {
		text-decoration: none;
		color: #fff;
	}
	& > .fa-th-large {
		margin-right: 6px;
		display: none;
	}
	& > .fa-angle-right,
	& > .fa-angle-down {
		float: right;
		margin-top: 2px;
	}
}
.sidemenu-list > li.active {
	background-color: @back-active-color;
	& > a {
		color: #fff;
	}
}
// 一级
ul.lv-1 {
	display: block;
}
ul.lv-1 > li > a {
	padding-left: 20px;
	padding-top: 14px;
	padding-bottom: 14px;
	&:hover {
		background-color: @back-active-color;
	}
	& > .fa-th-large {
		display: inline;
	}
}
ul.lv-1 > li.active {
	border-left: 4px solid @border-active-color;
}
// 二级
ul.lv-2 > li > a {
	padding-left: 46px;
}
</style>

<template>
<div class="m-sidemenu">
	<!-- 头 -->
	<div class="x-head">
		<p>
			<img class="x-avatar" :src="avatarUrl"/>
		</p>
		<p class="x-username">
			<strong>张华磊</strong>
		</p>
	</div>
	<!-- 列表 -->
	<ul is="v-list" class="v-list"
		:data="data"></ul>
</div>
</template>

<script>

let methods = {};
methods.getMenu = function () {
	return this.vRequest.menu().then((data) => {
		if (data.parMenus) {
			return data.parMenus;
		} else {
			return data;
		}
	});
};
let computed = {};
computed.avatarUrl = function () {
	return this.vImgPath + '/sidemenu/avatar.jpg';
};
let watch = {};
const created = function () {};
const mounted = function () {
	this.getMenu().then((data) => {
		this.data = data;
	});
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		data: null
	};
	return o;
};
module.exports = {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: [],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {
		'v-list': require('./sidemenu-list.vue')
	}
};
</script>

<style scoped lang="less">
@head-height:  148px;
.m-sidemenu {
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	padding-top: @head-height;
}
.x-head {
	padding: 33px 25px;
	height: @head-height;
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
	background: url("../../../images/sidemenu/header-profile.png");
	text-align: center;
}
.x-avatar {
	width: 48px;
	height: 48px;
	border-radius: 50%;
}
.x-username {
	color: #88dddd;
	strong {
		letter-spacing: 2px;
		margin-right: -1px;
	}
}
</style>

<style lang="less">
@menu-width:  220px;
@back-color:  #2F4050;
.m-sidemenu {
	width: @menu-width;
	background-color: @back-color;
}
</style>
<template>
<div class="side-menu">
	<ul>
		<li v-for="item in list" :class="{active: checkActive(item)}">
			<a :href="item.url">
				<i class="fa" :class="[item.icon]"></i>
				<span v-text="item.text"></span>
			</a>
		</li>
	</ul>
</div>
</template>

<script>
var methods = {};
methods.checkActive = function (item) {
	if (item.text === this.active) {
		return true;
	}
	return false;
};
var computed = {};
computed.list = function () {
	return this.menulist;
};
var watch = {};
var mounted = function () {};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/sidemenu.js')
	],
	methods,
	computed,
	props: ['active'],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.side-menu {
	
}
</style>
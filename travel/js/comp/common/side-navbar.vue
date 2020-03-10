<template>
<div class="side-navbar">
	<!-- entry -->
	<a href="javascript:;" class="x-entry" >
		<img :src="entryImgSrc" alt="">
	</a>

	<!-- list -->
	<ul class="menu-list">
		<li v-for="v in list" :class="{active: v.name === activeName}">
			<a :href="v.url" @click="onClick(v.url)">
				<i class="fa" :class="[v.icon]"></i>
				<h5 v-text="v.name"></h5>
			</a>
		</li>
		
	</ul>
</div>
</template>

<script>
var methods = {};
methods.onClick = function (url) {
	if (url === 'javascript:;') {
		return mlayer.msg('仅供演示');
	}
};
var computed = {};
computed.list = function () {
	let mid = [{
		icon: 'fa-mail-forward',
		url: 'javascript:;',
		name: '来市游客分析'
	}];
	return [
		{
			icon: 'fa-map-marker',
			url: '',
			name: '景区大数据'
		}
	].concat(mid).concat([
		{
			icon: 'fa-mail-reply',
			url: 'javascript:;',
			name: '出省游客分析'
		},
		{
			icon: 'fa-sign-out',
			url: 'javascript:;',
			name: '退出系统'
		}
	]);
};
computed.entryImgSrc = function () {
	return './images/side_navbar_entry.png';
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
	mixins: [],
	methods,
	computed,
	props: ['activeName'],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.side-navbar {
	
}
</style>
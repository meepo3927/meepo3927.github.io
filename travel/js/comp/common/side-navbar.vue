<template>
<div class="side-navbar" v-show="rootVisible">
	<!-- entry -->
	<a href="javascript:;" class="x-entry" >
		<img :src="entryImgSrc" alt="">
	</a>

	<!-- list -->
	<ul class="menu-list">
		<li v-for="v in list" :class="{active: v.name === activeName}">
			<a :href="v.url">
				<i class="fa" :class="[v.icon]"></i>
				<h5 v-text="v.name"></h5>
			</a>
		</li>
		
	</ul>
</div>
</template>

<script>
var methods = {};
var computed = {};
computed.rootVisible = function () {
	if (this.vConfig.user.auth === 'all') {
		return true;
	}
	if (this.vConfig.user.olen <= 3) {
		return true;
	}
	return false;
};
computed.list = function () {
	let mid = [];
	if (this.vConfig.user.auth === 'all') {
		mid.push({
			icon: 'fa-mail-forward',
			url: this.getStaticUrl('/enter_city'),
			name: '来市游客分析'
		});
	}
	return [
		{
			icon: 'fa-map-marker',
			url: this.getStaticUrl('/../index'),
			name: '景区大数据'
		}
	].concat(mid).concat([
		{
			icon: 'fa-mail-reply',
			url: this.getStaticUrl('/leave_city'),
			name: '出省游客分析'
		},
		{
			icon: 'fa-sign-out',
			url: this.vlogoutUrl,
			name: '退出系统'
		}
	]);
};
computed.entryImgSrc = function () {
	return this.vImgPath + '/side_navbar_entry.png';
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
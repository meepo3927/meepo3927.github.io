<template>
<div class="v-main">
	<h2 class="main-title">核心地段实时客流量</h2>
	<ul class="city-list">
		<li v-for="v in citylist" :class="{active: v.id === activeCity}">
			<a href="javascript:;" v-text="v.name" @click="onCityClick(v)"></a>
		</li>
	</ul>
	<div class="m-panel rank-list-wrapper">
		
		<!-- 列表 -->
		<rank-list :list="list" class="rank-list" v-if="list !== null" />
		<!-- 提示 -->
		<p class="empty-text" v-show="emptyVisible">暂无数据</p>
	</div>
</div>
</template>

<script>
import request from 'util/request.js';

let methods = {};
methods.onCityClick = function (city) {
	this.activeCity = city.id;
	this.fetch();
};
methods.fetch = function () {
	this.list = null;
	this.emptyVisible = false;
	let ld = mlayer.loading();
	const sortFunc = (a, b) => {
		return (b.user_num - a.user_num);
	};
	request.getHotAreas(this.activeCity).then((result) => {
		ld.close();
		if (result) {
			result.sort(sortFunc);
		}
		this.list = (result);
	}).catch(() => {
		ld.close();
		this.list = null;
		this.emptyVisible = true;
	});
};
let computed = {};

computed.citylist = function () {
	return request.getStaticCityList();
};
let watch = {};
const created = function () {};
const mounted = function () {
	this.fetch();
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		activeCity: 471,
		list: null,
		emptyVisible: false
	};
	return o;
};
export default {
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
		'rank-list': require('comp/hot-rank-list.vue')
	}
};
</script>

<style scoped lang="less">
.v-main {

}

.rank-list-wrapper {
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
.rank-list {
	// margin-top: .2rem;
}
.city-list {
	overflow-x: auto;
	overflow-y: hidden;
    display: flex;
    height: .74rem;
    margin-top: .08rem;
    @active-color: #2edbff;
    -webkit-overflow-scrolling: touch;
    & > li {
		white-space: nowrap;
		float: left;
		line-height: 0;
		padding: 0 .2rem;
    }
    & > li.active > a {
    	color: @active-color;
    	border-bottom: .04rem solid @active-color;
    }
    & > li > a {
    	display: inline-block;
    	padding: .18rem  0;
    	color: #333;
    	font-size: .34rem;
    	color: #fff;
    }
}
.empty-text {
	text-align: center;
	color: #fff;
	font-size: .34rem;
	padding-top: .2rem;
}
</style>

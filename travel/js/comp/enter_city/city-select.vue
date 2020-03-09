<template>
<div class="city-select">
	<div class="x-wrapper">
		<!-- 标题 -->
		<h4 v-text="title"></h4>
		<!-- 关闭按钮 -->
		<a href="javascript:;" class="layer-close-btn" @click="close">
			<i class="fa fa-times"></i>
		</a>
		<!-- 城市 -->
		<div class="city-section" >
			<ul class="city-list clearfix" >
				<li v-for="item in citylist" :class="{active: item.name === cityName}"
					:title="item.name">
					<a href="javascript:;" @click="select('city', item)" v-text="item.name"></a>
				</li>
			</ul>
		</div>
		
	</div>
</div>
</template>

<script>
import request from 'util/request';
import myStore from 'store/rightbar.js';

var methods = {};
methods.close = function () {
	this.$emit('close');
};
methods.select = function (level, item = {}) {
	item.level = level;
	this.$emit('select', item);
};

var computed = {};
computed.title = function () {
	return '城市列表';
};
computed.cityName = function () {
	return myStore.getters.areaName;
};
var mounted = function () {
	this.citylist = request.getStaticCityList();
};
let dataFunc = function () {
	var o = {
		citylist: []
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../ref.less";
.city-list {
	margin-left: 15px;
	li {
		margin-bottom: 12px;
		width: 48%;
	}
}
</style>
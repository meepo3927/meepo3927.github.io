<template>
<div class="location-search">
	<div class="x-wrapper">
		<input type="text" class="input-text" placeholder="输入你想找的城市/景点" 
			ref="input" v-placeholder 
			@input="search"
			v-model="keyword" />
		<a href="javascript:;" class="clear-btn" v-show="keyword.length" @click="clean">
			<i class="fa fa-times"></i>
		</a>
		<a href="javascript:;" class="search-btn" @click="search">
			<i class="fa fa-search"></i>
		</a>
	</div>

	<result-list :data="result" class="result-list" key-name="placeName" 
		@click="onClick" />
</div>
</template>

<script>
import $ from 'jquery';
import request from 'util/request';
var methods = {};
methods.onClick = function (v, i) {
	this.result = undefined;
	this.$emit('select', v);
};
methods.search = function () {
	if (!this.keyword) {
		this.result = undefined;
		return;
	}
	let p = request.searchPlace(this.keyword);
	this.result = 'loading';
	request.U(p, 'location-search').then((result) => {
		this.result = result;
	}, () => {
		this.result = null;
	});
};
methods.clean = function () {
	this.keyword = '';
	this.result = undefined;
	this.$nextTick(function () {
		if (this.$refs.input.mPlaceholder) {
			this.$refs.input.mPlaceholder.renderEmpty();
		}
	});
};
var computed = {};
var mounted = function () {
};
let data = function () {
	var o = {
		keyword: '',
		result: undefined
	};
	return o;
};
export default {
	data,
	methods,
	computed,
	props: [],
	mounted,
	components: {
		'result-list': require('comp/common/search-result-list.vue')
	}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
@height: @bar-height-1;
@search-btn-width: @bar-height-1 + 10px;
.location-search {
	position: fixed;
	left: @layerLeft;
	top: @layerTop1;
	height: @height;
	z-index: 1000;
	box-shadow: 0 3px 3px #aaa;
}
.x-wrapper {
	height: 100%;
	font-size: 0;
	position: relative;
}
input[type=text] {
	height: 100%;
	width: @layerWidth-1;
	font-size: @base-font-size;
	border: none;
}
.clear-btn,
.search-btn {
	display: inline-block;
	height: 100%;
	vertical-align: top;
	text-align: center;
	line-height: @height - 2;
	font-size: @title-font-size + 2;
}
.clear-btn {
	color: #999;
	width: 50px;
	background-color: #fff;
	position: absolute;
	top: 0;
	right: @search-btn-width;
}
.search-btn {
	background-color: @bar-color;
	color: #fff;
	width: @search-btn-width;
}
.result-list {
	width: @layerWidth-1;
	max-height: 540px;
}
</style>
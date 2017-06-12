<template>
<div class="location-search">
	<div class="x-wrapper">
		<input type="text" class="input-text" placeholder="搜城市，找景点" 
			ref="input"
			v-placeholder 
			v-model="val" />
		<a href="javascript:;" class="clear-btn" v-show="val.length" @click="clean()">
			<i class="fa fa-times"></i>
		</a>
		<a href="javascript:;" class="search-btn">
			<i class="fa fa-search"></i>
		</a>
	</div>
</div>
</template>

<script>
import {$} from 'common';
import 'autoComplete';
import request from 'util/request';
var methods = {};
methods.clean = function () {
	this.val = '';
	this.$nextTick(function () {
		if (this.$refs.input.mPlaceholder) {
			this.$refs.input.mPlaceholder.renderEmpty();
		}
	});
};
var computed = {};
var mounted = function () {
	var self = this;
	$(this.$refs.input).autoComplete({
		showOnFocus: true,
		maxHeight: 400,
		onClick: function (val, e) {
			self.$emit('select', val.item || val);
		},
		getData: function (val, callback) {
			request.searchPlace(val).then((result) => {
				callback(result.map((item) => {
					return {
						item: item,
						value: item.placeID,
						text: item.placeName
					};
				}));
			}, function () {
				callback();
			});
		}
	});
};
let data = function () {
	var o = {
		val: ''
	};
	return o;
};
export default {
	data,
	methods,
	computed,
	props: [],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../less/global/config";
@height: @bar-height-1;
@search-btn-width: @bar-height-1 + 10px;
.location-search {
	position: fixed;
	left: @layerLeft;
	top: @layerTop1;
	height: @height;
}
.x-wrapper {
	height: 100%;
	font-size: 0;
	position: relative;
}
input[type=text] {
	height: 100%;
	width: @layerWidth-1 - @search-btn-width;
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
	background-color: #3385FF;
	color: #fff;
	width: @search-btn-width;
}
</style>
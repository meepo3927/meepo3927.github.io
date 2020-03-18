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
		<div class="city-section" v-if="isCitylistVisible">
			<label for="">城市：</label>
			<ul class="city-list clearfix" >
				<li :class="{active: isProvince}">
					<a href="javascript:;" @click="select('province')">全区</a>
				</li>
				<li v-for="item in citylist" :class="{active: item.name === cityName}">
					<a href="javascript:;" @click="select('city', item)" v-text="item.name"></a>
				</li>
			</ul>
		</div>
		<!-- 景区 -->
		<ul class="attraction-section">
			<li class="clearfix" v-for="city in attractionlist" v-if="city.places && city.places.length">
				<template v-if="showCity(city)">
					<label>
						<span class="x-char">{{city.char}}</span>
						<a href="javascript:;" @click="select('city', city)">{{city.name}}：</a>
					</label>
					<ul class="clearfix">
						<li v-for="p in city.places" :class="{active: p.placeName === attractionName}">
							<a href="javascript:;" v-text="p.placeName" @click="selectAttraction(p)"></a>
						</li>
					</ul>
				</template>
			</li>
		</ul>
	</div>
</div>
</template>

<script>
import request from 'util/request';
var methods = {};
methods.showCity = function (item) {
	if (this.isProvince) {
		return true;
	}
	if (this.level === 'city') {
		return (this.cityName === item.name);
	}
	for (let i = 0; i < item.places.length; i++) {
		if (item.places[i].placeID == this.attractionId) {
			return true;
		}
	}
	return false;
};
methods.close = function () {
	this.$emit('close');
};
methods.select = function (level, item = {}) {
	item.level = level;
	this.$emit('select', item);
};
methods.selectAttraction = function (item) {
	this.$emit('select', {
		level: 'attraction',
		id: item.placeID,
		name: item.placeName,
		item: item
	});
};
var computed = {};
computed.title = function () {
	if (this.auth === 'all') {
		return '城市列表';
	}
	return '景区列表';
};
computed.isCitylistVisible = function () {
	if (this.auth === 'all') {
		return true;
	}
	return false;
};
computed.attractionId = function () {
	return (this.level === 'attraction') ? this.area.id : 0;
};
computed.cityName = function () {
	return (this.level === 'city') ? this.area.city : null;
};
computed.attractionName = function () {
	return (this.level === 'attraction') ? this.area.attraction : null;
};
computed.level = function () {
	return this.area.level || '';
};
computed.isProvince = function () {
	return (this.level === 'province');
};
var mounted = function () {
	request.getCities().then((result) => {
		
		let citylist = [];
		var hash = {};
		result.forEach((item) => {
			let pinyin = request.getPinyin(item.placeName);
			let char = pinyin.charAt(0).toUpperCase();
			let info = {
				id: item.placeID,
				name: item.placeName,
				places: item.places
			};
			citylist.push(info);
			if (hash[char]) {
				hash[char].push(info);
			} else {
				info.char = char;
				hash[char] = [info];
			}
		});
		var list = [];
		var start = ('A').charCodeAt(0);
		var end = ('Z').charCodeAt(0);
		for (var i = start; i <= end; i++) {
			var c = String.fromCharCode(i);
			if (hash[c]) {
				list = list.concat.apply(list, hash[c]);
			}
		}
		this.citylist = citylist;
		this.attractionlist = list;
	});
};
let dataFunc = function () {
	var o = {
		citylist: [],
		attractionlist: []
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: ['area', 'auth'],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../ref";

</style>
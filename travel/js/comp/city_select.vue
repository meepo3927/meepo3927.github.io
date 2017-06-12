<template>
<div class="city-select">
	<div class="x-wrapper">
		<h4 class="layer-top-title" v-text="title"></h4>
		<a href="javascript:;" class="layer-close-btn" @click="close"><i class="fa fa-times"></i></a>
		<!-- 城市 -->
		<ul class="city-list clearfix" v-show="isCitylistVisible">
			<li><a href="javascript:;" @click="select('province')">全区</a></li>
			<li v-for="item in citylist" :class="{active: item.name === cityName}">
				<a href="javascript:;" @click="select('city', item)" v-text="item.name"></a>
			</li>
		</ul>
		<!-- 景区 -->
		<ul class="attraction-section">
			<li class="clearfix" v-for="city in attractionlist" v-if="city.places && city.places.length">
				<template v-if="showCity(city)">
					<label>
						<span class="x-char">{{city.char}}</span>
						<a href="javascript:;" @click="select('city', city)">{{city.name}}：</a>
					</label>
					<ul>
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
	if (this.level === 'province') {
		return true;
	}
	if (this.level === 'city') {
		return (this.cityName === item.name);
	}
	for (let i = 0; i < item.places.length; i++) {
		if (item.places[i].placeID === this.attractionId) {
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
@import (reference) "../../less/global/config";
@border-color: #ccc;
@link-active-color: darken(@theme-color, 15%);
.city-select {
	position: fixed;
	top: @layerTop2;
	right: @layerRight;
	width: @layerWidth-2;

	background-color: #fff;
	border: 1px solid @border-color;
}
.city-select > .x-wrapper {
	position: relative;
	& > h4 {
		border-bottom: 1px solid @border-color;
	}
	.layer-close-btn {
		position: absolute;
		right: 10px;
		top: 4px;
	}
	.city-list {
		padding: 8px 10px;
		border-bottom: 1px solid @border-color;
		li {
			float: left;
			margin-bottom: 8px;
		}
		li a {
			font-size: @title-font-size;
			color: @theme-color;
			margin-right: 12px;
			&:hover {
				color: darken(@theme-color, 30%);
			}
		}
		li.active a {
			font-weight: bold;
			color: @link-active-color;
		}
	}
	.attraction-section {
		padding: 16px 10px 5px;
		color: #666;
		max-height: 430px;
		overflow: auto;
		& > li {
			a {
				color: @theme-color;
				font-size: @title-font-size;
			}
			a:hover {
				color: darken(@theme-color, 30%);
			}
			& > label {
				float: left;
				width: 106px;
				.x-char {
					display: inline-block;
					width: 25px;
					font-size: @title-font-size + 6;
					color: #ccc;
					font-weight: 700;
					vertical-align: top;
					margin-top: -3px;
				}
			}
			& > ul {
				width: 246px;
				float: left;
				display: block;
				margin-bottom: 10px;
				margin-top: 0px;
			}
			& > ul > li {
				margin-bottom: 8px;
				a {
					font-size: @base-font-size;
					line-height: @base-font-size + 3px;
				}
				&.active a {
					font-weight: bold;
					color: @link-active-color;
				}
			}

		}
	}
}
</style>
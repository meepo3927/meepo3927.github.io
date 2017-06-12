<template>
<div class="rank-list m-panel p10">
	<h2>景区客流监控</h2>
	<h6>Hot Sceneries Rank</h6>

	<div class="x-list">
	
		<!-- item -->
		<div class="x-item" v-for="(item, index) in list" ref="item">
			<div class="line-1" :class="{'a-rotate': item.rotate}">
				<!-- 序号 -->
				<span class="x-index" >{{index + 1}}.</span>

				<!-- 名称 -->
				<div class="x-text" >
					<div v-text="item.city_title" 
						:class="{'a-marquee': item.textMarquee}"
						:style="item.textStyle">
					</div>
				</div>
				<!-- 人数 -->
				<div class="x-count" >{{item.user_num}}人</div>
				<!-- 状态 -->
				<div class="x-status state-1">{{item.state}}</div>
				
			</div>
			<!-- 标线 -->
			<div class="line-2" :class="{active: item.lineMove}">
				<div class="light"></div>
			</div>
			<!-- 底色线 -->
			<div class="line-3"></div>
			
		</div><!-- end item -->
		

		<!--
		<div class="x-item">
			<div class="line-1">
				<span class="x-index">NO.2</span>
				<div class="x-text">呼伦贝尔古城</div>
			</div>
			<div class="line-2"></div>
			<div class="line-3"></div>
		</div>
		-->
	</div>
</div>
</template>

<script>
import request from 'util/request';
import transitionEnd from 'util/transitionend.js';
import URL from 'util/url';
import config from 'global/config';
let loopInterval = 6400;

const randomUserNum = () => {
	let r = Math.random();
	if (r < .6) {
		return 0;
	}
	return parseInt(Math.random() * 3) + 1;
};

const USER_NUM_ADD = 100;

const processData = function (r) {
	const cid = URL.query().id;
	let list = [];
	if (!r) {
		return list;
	}
	r.forEach((v, index) => {
		var o = {
			rotate: false,
			textMarquee: false,
			textStyle: {
				'transform': 'translateX(0px)'
			},
			lineMove: false
		};
		if (cid && v.city_id == cid) {
			return;
		}
		for (let i in v) {
			o[i] = v[i];
		}
		o.user_num = parseInt(o.user_num / config.bigShowRatio);
		o.user_num += randomUserNum() + USER_NUM_ADD;
		list.push(o);
	});
	return list;
};

var methods = {};
methods.rotate = function (item, i) {
	item.rotate = true;

	setTimeout(() => {
		// 翻滚
		item.rotate = false;
		// 更新数据
		let newItem = this.mlist && this.mlist[i];
		if (newItem) {
			item.city_title = newItem.city_title || item.city_title;
			item.user_num = newItem.user_num || item.user_num;
			item.state = newItem.state || item.state;
		}
	}, 520);
};
methods.rotateOneByOne = function (i) {
	let item = this.list[i];
	if (!item) {
		return;
	}
	this.rotate(item, i);
	setTimeout(() => {
		this.marqueeItem(i);
	}, 500);
	setTimeout(() => {
		this.rotateOneByOne(i + 1);
	}, 120);
};
methods.rotateAll = function () {
	this.rotateOneByOne(0);
	// this.startMarquee();
	setTimeout(() => {
		this.rotateAll();
	}, loopInterval);
};
methods.lineMoveOneByOne = function (i) {
	let item = this.list[i];
	if (!item) {
		return;
	}

	item.lineMove = true;

	setTimeout(() => {
		item.lineMove = false;
	}, 520);

	setTimeout(() => {
		this.lineMoveOneByOne(i + 1);
	}, 120);
};
methods.lineMoveAll = function () {
	this.lineMoveOneByOne(0);
	setTimeout(() => {
		this.lineMoveAll();
	}, loopInterval);
};
methods.stopMarquee = function (elem, i) {
	var item = this.list[i] || {};
	var style = item.textStyle || {};
	item.textMarquee = false;
	style.transform = 'translateX(0px)';
	/*
	if (elem.transitionEnd && elem.transitionEnd.remove) {
		elem.transitionEnd.remove();
	}
	*/
};
methods.restartMarquee = function (elem, i) {
	this.stopMarquee(elem, i);
	setTimeout(() => {
		this.startMarquee(elem, i);
	}, 50);
};
methods.startMarquee = function (elem, i) {
	var textElem = elem.parentNode || elem.parentElement;
	var w1 = textElem.clientWidth || textElem.offsetWidth;
	var w2 = elem.scrollWidth;
	var v = w2 - w1;
	if (v < 5) {
		return;
	}

	var x = v + 20;
	var item = this.list[i] || {};
	var style = item.textStyle || {};
	item.textMarquee = true;
	style.transform = 'translateX(-' + x + 'px)';

};
methods.marqueeItem = function (i) {
	var node = this.$refs.item[i];
	if (node) {
		var line1 = node.children[0];
		var textElem = line1.children[1];
		var textSupElem = textElem.children[0];
		this.restartMarquee(textSupElem, i);
	}
};

methods.request = function () {
	if (this.rPromise) {
		return this.rPromise;
	}
	this.rPromise = request.getBigBoard();

	return this.rPromise;
};

methods.fetchRender = function (callback) {
	this.request().then((r) => {
		let list = processData(r);
		this.list = list;

		this.$nextTick(callback);

		this.loopNext();
	});
};

methods.refresh = function () {
	this.request().then((r) => {
		let list = processData(r);
		this.mlist = list.sort((a, b) => {
			return b.user_num - a.user_num;
		});
		this.loopNext();
	});
};

methods.loopNext = function () {
	this.loopTimer = setTimeout(() => {
		this.refresh();
	}, loopInterval - 1000);
};

var computed = {};
var watch = {};

const MAX_COUNT = 15;

var mounted = function () {
	this.fetchRender(() => {
		this.lineMoveAll();
		this.rotateAll();
	});
	setInterval(() => {
		this.rPromise = null;
	}, 60 * 1000);
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		list: []
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: [],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.rank-list {
	
}
</style>
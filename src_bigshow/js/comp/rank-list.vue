<template>
<div class="rank-list m-panel p10">
	<h2>热门景区排行</h2>
	<h6>Hot Sceneries Rank</h6>

	<div class="x-list">
	
		<!-- item -->
		<div class="x-item" v-for="(item, index) in list" ref="item">
			<div class="line-1" :class="{'a-rotate': item.rotate}">
				<span class="x-index" >NO.{{index + 1}}</span>
				<div class="x-text" >
					<div v-text="item.text" 
						:class="{'a-marquee': item.textMarquee}"
						:style="item.textStyle"></div>
				</div>
			</div>
			<div class="line-2" :class="{active: item.lineMove}">
				<div class="light"></div>
			</div>
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

let loopInterval = 6400;
var methods = {};
methods.rotate = function (item) {
	item.rotate = true;

	setTimeout(() => {
		item.rotate = false;
	}, 520);
};
methods.rotateOneByOne = function (i) {
	let item = this.list[i];
	if (!item) {
		return;
	}
	this.rotate(item);
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
	}, loopInterval)
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

var computed = {};
var watch = {};
var mounted = function () {
	request.getCities().then((r) => {
		let list = [];
		r.forEach((city) => {
			if (list.length >= 20) {
				return;
			}
			if (city.places) {
				city.places.forEach((v) => {
					list.push({
						rotate: false,
						textMarquee: false,
						textStyle: {
							'transform': 'translateX(0px)'
						},
						lineMove: false,
						text: v.placeName
					});
					if (list.length >= 20) {
						return;
					}
				});
			}
		});
		this.list = list;
		this.$nextTick(() => {
			this.lineMoveAll();
			this.rotateAll();
		});
	});

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
<template>
<ul class="rank-list" v-if="olist">
	<li v-for="(v, i) in olist" ref="item">
		<div class="row-1" :class="{'a-rotate': v.rotate}">
			<!-- 序号 -->
			<span class="x-index" >{{i + 1}}.</span>
			<!-- 名称 -->
			<div class="x-text">
				<div v-text="v.city_title" 
					:class="{'a-marquee': v.textMarquee}"
					:style="v.textStyle">
				</div>
			</div>
			<!-- 人数 -->
			<div class="x-count" >{{v.user_num}}人</div>
			<!-- 状态 -->
			<div class="x-status state-1">{{v.state}}</div>
		</div>
		<div class="row-line" :class="{active: v.lineMove}">
			<div class="light"></div>
		</div>
		<div class="row-line-bottom"></div>
	</li>
</ul>
</template>

<script>
const loopInterval = 6400;

let methods = {};
methods.init = function () {
	if (!this.list || this.inited) {
		return;
	}
	this.olist = this.list.map((v) => {
		var o = {
			rotate: false,
			textMarquee: false,
			textStyle: {
				'transform': 'translateX(0px)'
			},
			lineMove: false
		};
		for (let i in v) {
			o[i] = v[i];
		}
		return o;
	});
	this.$nextTick(() => {
		this.rotateAll();
		this.lineMove();
	});
	this.inited = true;
};


let computed = {};
computed.loopInterval = function () {
	return loopInterval;
};
let watch = {};
watch.list = function (v) {
	this.init();
};
const created = function () {};
const mounted = function () {
	window.RankList = this;
	this.init();
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		olist: null
	};
	return o;
};
export default {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: ['list'],
	mounted,
	mixins: [
		require('mixins/rank_marquee.js'),
		require('mixins/rank_rotate.js'),
		require('mixins/rank_linemove.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@rank-list-font-size:   .30rem;
@rank-list-box-height:  .7rem;
@item-padding-top:      .1rem;
@rank-list-text-bottom: .14rem;
@state-color-1: #70AD47;
@state-color-2: #FFC000;
@state-color-3: #FF0000;
@row-line-height: 4px;
li {
	position: relative;

}
li > .row-1 {
	color: #fff;
	line-height: 0;
	white-space: nowrap;
	display: flex;
	font-size: @rank-list-font-size;
	align-items: center;
	padding-top: @item-padding-top;
	height: @rank-list-box-height;
	margin-bottom: @rank-list-text-bottom;

	transform-style: preserve-3d;
	transform-origin: 50% 50% 0px;
	transition: transform 500ms cubic-bezier(0.15, 0.52, 0.5, 0.9);
	&.a-rotate {
		transform: rotateX(-90deg);
		transition: transform 500ms cubic-bezier(0.55, 0.18, 0.92, 0.46);
	}
	& > .x-index {
		color: #1397ff;
		padding-right: 14px;
		font-weight: bold;
		margin-top: -.04rem;
		padding-left: .15rem;
	}
	& > .x-text {
		flex: auto;
		overflow: hidden;
		vertical-align: baseline;
		height: .38rem;
	}
	& > .x-text > div {
		transform: translateX(0px);
		&.a-marquee {
			transition: transform 6000ms linear;
		}
	}
	& > .x-count {
		padding-left: 12px;
		color: #FFFFCC;
		// color: lighten(@state-color-1, 10%);
	}
	& > .x-status {
		margin-left: 12px;
		margin-right: .15rem;
		font-size: @rank-list-font-size - 4px;
		padding: 4px 8px;
		background-color: @state-color-1;
	}
}
.row-line {
	height: @row-line-height;
	background: rgb(19, 112, 251);
	display: inline-block;
	overflow: hidden;
	position: absolute;
	bottom: 0px;
	left: 0px;
	width: 100%;
	& > .light {
		position: absolute;
		top: 0px;
		width: 70px;
		height: @row-line-height / 2;
		background: radial-gradient(rgb(40, 248, 255) 5%, rgba(0, 0, 0, 0) 80%);
		transform: translateX(-70px);
	}
	&.active > .light {
		transform: translateX(200px);
		transition: transform 500ms ease-in-out;
	}
}
.row-line-bottom {
	height: @row-line-height / 2;
	background: rgb(13, 57, 146);
	width: 100%;
	display: block;
	overflow: hidden;
	position: relative;
}
</style>

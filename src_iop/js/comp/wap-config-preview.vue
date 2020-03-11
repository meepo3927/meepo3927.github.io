<template>
<div class="wap-preview" >
	<div class="x-wrapper wap-preview-wrapper" :style="wrapperStyle" ref="wrapper">
		<!-- 页面标题 -->
		<h1 v-text="my.pageTitle"></h1>
		<div class="x-body" ref="body">
			<!-- banner -->
			<div class="banner-template "
				v-if="my.bannerTemplate" 
				v-html="bannerTemplate">
			</div>
			<div class="banner-text" v-if="showBannerText" :style="bannerStyle">
				{{my.bannerSelfChar}}
			</div>
			<div class="banner-image" v-if="my.bannerSelfJpg">
				<img :src="my.bannerSelfJpg" >
			</div>
			<!-- 活动内容 -->
			<div class="content-text" v-if="actContentChar">
				<p v-html="actContentChar"></p>
			</div>
			<div class="content-image"  v-if="contentImage">
				<a :href="my.actContentJpgUrl" @click.prevent="jump(my.actContentJpgUrl)" >
					<img :src="contentImage" />
				</a>
			</div>
			<!-- 业务推荐 -->
			<ul class="recommend-list" v-if="hasRecommend">
				<li v-for="item in my.recommendlist" class="m-row">
					<div class="col-1" >
						<div v-text="item.intro"></div>
					</div>
					<div class="col-2">
						<a href="javascript:;" :data-id="item.product">立即订购</a>
					</div>
				</li>
			</ul>
			<!-- 活动说明 -->
			<div class="instruction">
				<h4 v-text="my.actExpTitle" v-if="my.actExpTitle"></h4>
				<p v-html="actExpContent" v-if="actExpContent"></p>
			</div>
			
		</div>
	</div>
</div>
</template>

<script>
import tool from 'util/tool.js';
import html2canvas from 'html2canvas';
import Promise from 'promise';

const escapeContent = (str) => {
	if (!str) {
		return '';
	}
	var content = tool.escapeHTML(str);
	content = content.replace(/\n/g, '<br />');
	return content;
};
var methods = {};
methods.jump = function (url) {
	if (url) {
		mlayer.msg('跳转:' + url);
	}
};
methods.getBannerTemplate = function (i) {
	// Banner 模板
	let bannerTemplate = {};
	// 中国移动LOGO
	bannerTemplate[2] = `
		<img src="${this.vImgPath}/logo.png" />
	`.trim();
	// 最新活动
	bannerTemplate[3] = `
		<h4>最新活动</h4>
	`.trim();
	// 聚惠来袭
	bannerTemplate[4] = `
		<h4>聚惠来袭</h4>
	`.trim();

	return bannerTemplate[i];
};
methods.makeImage = function (callback) {
	let clonedWrapper = this.$refs.wrapper.cloneNode(true);
	clonedWrapper.className += ' cloned';
	let top = document.documentElement.scrollTop || document.body.scrollTop;
	let left = document.documentElement.scrollLeft || document.body.scrollLeft;
	clonedWrapper.style.top = top + 'px';
	clonedWrapper.style.left = left + 'px';
	document.body.appendChild(clonedWrapper);
	// 一二三四五六七八九十
	let options = {};
	let self = this;
	return html2canvas(clonedWrapper, options).then(function (canvas) {
		document.body.removeChild(clonedWrapper);
		let url = canvas.toDataURL();
		self.$emit('make-canvas', url);
		callback && callback(url);
		return Promise.resolve(url);
	});
};
var computed = {};
computed.my = function () {
	return this.data || {};
};
computed.showBannerText = function () {
	return (typeof this.my.bannerSelfChar === 'string');
};
computed.actContentChar = function () {
	return escapeContent(this.my.actContentChar);
};
computed.actExpContent = function () {
	return escapeContent(this.my.actExpContent);
};

computed.wrapperStyle = function () {
	var o = {};
	let bgColor = this.my.backgroundColor;
	if (bgColor) {
		o.backgroundColor = bgColor;
	}
	let bgImage = this.my.backgroundImage;
	if (bgImage) {
		o.backgroundImage = `url(${bgImage})`;
		o.backgroundRepeat = 'no-repeat';
		o.backgroundPosition = 'center center';
		o.backgroundSize = 'contain';
	}
	return o;
};
computed.bannerTemplate = function () {
	var i = this.my.bannerTemplate;
	return this.getBannerTemplate(i) || '';
};
computed.bannerStyle = function () {
	let o = {};
	let color = this.my.bannerSelfCharColor;
	if (color) {
		o.backgroundColor = color;
	}
	return o;
};
computed.hasRecommend = function () {
	return (this.my.recommendlist && this.my.recommendlist.length);
};
var watch = {};
watch['my.contentImage'] = function (val) {
	if (!val) {
		this.contentImage = null;
		return;
	}
	this.contentImageCount = this.contentImageCount || 0;
	var img = new Image();
	this.contentImageCount++;
	var cacheCount = this.contentImageCount;
	img.onload = () => {
		if (cacheCount !== this.contentImageCount) {
			return;
		}
		this.contentImage = val;
	};
	img.onerror = () => {
		if (cacheCount !== this.contentImageCount) {
			return;
		}
		this.contentImage = null;
	};
	img.src = val;
};
var mounted = function () {};
export default {
	data: function () {
		return {
			contentImage: ''
		};
	},
	watch,
	methods,
	computed,
	props: ['data'],
	mounted
};
</script>

<style scoped lang="less">
</style>
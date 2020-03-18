<template>
<div class="search-result-list" :class="myClass" >
	<!-- 加载中 -->
	<div class="loading-bar m-center" v-show="loadingVisible"></div>
	<!-- 提示 -->
	<div class="tip" v-if="tipVisible">
		<span v-text="tip"></span>
	</div>
	<!-- 列表 -->
	<ul v-if="dataReady">
		<li v-for="(v, i) in data" v-text="v[k]" @click="onClick(v, i)"></li>
	</ul>
</div>
</template>

<script>
let methods = {};
methods.onClick = function (v, i) {
	this.$emit('click', v, i);
};
let computed = {};
computed.myClass = function () {
	let c = [];
	if (this.loadingVisible) {
		c.push('x-loading');
	}
	if (this.tipVisible) {
		c.push('x-tip');
	}
	return c;
};

computed.loadingVisible = function () {
	return (this.data === 'loading');
};
computed.tipVisible = function () {
	return (this.tip.length > 0);
};
computed.tip = function () {
	if (this.data === null || (Array.isArray(this.data) && this.data.length === 0)) {
		return '暂无数据';
	}
	return '';
};
computed.dataReady = function () {
	if (Array.isArray(this.data) && this.data.length) {
		return true;
	}
	return false;
};
computed.k = function () {
	return this.keyName || 'text';
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
	};
	return o;
};
export default {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: ['data', 'keyName'],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@active-color: #3385FF;

.search-result-list {
	background-color: #fff;
	border: 1px solid #eee;
	box-shadow: 0 1px 5px #ccc;
	border-radius: 0 0 5px 5px;
	overflow-x: hidden;
	overflow-y: auto;

	&.x-loading,
	&.x-tip {
		padding-top: 20px;
		padding-bottom: 20px;
	}
	.loading-1 {
		margin-left: auto;
		margin-right: auto;
	}
}
.tip {
	text-align: center;
	span {
		color: #333;
		font-size: 16px;
		line-height: 16px;
	}
}
ul {
	list-style: none;
}
ul > li {
	padding: 12px;
	cursor: pointer;
	color: #333;
	word-wrap: break-word;
	word-break: break-all;
	font-size: 14px;
	&:hover {
		background-color: @active-color;
		color: #fff;
	}
}
</style>

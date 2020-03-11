<template>
<span class="c">
	<button class="btn btn-select-place" @click="open" v-text="btnText"></button>
	<input type="text" placeholder="描述" v-placeholder
		ref="desc"
		class="form-control desc-input"
		v-model="desc" />
	<full-layer ref="l" @close="onClose">
		<iframe :src="src" frameborder="0" class="c3-iframe"></iframe>
	</full-layer>
</span>
</template>

<script>
import iframeUtil from 'iframeUtil';
import URL from 'util/url.js';
import request from 'util/request.js';
import {mlayer} from 'common';

const BLANK_URL = 'about:blank';

const transformPosition = (list) => {
	return list.map((str) => {
		let str1 = str.substr(0, 4);
		let str2 = str.substr(4);

		let n1 = parseInt(str1, 16);
		let n2 = parseInt(str2, 16);
		return n1 + '-' + n2;
	});
};
const iframeCallback = (data) => {
	let list = data.bsList || [];
	if (list.length) {
		if (vm) {
			vm.v = transformPosition(list);
			vm.closelayer();
		}
		mlayer.iconMsg('保存成功！');
	} else {
		mlayer.msg('没有圈定基站');
	}
};
const listenIframe = () => {
	if (listenIframe.__inited) {
		return;
	}
	iframeUtil.on('selectBS', iframeCallback);
};
let vm = null;
var methods = {};
methods.setUrl = function (params) {
	if (this.baseUrl) {
		this.src = URL.addParam(this.baseUrl, params);
	} else {
		this.fetchRequest.then((url) => {
			this.baseUrl = url;
			this.src = URL.addParam(url, params);
		});
	}
};
methods.open = function () {
	this.$refs.l.show();
	vm = this;
	request.fetch2('/common/gisToken').then((data) => {
		this.setUrl(data);
	}).catch(() => {
		this.setUrl();
	});
};
methods.closelayer = function () {
	this.$refs.l.close();
};
methods.onClose = function () {
	vm = null;
	this.$refs.desc.focus();
};
var computed = {};
computed.btnText = function () {
	let len = (this.value || []).length;
	if (len === 0) {
		return '选择位置';
	}
	return `已选择${len}个基站`;
};
var watch = {};
watch.desc = function (val) {
	this.$emit('set-value', 'ruleDesc', val);
};
var mounted = function () {
	listenIframe();
	if (this.ruleDesc) {
		this.desc = this.ruleDesc;
	}
	this.fetchRequest = this.fetchArgs();
};
const beforeDestroy = function () {
};
export default {
	data: function () {
		return {
			baseUrl: '',
			gisParam: null,
			desc: '',
			src: BLANK_URL,
			v: []
		};
	},
	watch,
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	mixins: [require('./mix.js')]
};
</script>

<style scoped lang="less">
.c button {
	border: 1px solid #ccc;
}
.c3-iframe {
	width: 100%;
	height: 100%;
}
.desc-input {
	width: 125px;
	margin-left: 10px;
	display: inline-block;
	vertical-align: middle;
}
</style>
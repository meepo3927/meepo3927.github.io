<template>
<div class="page-monitor">
	<h3 >监测日志：</h3>
	<div class="msg-box">
		<ul v-for="m in msglist">
		    <li v-html="m.msg" :class="['x-' + m.cls]"></li>
		</ul>
	</div>
</div>
</template>

<script>
import config from 'global/config';
import request from 'util/request';
import md5 from 'lib/md5.min.js';
import tool from 'util/tool.js';

var methods = {};
const hashed = '7288ce409ce58ddd614da06b8c3034e1';
const MAX_LIST_LENGTH = 100;
const MIN_LIST_LENGTH = 50;
const REQUEST_INTERVAL = 3600;

methods.getTime = function (d) {
	d = d || new Date();
	let year = tool.padZero(d.getFullYear());
	let month = tool.padZero(d.getMonth() + 1);
	let day = tool.padZero(d.getDate());
	let hour = tool.padZero(d.getHours());
	let minute = tool.padZero(d.getMinutes());
	let second = tool.padZero(d.getSeconds());
	return [
		year, month, day
	].join('-') + ' ' + [
		hour, minute, second
	].join(':');
};

methods.listCut = function () {
	let list = this.msglist;
	if (list.length <= MAX_LIST_LENGTH) {
		return false;
	}
	for (let i = list.length - 1; i >= 0; i--) {
		let item = list[i];
		if (item.cls && list.length <= MAX_LIST_LENGTH * 2) {
			continue;
		}
		this.msglist.splice(i, 1);
		if (this.msglist.length <= MIN_LIST_LENGTH) {
			break;
		}
	}
};
methods.log = function (msg, cls) {
	let combined = '[' + this.getTime() + '] ' + msg;
	this.msglist.unshift({
		msg: combined,
		cls
	});
	this.$nextTick(this.listCut);
};
methods.match = function (val, html) {
	if (val === hashed) {
		this.log('页面正常');
	} else {
		this.log('页面异常！MD5:' + val + '.' + html);
	}
};
methods.fetchCompare = function () {
	return request.fetchHome().then((r) => {
		let val = md5(r);
		this.match(val, r);
		this.setupNext();
	}).catch((e) => {
		let msg = 'Error.';
		if (e && e.responseText) {
			msg += e.responseText;
		}
		this.log(msg, 'error');
		this.setupNext();
	});
};
methods.setupNext = function () {
	if (this.timer) {
		clearTimeout(this.timer);
		this.timer = null;
	}
	this.timer = setTimeout(this.fetchCompare, REQUEST_INTERVAL * 1000);
};
var computed = {};

var watch = {};

var mounted = function () {
	window.Monitor = this;
	this.fetchCompare();
};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		msglist: []
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		
	],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {
	}
};
</script>

<style scoped lang="less">
@pad: 20px;
.page-monitor {
	padding-top: @pad;
	& > h3 {
		margin-left: @pad;
	}
	.msg-box {
		margin-top: @pad;
		margin-left: @pad;
		& > ul > li {
			line-height: 24px;
			&.x-error {
				color: #f00;
			}
		}
	}
}
</style>
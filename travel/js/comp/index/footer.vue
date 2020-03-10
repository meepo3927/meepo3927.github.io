<template>
<div class="comp-footer">
	<span class="x-copyright">©2017 内蒙古分公司演示大数据平台</span>
	<span class="link-span link-0">
		<a :href="manageUrl" >系统管理</a>
	</span>
	<span class="link-span">
		<a href="javascript:;" @click="suggest">意见建议</a>
	</span>
	<span class="link-span">
		<a href="javascript:;" >
			<i class="fa fa-sign-out"></i> 退出系统
		</a>
	</span>
</div>
</template>

<script>
import mlayer from 'mlayer';
import config from 'global/config';

var methods = {};
methods.suggest = function () {
	var layer = mlayer.html(`
		<div class="suggest-form">
			<h4>请输入您的建议：</h4>
			<div class="text-box">
				<textarea class="input-text"></textarea>
			</div>
			<button class="btn">提交</button>
		</div>
	`.trim());
	layer.$content.on('click', '.btn', () => {
		var $text = layer.$content.find('.input-text');
		if ($text.val().trim()) {
			mlayer.iconMsg('感谢您的反馈！');
			layer.close();
		} else {
			mlayer.msg('请输入内容');
		}
	});
};
var computed = {};
computed.manageUrl = function () {
	return './scenery_manage.html';
};
// 全区权限
computed.hasAllAuth = function () {
	return (config.user.auth === 'all');
};
var mounted = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	components: {}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
@height: @footer-height;
.comp-footer {
	position: fixed;
	background-color: rgba(30, 30, 30, .3);
	left: 0;
	bottom: 0;
	height: @height;
	line-height: @height;
	padding: 0px 15px 0 15px;
	font-size: @base-font-size;
	.x-copyright {
		color: #333;
		margin-right: 8px;
	}
	@link-color:   #477BA9;
	@border-color: darken(@link-color, 10%);
	.link-span {
		border-left: 1px solid #fff;
		padding: 0px 10px;
		line-height: 20px;
		display: inline-block;
		vertical-align: -2px;
		&.link-0 {
			border-left: none;
		}
	}
	a {
		color: #fff;
		vertical-align: 2px;
	}
}
</style>
<template>
<div class="comp-page-header">
	<h2>内蒙古移动集中运营平台</h2>
	<!-- 登出 -->
	<a href="javascript:;" class="logout" @click="logout">
		<i class="fa fa-sign-out"></i>
	</a>
	<div class="dropdown">
		<!-- 姓名 -->
		<a href="javascript:;" class="uname" data-toggle="dropdown" @click="">
			<i class="fa fa-user"></i>
			<span v-text="userName"></span>
			<i class="fa fa-caret-down"></i>
		</a>
		<ul class="dropdown-menu dropdown-menu-right">
			<li >
				<a href="javascript:;" @click="emit('password')">修改密码</a>
			</li>
		</ul>
	</div>

</div>
</template>

<script>
import {config, request} from 'common';
import storeUtil from 'util/store.js';
import cookie from 'util/cookie.js';

var methods = {};
methods.emit = function (e) {
	this.vEventBus.trigger(e);
};
methods.logout = function () {
	request.logout().then(() => {
		// cookie.remove('iop_uid');
		mlayer.msg('登出成功，请关闭窗口');
		window.close();
	});
};
var computed = {};
computed.userName = function () {
	return config.user.name || '管理员';
};
computed.userId = function () {
	return config.user.id || 'Administrator';
};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	computed,
	props: [],
	mounted
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config.less";
.comp-page-header {
	height: @headerHeight;
	background-color: #fff;
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #eee;
	@textColor: #CBD0D5;
	padding-top: 1px;
	& > h2 {
		float: left;
		margin-left: 25px;
		margin-top: (@headerHeight / 2) - 21px;
	}
	& > .dropdown {
		float: right;
		padding-top: (@headerHeight / 2) - 13px;
		margin-right: 20px;
	}
	& > .dropdown > .uname {
		@span-font-size: 18px;
		color: #aaa;
		.fa-user {
			font-size: @span-font-size + 2px;
		}
		span {
			font-size: @span-font-size;
		}
		.fa-caret-down {
			font-size: @span-font-size + 2px;
		}
	}

	& > .logout {
		float: right;
		margin-top: (@headerHeight / 2) - 20px;
		margin-right: 25px;
		color: @textColor;
		font-size: 28px;
	}
}
@media (max-width: @mq-mid-width) {
	.comp-page-header {
		@h: @mid-header-height;
		height: @h;
		& > h2 {
			font-size: 20px;
			margin-top: 8px;
		}

		& > .logout {
			margin-top: 4px;
			font-size: 22px;
		}
		& > .dropdown {
			padding-top: (@headerHeight / 2) - 23px;
		}
		& > .dropdown > .uname {
			@span-font-size: 14px;
			.fa-user {
				font-size: @span-font-size + 2px;
			}
			span {
				font-size: @span-font-size;
			}
			.fa-caret-down {
				font-size: @span-font-size + 2px;
			}
		}
	}
}
</style>
<template>
<div class="v-main p10">
	<h2 class="">地市账号管理</h2>

	<div class="container clearfix mt15">
		<div class="x-left">
			<h3>选择账号：</h3>
			<ul class="parent-account-list" v-if="parentAccounts">
				<li :class="{active: parentAcct == acct.id}" v-for="acct in parentAccounts">
					<label class="radio">
						<input type="radio" v-model="parentAcct"
							:value="acct.id" /> {{acct.name}}
					</label>
				</li>
			</ul>
			<p v-show="parentAccountEmpty" class="empty-text">没有数据</p>
			<div class="loading-1 mt10" v-show="view.loadingParent"></div>
		</div><!-- x-left -->
		<div class="x-mid" v-show="parentAcct">
			<i class="fa fa-arrow-right"></i>
		</div>
		<div class="x-right" v-show="parentAcct">
			<h3>授权账号：</h3>
			<ul class="child-account-list" v-if="childrenAccounts">
				<li v-for="acct in childrenAccounts" :class="{active: acct.checked}">
					<label class="checkbox">
						<input type="checkbox" v-model="acct.checked"/> {{acct.name}}
					</label>
				</li>

			</ul>
			<p v-show="childAccountEmpty" class="empty-text">没有数据</p>
			<div class="loading-1 mt10" v-show="view.loadingChild"></div>
			<button class="btn mt15 save-btn" type="button"
				@click="save">保存</button>
		</div><!-- x-right -->
	</div>
</div>
</template>

<script>
import {config, mlayer, request, $} from 'root';

var methods = {};
methods.save = function () {
	let ld = mlayer.loading();
	setTimeout(() => {
		ld.close();
		mlayer.iconMsg('保存成功！');
	}, 800);
};
var computed = {};
computed.parentAccountEmpty = function () {
	if (this.parentAccounts && !this.parentAccounts.length) {
		return true;
	}
	return false;
};
computed.childAccountEmpty = function () {
	if (this.childrenAccounts && !this.childrenAccounts.length) {
		return true;
	}
	return false;
};
var watch = {};

watch.parentAcct = function (v) {
	this.childrenAccounts = null;
	this.view.loadingChild = true;

	request.getCityChildrenAccounts({id: v}).then((r) => {

		this.view.loadingChild = false;
		this.childrenAccounts = r.map((v) => {
			v.checked = false;
			return v;
		});
	}).catch(() => {
		this.view.loadingChild = false;
		this.childrenAccounts = [];
	});
};
const created = function () {

};
const mounted = function () {
	window.VM = this;

	this.view.loadingParent = true;
	request.getCityAccounts().then((r) => {
		this.view.loadingParent = false;
		this.parentAccounts = r;
	}).catch((e) => {
		this.view.loadingParent = false;
		this.parentAccounts = [];
	});
};
const beforeDestroy = function () {};
const dataFunc = function () {
	var o = {
		view: {
			loadingParent: false,
			loadingChild: false
		},
		parentAccounts: null,
		parentAcct: '',
		childrenAccounts: null
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
	created,
	mounted,
	beforeDestroy,
	components: {

	}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
.v-main {
	& > h2 {
		padding-bottom: 12px;
		border-bottom: 2px solid @theme-color;
	}
}
@box-border-color: #ccc;
.container {
	.x-left,
	.x-right {
		padding: 15px 24px;
		border: 1px solid @box-border-color;
		border-radius: 5px;
		float: left;
		h3 {
			color: #333;
		}
		.empty-text {
			margin-top: 10px;
			color: #777;
		}
	}
	.x-mid {
		float: left;
		.fa {
			font-size: 24px;
			margin: 13px 23px 0 25px;
		}
	}
	.x-left {
		
	}
	.x-right {
		padding-right: 40px;
	}
}
.parent-account-list,
.child-account-list {
	li {
		margin-top: 18px;
	}
	li.active {
		color: @theme-color;
	}
}
.save-btn {
	width: 80px;
}
</style>
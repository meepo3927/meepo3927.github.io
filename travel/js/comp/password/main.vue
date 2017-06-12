<template>
<div class="v-main p10">
	<div class="btn-group">
		<button class="btn btn-default " 
			:class="{active: curTab === 1}"
			@click="changeTab(1)">修改当前账户密码</button>
		<button class="btn btn-default" :class="{active: curTab === 2}"
			@click="changeTab(2)">修改其他账户密码</button>
	</div>
	
	<div class="form-box clearfix">
		<div class="tree-box fl" v-show="otherVisible">
			<div class="ztree" id="ztree1" ref="tree"></div>
		</div>
		<form @submit.prevent class="fl label-w-6">
			<div class="form-item" v-show="otherVisible">
				<label for="">所选账户：</label>
				<div class="x-right">
					<span v-text="form.accountName || '未选择'"></span>
					<input type="hidden" v-model="form.account" />
				</div>
			</div>

			<div class="form-item">
				<label for="">旧密码：</label>
				<div class="x-right">
					<input type="password" class="input-text"
						v-model="form.oldPassword" />
				</div>
			</div>

			<div class="form-item">
				<label for="">新密码：</label>
				<div class="x-right">
					<input type="password" class="input-text" maxlength="64" 
						v-model="form.password" />
				</div>
			</div>

			<div class="form-item">
				<label for="">确认密码：</label>
				<div class="x-right">
					<input type="password" class="input-text" maxlength="64"
						v-model="form.password2" />
				</div>
			</div>

			<div class="form-item ">
				<label for="" >&nbsp;</label>
				<div class="x-right">
					<button class="btn" type="button" @click="submit">提交</button>
				</div>
			</div>
		</form>
	</div>
</div>
</template>

<script>
import {config, mlayer, request, $} from 'common';
import zTree from 'ztree';

var methods = {};
methods.changeTab = function (v) {
	if (v === this.curTab) {
		return;
	}
	this.curTab = v;
	this.reset();
};
methods.submit = function () {
	let fm = this.form;
	if (this.otherVisible && !fm.account) {
		return mlayer.msg('请选择一个账户');
	}
	if (!fm.oldPassword || !fm.password || !fm.password2) {
		return mlayer.msg('密码不能为空');
	}
	if (fm.password !== fm.password2) {
		return mlayer.msg('两次密码必须相同');
	}
	this.reset();
	mlayer.iconMsg('修改成功！');
};
methods.reset = function () {
	for (let i in this.form) {
		this.form[i] = '';
	}
	if (this.tree) {
		this.tree.cancelSelectedNode();
	}
};
methods.getNodes = function () {
	return [
		{id:1, pId:0, name:"包头", open:true},
		{id:101, pId:1, name:"八一公园"},
		{id:102, pId:1, name:"银河广场"}
	];
};
var computed = {};
computed.otherVisible = function () {
	return (this.curTab === 2);
};
computed.zTreeSetting = function () {
	let vm = this;
	const onClick = function (e, id, node, flag) {
		vm.form.account = node.id;
		vm.form.accountName = node.name;
	};
	let callback = {
		onClick
	};
	let setting = {
		callback
	};
	return setting;
};
var watch = {};
var mounted = function () {
	let $tree = $(this.$refs.tree);
	this.tree = $.fn.zTree.init($tree, this.zTreeSetting, this.getNodes());
};
let destroyed = function () {};
let dataFunc = function () {

	var o = {
		curTab: 1,
		form: {
			account: '',
			accountName: '',
			oldPassword: '',
			password: '',
			password2: ''
		}
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
	components: {

	}
};
</script>

<style scoped lang="less">
.v-main {
	
}
.form-box {
	margin: 5px;
}
.tree-box {
	margin-top: 16px;
	margin-right: 25px;

	padding: 1px 10px 1px 5px;

	border: 1px solid #ddd;
	
}
</style>
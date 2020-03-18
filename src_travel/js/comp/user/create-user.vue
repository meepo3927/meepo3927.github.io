<template>
<center-layer >
<div class="create-user-layer common-form-layer">
	<close-box @close="$emit('close')" />
	<h2>新增用户</h2>
	<form action="" class="label-w-6">
		<!-- 归属地市 -->
		<div class="form-item" v-show="isAddMode">
			<label for="">归属地市：</label>
			<div class="x-right">
				<vue-chosen :options="citylist" v-model="sceneryId" />
			</div>
		</div>
		<!-- 用户名 -->
		<div class="form-item" >
			<label for="">用户名：</label>
			<div class="x-right">
				<input type="text" class="input-text" v-model="name"
					:readonly="isDoneMode" />
			</div>
		</div>
		<!-- 密码 -->
		<div class="form-item" v-show="isAddMode">
			<label for="">登录密码：</label>
			<div class="x-right">
				<input type="text" class="input-text" v-model="password" />
			</div>
		</div>
		<!-- 密码2 -->
		<div class="form-item" v-show="isAddMode">
			<label for="">确认密码：</label>
			<div class="x-right">
				<input type="text" class="input-text" v-model="password2" />
			</div>
		</div>

		<!-- 账号ID -->
		<div class="form-item" v-if="isDoneMode">
			<label for="">登录ID：</label>
			<div class="x-right">
				<input type="text" class="input-text" v-model="accountForSave"
					readonly="" />
			</div>
		</div>

		<div class="rule-tip">
			<p v-text="passwordRuleTip"></p>
		</div>

		<!-- 提示 -->
		<div class="form-item" v-if="isDoneMode">
			<label for="">&nbsp;</label>
			<div class="x-right">
				<p class="save-tip">提交成功！登录ID用于登录系统，请妥善保存！</p>
			</div>
		</div>

		<!-- 按钮 -->
		<div class="form-item ">
			<label for="" >&nbsp;</label>
			<div class="x-right">
				<button class="btn" type="button" @click="submit" v-if="isAddMode">
					提交
				</button>

				<button class="btn" type="button" v-if="isDoneMode"
					@click="reset">继续新增</button>
				<button class="btn ml10" type="button" @click="close">关闭</button>
				<span class="inline-loading ml10" v-show="loading"></span>
			</div>
		</div>
	</form>
</div>
</center-layer>
</template>

<script>

import {request, config} from 'root';
import AES from 'util/aes.js';

var methods = {};
methods.close = function () {
	this.$emit('close');
};
methods.reset = function () {
	this.name = '';
	this.password = '';
	this.password2 = '';
	this.accountForSave = null;
};
methods.handleSuccess = function (data) {

	this.accountForSave = data.userId;
	// mlayer.msg('新增成功！');
};
methods.submit = function () {
	if (this.loading) {
		return;
	}

	if (!this.name.trim()) {
		return mlayer.msg('用户名不能为空');
	}
	if (!this.password.trim()) {
		return mlayer.msg('登录密码不能为空');
	}
	let result = this.checkPasswordRule(this.password);
	if (result !== true) {
		return mlayer.msg(result);
	}
	if (this.password !== this.password2) {
		return mlayer.msg('两次密码不一致');
	}
	const encodedPassword = AES.p(this.password, Config.passkey);
	let p = {
		sceneryId: this.sceneryId,
		userName: this.name,
		userPwd: encodedPassword
	};

	this.loading = true;
	request.addUser(p).then((r) => {

		this.loading = false;
		// this.close();
		this.handleSuccess(r);
		this.$emit('update', {});
	}).catch((o = {}) => {
		this.loading = false;
		mlayer.msg(o.msg || '提交失败');
	});
};
var computed = {};
computed.isAddMode = function () {
	return (this.accountForSave === null);
};
computed.isDoneMode = function () {
	return !this.isAddMode;
};
var watch = {};
const created = function () {
	this.citylist = request.getStaticCityList({withAll: true}).map((v) => {
		return {
			value: v.id,
			text: v.name
		};
	});
};
var mounted = function () {

};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		sceneryId: '',
		name: '',
		password: '',
		password2: '',
		accountForSave: null,
		loading: false,
		citylist: null
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/with_cover.js'),
		require('mixins/password_rule.js')
	],
	methods,
	computed,
	props: [],
	created,
	mounted,
	beforeDestroy,
	components: {
		'close-box': require('comp/chart_layer/close-box.vue')
	}
};
</script>

<style scoped lang="less">

.input-text {
	width: 320px;
}
.save-tip {
	font-size: 13px;
	color: #f00;
}
.rule-tip {
	padding-left: 84px;
	color: #999;
	font-size: 13px;
}
</style>
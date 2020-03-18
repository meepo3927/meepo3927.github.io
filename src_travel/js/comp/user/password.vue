<template>
<form @submit.prevent class="label-w-6 password-form " >
	<h3 class="section-title">修改密码：</h3>

	<div class="form-item" >
		<label for="">用户名：</label>
		<div class="x-right">
			<span v-text="info.name || '未选择'"></span>
		</div>
	</div>

	<div class="form-item" >
		<label for="">登录ID：</label>
		<div class="x-right">
			<span v-text="info.id"></span>
		</div>
	</div>

	<div class="form-item">
		<label for="">旧密码：</label>
		<div class="x-right">
			<input type="password" class="input-text"
				v-model="oldPassword" />
		</div>
	</div>

	<div class="form-item">
		<label for="">新密码：</label>
		<div class="x-right">
			<input type="password" class="input-text" maxlength="64" 
				v-model="password" />
		</div>
	</div>

	<div class="form-item">
		<label for="">确认密码：</label>
		<div class="x-right">
			<input type="password" class="input-text" maxlength="64"
				v-model="password2" />
		</div>
	</div>
	<div class="rule-tip">
		<p v-text="passwordRuleTip"></p>
	</div>

	<div class="form-item ">
		<label for="" >&nbsp;</label>
		<div class="x-right">
			<button class="btn" type="button" @click="submit">提交</button>
		</div>
	</div>
</form><!-- 修改密码 form -->
</template>

<script>
import 'extend/jquery.sticky.js';
import userStore from 'store/user_select.js';
import request from 'util/request.js';
import AES from 'util/aes.js';
var methods = {};
methods.submit = function () {
	if (!this.info.id) {
		return mlayer.msg('请选择一个账户');
	}
	if (!this.oldPassword || !this.password || !this.password2) {
		return mlayer.msg('密码不能为空');
	}
	let result = this.checkPasswordRule(this.password);
	if (result !== true) {
		return mlayer.msg(result);
	}
	if (this.password !== this.password2) {
		return mlayer.msg('确认密码和新密码必须相同');
	}
	const encodedOldPassword = AES.p(this.oldPassword, Config.passkey);
	const encodedNewPassword = AES.p(this.password, Config.passkey);
	let p = {
		userId: this.info.id,
		userPwd: encodedOldPassword,
		newPwd: encodedNewPassword
	};
	let l = mlayer.loading();
	request.changePassword(p).then((r) => {
		this.reset();
		l.close();
		mlayer.iconMsg('修改成功！');
	}).catch(() => {
		l.close();
		mlayer.msg('修改失败');
	});
	
};
methods.reset = function () {
	this.password = '';
	this.password2 = '';
	this.oldPassword = '';
};
var computed = {};
computed.info = function () {
	return userStore.state.selectInfo || {};
};
var watch = {};
var mounted = function () {
};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		password: '',
		password2: '',
		oldPassword: ''
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/password_rule.js')
	],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.password-form {
	padding: 1px 20px;
}
.rule-tip {
	padding-left: 84px;
	color: #999;
}
</style>
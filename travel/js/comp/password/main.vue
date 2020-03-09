<template>
<div class="v-main p10">

	<div class="form-box clearfix" >
		<form @submit.prevent class="fl label-w-6" ref="form">

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

			<div class="rule-tip">
				<p v-text="passwordRuleTip"></p>
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
import {config, mlayer, request, $} from 'root';
import zTree from 'ztree';
import 'extend/jquery.sticky.js';
import AES from 'util/aes.js';

var methods = {};

methods.submit = function () {
	let fm = this.form;

	if (!fm.oldPassword || !fm.password || !fm.password2) {
		return mlayer.msg('密码不能为空');
	}
	let result = this.checkPasswordRule(fm.password);
	if (result !== true) {
		return mlayer.msg(result);
	}
	if (fm.password !== fm.password2) {
		return mlayer.msg('确认密码和新密码必须相同');
	}
	let userId = config.user.code;

	const encodedOldPassword = AES.p(fm.oldPassword, Config.passkey);
	const encodedNewPassword = AES.p(fm.password, Config.passkey);
	let p = {
		userId,
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
	for (let i in this.form) {
		this.form[i] = '';
	}
};

var computed = {};

var watch = {};
const created = function () {

};
var mounted = function () {

};
const beforeDestroy = function () {};
let dataFunc = function () {

	var o = {
		form: {
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
	mixins: [
		require('mixins/password_rule.js')
	],
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
.v-main {
	
}
.form-box {
	margin-left: 15px;
}
.rule-tip {
	padding-left: 84px;
	color: #999;
}
</style>
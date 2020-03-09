<template>
<div class="page-password-out-expire">
    <h1>密码过期修改</h1>
    <div class="alert alert-danger mt15">您的密码已过期（超过90天），为了账号安全，请修改密码！</div>

    <div class="m-row w-auto col-mid">
        <div class="m-col col-label"><em>*</em>旧密码：</div>
        <div class="m-col">
            <input type="password" class="form-control" v-model="oldPassword" />
        </div>
    </div>

    <div class="m-row w-auto col-mid mt20">
        <div class="m-col col-label"><em>*</em>新密码：</div>
        <div class="m-col">
            <input type="password" class="form-control" v-model="newPassword" />
        </div>
    </div>
    <div class="m-row w-auto col-mid mt20">
        <div class="m-col col-label"><em>*</em>再次输入：</div>
        <div class="m-col">
            <input type="password" class="form-control" v-model="newPassword2" />
        </div>
    </div>
    <div class="rule-tip mt20">
        <p>说明：{{passwordRuleTip}}</p>
    </div>
    <div class="btn-box mt20">
        <button class="btn btn-primary" type="button" :disabled="loading"
            @click="submit">提交</button>
    </div>
</div>
</template>

<script>
import 'root';
import mlayer from 'mlayer';
import AES from 'util/aes.js';
let methods = {};
methods.check = function () {
    if (!this.oldPassword) {
        return mlayer.msg('请输入旧密码');
    }
    if (!this.newPassword || !this.newPassword2) {
        return mlayer.msg('请输入新密码');
    }
    if (this.newPassword !== this.newPassword2) {
        return mlayer.msg('两次密码不一致');
    }
    const result = this.checkPasswordRule(this.newPassword);
    if (result !== true) {
        return mlayer.msg(result);
    }
    return true;
};
methods.jumpIndex = function () {
    window.location.href = this.getStaticUrl('/../index');
};
methods.submit = function () {
    if (this.loading) {
        return;
    }
    if (this.check() !== true) {
        return;
    }
    this.loading = true;
    const encodedOldPassword = AES.p(this.oldPassword, Config.passkey);
    const encodedNewPassword = AES.p(this.newPassword, Config.passkey);
    const p = {
        userId: Config.user.code,
        userPwd: encodedOldPassword,
        newPwd: encodedNewPassword
    };
    Request.changePassword(p).then((result) => {
        mlayer.msg('修改成功，即将跳转...');
        setTimeout(this.jumpIndex, 1500);
        // this.loading = false;
    }).catch((e) => {
        const msg = e && e.msg;
        mlayer.msg(msg || '修改失败');
        this.loading = false;
    });
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        loading: false,
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/password_rule.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@label-width:  100px;
.page-password-out-expire {
    padding: 1px 22px;
}
.col-label {
    width: @label-width;
    & > em {
        color: #f00;
    }
}
.rule-tip {
    padding-left: @label-width;
    color: #777;
}
.btn-box {
    padding-left: @label-width;
}
</style>

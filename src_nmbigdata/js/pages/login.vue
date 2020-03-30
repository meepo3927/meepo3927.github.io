<template>
<div class="page-login">

    <div class="v-title">
        <h1>东方万里大数据平台</h1>
        <h1>管理后台</h1>
    </div>

    <div class="mform v-label-right form-layer">

        <div class="m-row-mid-auto">
            <label for="userName">用户名：</label>
            <div>
                <input type="text" class="form-control" id="userName"
                    v-model="userName" />
            </div>
        </div>

        <div class="m-row-mid-auto">
            <label for="password">密　码：</label>
            <div>
                <input type="password" class="form-control" id="password"
                    v-model="pwd" />
            </div>
        </div>
        <div class="m-row-mid-auto">
            <label for="captcha">验证码：</label>
            <div >
                <input type="text" class="form-control captcha-input" 
                    id="captcha" @keyup.enter="submit"
                    v-model="captcha" />
            </div>
            <div class="pl10">
                <img :src="getImageUrl('/captcha.jpg')" class="captcha-img" />
            </div>
        </div>

        <div class="btn-box">
            <button class="btn btn-primary" type="button" @click="submit">
                登录
                <img v-show="loading" class="ml5" 
                    :src="getImageUrl('/loading.gif')" />
            </button>
        </div>
    </div>
</div>
</template>

<script>
let methods = {};
methods.jump = function () {
    location.href = this.getPageUrl('/audit');
};
methods.check = function () {
    if (!this.userName) {
        return this.$msg('请输入用户名');
    }
    if (!this.pwd) {
        return this.$msg('请输入密码');
    }
    if (!this.captcha) {
        return this.$msg('请输入验证码');
    }
    return true;
};
methods.clean = function () {
    this.userName = '';
    this.pwd = '';
};
methods.submit = function () {
    if (this.loading || this.check() !== true) {
        return;
    }
    this.loading = true;
    let p = {
        userName: this.userName,
        pwd: this.pwd
    };
    //3cAb901
    this.vRequest.login(p).then((data) => {
        this.loading = false;
        this.clean();
        this.$msg('登录成功，即将跳转');
        setTimeout(this.jump, 1500);
    }).catch((e) => {
        this.$msg(e.respMsg || '登录失败');
        this.loading = false;
    });
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        userName: '',
        pwd: '',
        loading: false,
        captcha: ''
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@layer-width:    446px;
@layer-height:   280px;
.v-title {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 500px;
    margin-top: -(@layer-height / 2) - 140px;
    margin-left: -250px;
    text-align: center;
    h1 {
        color: #fff;
        font-size: 38px;
        margin-top: 0;
        margin-bottom: 10px;
    }
}
.mform {
    width: @layer-width;
    height: @layer-height;

    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -(@layer-height / 2);
    margin-left: -(@layer-width / 2);
}
.btn-box {
    margin-left: 102px;
    button img {
        width: 16px;
        height: 16px;
        vertical-align: -3px;
    }
}
.captcha-input {
    width: 88px;
}
.captcha-img {
    width: 80px;
    height: 32px;
}
</style>

<style lang="less">
.body-login {
    background: url("../../images/apply_bg.jpg") no-repeat center center;
}
</style>
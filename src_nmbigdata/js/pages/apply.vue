<template>
<div class="page-apply">
    <div class="v-title">
        <h1>内蒙古移动大数据平台</h1>
        <h1>体验账号申请</h1>
    </div>
    <div class="mform v-label-right form-layer">
        <div class="m-row-auto mb5">
            <label>申请产品：</label>
            <!--
            <div class="prolist-box">
                <label v-for="(v, i) in prolist" class="m-checkbox">
                    <input type="checkbox" v-model="proChecked[i]" /> {{v}}
                </label>
            </div>
            -->
            <div class="prolist-text" v-text="prolistText"></div>
        </div>

        <div class="m-row-mid-auto mt25">
            <label for="userName"><em class="red-star">*</em>姓名：</label>
            <div>
                <input type="text" class="form-control" id="userName"
                    v-model="userName" />
            </div>
        </div>

        <div class="m-row-mid-auto">
            <label for="mobile"><em class="red-star">*</em>手机号：</label>
            <div>
                <input type="text" class="form-control" id="mobile"
                    v-model="mobile" />
            </div>
        </div>

        <div class="m-row-mid-auto">
            <label for="email">Email：</label>
            <div>
                <input type="text" class="form-control" id="email"
                    v-model="email" />
            </div>
        </div>

        <div class="m-row-mid-auto">
            <label for="depart">所属单位：</label>
            <div>
                <input type="text" class="form-control" id="depart"
                    v-model="depart" />
            </div>
        </div>

        <div class="m-row-mid-auto">
            <label for="captcha"><em class="red-star">*</em>验证码：</label>
            <div >
                <input type="text" class="form-control captcha-input" id="captcha"
                     v-model="captcha" />
            </div>
            <div class="pl10">
                <img :src="getImageUrl('/captcha.jpg')" class="captcha-img" />
            </div>
        </div>

        <div class="btn-box">
            <button class="btn btn-primary" @click="submit">
                提交
                <img v-show="loading" class="ml5" 
                    :src="getImageUrl('/loading.gif')" />
            </button>
        </div>
    </div>
</div>
</template>

<script>
const vali = require('util/vali.js');
const PRO_LIST = ['鹰眼', '风云', '远方', '征途', '速析'];
let methods = {};
methods.submit = function () {
    if (this.check() !== true) {
        return;
    }
    this.loading = true;
    let p = {
        name: encodeURIComponent(this.userName),
        mobilePhone: this.mobile,
        email: this.email,
        company: encodeURIComponent(this.depart),

        func: 'appAccount'
    };
    this.vRequest.fetch3('/rest/account', p).then((data) => {
        LOG(data);
        this.loading = false;
        this.reset();
        this.$msg({
            text: '提交成功！请等待审核，审核结果将通过手机短信通知您。',
            type: 'success',
            duration: 6000
        });
    }).catch((e) => {
        LOG(e);
        this.loading = false;
        this.$msg(e.respMsg || '提交失败');
    });
};
methods.check = function () {
    if (!this.hasProChecked) {
        return this.$msg('请选择至少一个产品');
    }
    let result = vali.all([
        [this.userName, 'required:姓名'],
        [this.mobile, 'required:手机号', 'mobile'],
        [this.email, 'nullPass', 'email'],
        [this.captcha, 'required:验证码']
    ]);
    if (result !== true) {
        return this.$msg(result);
    }
    return true;
};
methods.reset = function () {
    this.proChecked = PRO_LIST.map(() => {
        return true
    });
    this.userName ='',
    this.mobile = '',
    this.email = '',
    this.depart = '',
    this.captcha = '';
};
let computed = {};
computed.prolist = function () {
    return PRO_LIST;
};
computed.prolistText = function () {
    return PRO_LIST.join('、')
};
computed.hasProChecked = function () {
    for (let i = 0; i < this.proChecked.length; i++) {
        if (this.proChecked[i]) {
            return true;
        }
    }
    return false;
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        loading: false,
        proChecked: PRO_LIST.map(() => {
            return true
        }),
        userName: '',
        mobile: '',
        email: '',
        depart: '',
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
@page-width:    446px;
@page-height:   480px;
@input-width:   220px;
@captcha-width: 80px;

.page-apply > .v-title {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 500px;
    margin-top: -(@page-height / 2) - 90px;
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
    position: fixed;
    left: 50%;
    top: 50%;
    margin-top: -(@page-height / 2) + 30;
    margin-left: -(@page-width / 2);
    width: @page-width;
    height: @page-height;
    & > div > label {
        font-size: 16px;
    }
    input[type=text] {
        width: @input-width;
        &.captcha-input {
            width: @input-width - @captcha-width - 10px;
        }
    }
    .prolist-box {
        label {
            margin-right: 35px;
            margin-bottom: 10px;
            font-size: 16px;
        }
    }
    .prolist-text {
        font-size: 16px;
    }
    .captcha-img {
        width: @captcha-width;
        height: 32px;
    }
    .btn-box {
        margin-top: 45px;
        margin-left: 102px;
        .btn-primary {
            width: 80px;
        }
        button img {
            width: 16px;
            height: 16px;
            vertical-align: -3px;
        }
    }
}
</style>
<style lang="less">
.body-apply {
    background: url("../../images/apply_bg.jpg") no-repeat center center;
}
</style>
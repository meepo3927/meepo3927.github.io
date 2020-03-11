<template>
<div class="comp-topbar">
    <h1><img :src="clogo" /> 内蒙古东方万里运营平台</h1>
    <!-- 公告 -->
    <div class="public-notice-wrapper">
        <public-notice class="public-notice" />
    </div>
    <!-- 登出 -->
    <a href="javascript:;" class="logout" @click="logout">
        <i class="fa fa-sign-out"></i> 登出
    </a>
    <div class="dropdown">
        <!-- 姓名 -->
        <a href="javascript:;" class="username" data-toggle="dropdown">
            <i class="fa fa-user"></i>
            <span v-text="userName"></span>
            <i class="fa fa-caret-down"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-right">
            <li><a href="javascript:;" @click="onModifyPasswordClick">修改密码</a></li>
        </ul>
    </div>
</div>
</template>

<script>
import mlayer from 'mlayer';
import ModifyPasswordLayer from 'comp/modify-password-layer';
const methods = {};
methods.logout = function () {
    mlayer.msg('登出成功');
};
methods.onModifyPasswordClick = function () {
    mlayer.msg('仅供演示');
};
const computed = {};
computed.userName = function () {
    return Config.user.name || '管理员';
};
computed.clogo = function () {
    return this.getImageUrl('/global/clogo.png')
};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {
        'public-notice': require('comp/index/public-notice.vue')
    }
};
</script>

<style scoped lang="less">
@import "./ref.less";
.comp-topbar {
    min-width: 1080px;
    height: @top-bar-height;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding-top: 1px;
    padding-left: 20px;
}
h1 {
    margin-top: 5px;
    margin-bottom: 0;
    font-size: 24px;
    float: left;
    img {
        width: 30px;
        height: 30px;
        vertical-align: -6px;
    }
}
.public-notice-wrapper {
    float: left;
    margin-top: (@top-bar-height / 2) - 20px;
}
.logout {
    float: right;
    margin-top: (@top-bar-height / 2) - 12px;
    margin-right: 35px;
    font-size: 16px;
    color: #666;
    &:hover {
        color: #FDC273;
    }
    i.fa {
        color: #FDC273;
        font-size: 22px;
        vertical-align: -2px;
    }
}
.dropdown {
    float: right;
    padding-top: (@top-bar-height / 2) - 12px;
    margin-right: 30px;
    .username {
        color: #666;
    }
    .username i.fa-user {
        color: #AED798;
        font-size: 22px;
        vertical-align: -2px;
    }
    .username span {
        font-size: 16px;
        margin-left: 6px;
        margin-right: 6px;
    }
    .username i.fa-caret-down {
        font-size: 16px;
    }
}
</style>

let config = require('global/config');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
let computed = {};
computed.menulist = function () {
    const hasAllAuth = (config.user.auth === 'all');
    let pre = [
        {
            text: '首页',
            icon: 'fa-home',
            url: this.getStaticUrl('/../index')
        }
    ];
    let mid = [];
    if (hasAllAuth) {
        mid.push({
            text: '景区管理',
            icon: 'fa-cog',
            url: this.getStaticUrl('/scenery_manage')
            // url: this.getStaticUrl('/manage_attraction')
        });
    }
    let sup = [
        {
            text: '通知管理',
            icon: 'fa-lightbulb-o',
            url: this.getStaticUrl('/notice')
        }
    ];
    if (hasAllAuth) {
        sup.push({
            text: '用户管理',
            icon: 'fa-user',
            url: this.getStaticUrl('/user_manage')
        });
        sup.push({
            text: '账号解锁',
            icon: 'fa-unlock',
            url: this.getStaticUrl('/acct_unlock')
        });
        sup.push({
            text: '12景区管理',
            icon: 'fa-cog',
            url:  this.basePath + '/twelve_setting'
        });
    }
    sup = sup.concat([
        {
            text: '密码管理',
            icon: 'fa-lock',
            url: this.getStaticUrl('/password')
        },
        {
            text: '阈值管理',
            icon: 'fa-bell-o',
            url: this.getStaticUrl('/alarm_config')
        }
    ]);
    if (hasAllAuth) {
        sup.push({
            text: '生成报告',
            icon: 'fa-file-o',
            url: this.getStaticUrl('/report')
        });
    }
    sup.push({
        text: '退出系统',
        icon: 'fa-sign-out',
        url: this.vlogoutUrl
    });
    return pre.concat(mid).concat(sup);
};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy
};
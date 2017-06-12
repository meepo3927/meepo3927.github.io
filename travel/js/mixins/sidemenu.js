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
    return [
        {
            text: '首页',
            icon: 'fa-home',
            url: this.getStaticUrl('/../index')
        },
        {
            text: '景区管理',
            icon: 'fa-cog',
            url: this.getStaticUrl('/manage_attraction')
        },
        {
            text: '通知管理',
            icon: 'fa-lightbulb-o',
            url: this.getStaticUrl('/notice')
        },
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
    ];
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
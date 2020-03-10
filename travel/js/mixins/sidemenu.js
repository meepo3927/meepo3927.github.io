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
    let pre = [
        {
            text: '首页',
            icon: 'fa-home',
            url: './index.html'
        }
    ];
    let mid = [{
        text: '景区管理',
        icon: 'fa-cog',
        url: './scenery_manage.html'
    }];

    mid.push({
        text: '生成报告',
        icon: 'fa-file-o',
        url: './report.html'
    });
    mid.push({
        text: '退出系统',
        icon: 'fa-sign-out',
        url: 'javascript:;'
    });
    return pre.concat(mid);
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
<template>
<div class="page-entry">
    <router-view></router-view>
</div>
</template>

<script>
import 'common';
import VueRouter from 'vuerouter';
import Home from './home.vue';
Vue.use(VueRouter);
const EventList = (r) => {
    require.ensure([], () => {r(require('comp/event-list.vue'))})
};
const Calendar = (r) => {
    require.ensure([], () => {r(require('pages/calendar.vue'))})
};
const ModelList = (r) => {
    require.ensure([], () => {r(require('pages/model-listn.vue'))})
};
const ContactList = (r) => {
    require.ensure([], () => {r(require('pages/contact-list.vue'))})
};
const TouchLimitSetting = (r) => {
    // 触点频次限制
    require.ensure([], () => {r(require('pages/channel-freq-setting.vue'))})
};
const NoticePublish = (r) => {
    // 公告发布
    require.ensure([], () => {r(require('pages/notice-publish.vue'))})
};
const ChannelIntro = (r) => {
    // 触点说明
    require.ensure([], () => {r(require('pages/channel-intro.vue'))})
};
const ActionAnalysis = (r) => {
    // 分场景行为分析
    require.ensure([], () => {r(require('pages/action_analysis.vue'))})
};
const AddHotArea = (r) => {
    // 增加热门区域
    require.ensure([], () => {r(require('pages/add-hotarea.vue'))})
};
const GuideFiles = (r) => {
    // 培训资料下载
    require.ensure([], () => {r(require('pages/guide-files.vue'))})
};
const Broadband = (r) => {
    // 高潜宽带小区分析
    require.ensure([], () => {r(require('pages/broadband.vue'))})
};
const LoginStat = (r) => {
    // 登录日志
    require.ensure([], () => {r(require('pages/login-stat.vue'))})
};
const TerminalCount = (r) => {
    // 终端销量
    require.ensure([], () => {r(require('pages/terminal-count.vue'))})
};
const routes = [
    {path: '/', component: Home},
    {path: '/eventlist', component: EventList},
    {path: '/calendar', component: Calendar},
    {path: '/modellist', component: ModelList},
    {path: '/contactlist', component: ContactList},
    {path: '/channel_freq_setting', component: TouchLimitSetting},
    {path: '/notice_publish', component: NoticePublish},
    {path: '/channel_intro', component: ChannelIntro},
    {path: '/action_analysis', component: ActionAnalysis},
    {path: '/addhotarea', component: AddHotArea},
    {path: '/guidefiles', component: GuideFiles},
    {path: '/broadband', component: Broadband},
    {path: '/terminal_count', component: TerminalCount},
    {path: '/loginstat', component: LoginStat},
];
const methods = {};
const computed = {};
const created = function () {};
const mounted = function () {
    this.$HACK_VUE_ROUTER_IE();
    // Inject Entry variable
    try {
        window.top.Entry = this;
        this.$win = window;
    } catch(e) {
        LOG('Entry mounted', e);
    }
    Vue.$noticeWhenAnchorClick();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    router: new VueRouter({routes}),
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {
    }
};
</script>

<style scoped lang="less">

</style>

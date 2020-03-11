<template>
<div class="page-entry">
    <router-view></router-view>
</div>
</template>

<script>
import 'common';
import VueRouter from 'vuerouter';
import Home from './home.vue';
import EventList from 'comp/event-list.vue';
import Calendar from 'pages/calendar.vue';
import ModelList from 'pages/model-listn.vue';
import TouchLimitSetting from 'pages/channel-freq-setting.vue';
import ChannelIntro from 'pages/channel-intro.vue';
import ActionAnalysis from 'pages/action_analysis.vue';
Vue.use(VueRouter);

const TerminalCount = (r) => {
    // 终端销量
    require.ensure([], () => {r(require('pages/terminal-count.vue'))})
};
const routes = [
    {path: '/', component: Home},
    {path: '/eventlist', component: EventList},
    {path: '/calendar', component: Calendar},
    {path: '/modellist', component: ModelList},
    {path: '/channel_freq_setting', component: TouchLimitSetting},
    {path: '/channel_intro', component: ChannelIntro},
    {path: '/action_analysis', component: ActionAnalysis},
    {path: '/terminal_count', component: TerminalCount}
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

// 基础库
import 'global/polyfill';
import config from 'config';
import Vue from 'vue';
import $ from 'jquery';
import tool from 'util/tool';
import dev from 'global/dev.js';
import Vuex from 'vuex';
dev.processEnv();
Vue.use(Vuex);
Vue.use(require('extend/vue.common.js'));
// jquery 扩展
import 'velocity';
// vue 扩展

import datepicker from 'comp/common/datepicker.vue';
import centerlayer from 'comp/common/center-layer.vue';
import chosen from 'comp/common/chosen.vue';
import sideMenu from 'comp/common/side-menu.vue';
import layout from 'comp/common/page-layout.vue';
import sideNavBar from 'comp/common/side-navbar.vue';
import request from 'util/request';
import mlayer from 'lib/mlayer';
import 'extend/vue.placeholder.js';
import 'extend/vue.marquee.js';

// Reg Vue Component
Vue.component('datepicker', datepicker);
Vue.component('center-layer', centerlayer);
Vue.component('vue-chosen', chosen);
Vue.component('side-menu', sideMenu);
Vue.component('side-navbar', sideNavBar);
Vue.component('page-layout', layout);
Vue.component('v-select2', require('comp/common/v-select2.vue'));
Vue.use(require('extend/vue.eventhandler.js'));
require('../less/entry.less');
// Global Injection
window.$ = $;
export {
    Vue,
    config,
    $,
    mlayer,
    request,
    tool
};
import 'polyfill';
// 基础库
import Vue from 'vue';
import $ from 'jquery';
import config from 'config';
import mlayer from 'mlayer';
import Vuex from 'vuex';
import dev from 'global/dev.js';
dev.processEnv();
Vue.use(require('extend/vue.common.js'));
Vue.use(require('extend/vue.eventhandler.js'));
require('../less/entry.less');
// 公共组件
import 'comp/common/pagetitle';
import 'comp/common/loading';
import 'comp/table/footer';
import 'autoComplete';
// 公共扩展
import 'extend/vue.select2';
import 'extend/vue.placeholder';
import 'extend/vue.popover';

import MUITooltip from 'extend/vue.mui-tooltip.js';
import pageheader from 'comp/common/pageheader.vue';
import vdate from 'comp/common/date.vue';
import centerlayer from 'comp/common/center-layer.vue';
import btnGroup from 'comp/common/btn-group.vue';
import layerClosebtn from 'comp/common/layer-close-btn.vue';
import full_layer from 'comp/common/full-layer.vue';
import layout1 from 'comp/layout-1.vue';
import datetime from 'comp/common/datetime.vue';
import laydate from 'comp/common/laydate.vue';
import request from 'request';
import tool from 'util/tool.js';
Vue.directive('tooltip', MUITooltip);
Vue.component('vue-pageheader', pageheader);
Vue.component('v-chosen', require('comp/common/v-chosen.vue'));
Vue.component('vue-date', vdate);
Vue.component('input-number', require('comp/common/input-number.vue'));
Vue.component('center-layer', centerlayer);
Vue.component('btn-group', btnGroup);
Vue.component('layer-close-btn', layerClosebtn);
Vue.component('full-layer', full_layer);
Vue.component('layout-1', layout1);
Vue.component('vue-datetime', datetime);
Vue.component('laydate', laydate);
Vue.component('fileup', require('comp/common/fileup.vue'));
// 触点配置相关
Vue.component('touch-list-filter', require('comp/touch/list-filter.vue'));
Vue.component('touch-special-filter', require('comp/touch/special-filter.vue'));
Vue.component('touch-start-end-date', require('comp/touch/form-start-end-date.vue'));
Vue.component('touch-market-sentence', require('comp/touch/form-market-sentence.vue'));
Vue.component('touch-market-desc', require('comp/touch/form-market-desc.vue'));
Vue.component('touch-act-priority', require('comp/touch/form-show-priority.vue'));
Vue.component('touch-product-show', require('comp/touch/form-product-show.vue'));

export {
    config,
    Vue,
    tool,
    $,
    request,
    mlayer
};
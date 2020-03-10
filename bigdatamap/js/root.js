import 'polyfill';
// 基础库
import jQuery from 'jquery';
import Vue from 'vue';
import vuex from 'vuex';
import config from 'config';
import dev from 'global/dev';
import request from 'util/request';
import 'lib/jquery.easing.min.js';
Vue.use(vuex);
dev.processEnv();
// 扩展库
import MUIMsg from 'extend/vue.mui-msg.js';
import MUIMsgBox from 'extend/vue.mui-msgbox.js';
import MUIloading from 'extend/vue.mui-loading.js';
import MUITooltip from 'extend/vue.mui-tooltip.js';
import vueCommon from 'extend/vue.common.js';
import vFileUpload from 'comp/common/file-upload.vue';
//import vDate from 'comp/common/date.vue';
//import vChosen from 'comp/common/v-chosen.vue';
require('../less/entry.less');
Vue.prototype.$msg = MUIMsg;
Vue.prototype.$alert = MUIMsgBox.alert;
Vue.prototype.$confirm = MUIMsgBox.confirm;
Vue.prototype.$prompt = MUIMsgBox.prompt;
Vue.prototype.$loading = MUIloading;
Vue.directive('tooltip', MUITooltip);
Vue.use(vueCommon);
Vue.component('file-upload', vFileUpload);
// Vue.component('v-date', vDate);
// Vue.component('v-chosen', vChosen);
export {
    Vue,
    request
};
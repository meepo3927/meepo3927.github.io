import 'polyfill';
// 基础库
import Vue from 'vue';
import config from 'config';
import dev from 'global/dev';
import request from 'util/request';
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
Vue.directive('sticky', require('extend/vue.sticky.js'));
//Vue.directive('slimscroll', require('extend/vue.slimscroll.js'));
Vue.use(vueCommon);
Vue.component('file-upload', vFileUpload);
Vue.component('v-amap', require('comp/v-amap.vue'));
Vue.component('my-chart', require('comp/common/my-chart.vue'));
Vue.component('v-slider', require('comp/mui/slider.vue'));
Vue.component('center-layer', require('comp/common/center-layer.vue'))
// Vue.component('v-date', vDate);
// Vue.component('v-chosen', vChosen);
export {
    Vue,
    request
};
webpackJsonp([9],{528:function(t,e,s){var a=s(2)(s(569),s(622),function(t){s(645)},"data-v-7fc3fdeb",null);t.exports=a.exports},569:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s(49),o=s.n(a),n={submit:function(){var e=this;this.list1=null,this.list2=null;var s=mlayer.loading();this.vRequest.getLoginStat(this.submitParam).then(function(t){e.list1=t[1],e.list2=t[0],s.close()}).catch(function(t){s.close(),LOG(t),t.responseText&&0<=t.responseText.indexOf("未登录")?mlayer.msg("请先登录"):mlayer.msg("获取数据失败")})},getRate:function(t){if(t)return t+"%"}},i={submitParam:function(){return{startDate:this.startDate,endDate:this.endDate}}};e.default={data:function(){var t=o.a.Util.getDateOffset(new Date,-14),e=new Date;return{startDate:o.a.Util.getYMDStr(t),endDate:o.a.Util.getYMDStr(e),list1:null,list2:null}},created:function(){},methods:n,computed:i,watch:{},props:[],mounted:function(){this.$nextTick(this.submit)},mixins:[],beforeDestroy:function(){},components:{}}},588:function(t,e,s){(t.exports=s(0)()).push([t.i,".table-box[data-v-7fc3fdeb]{padding:10px;float:left}.t1[data-v-7fc3fdeb]{width:800px;margin-right:30px}.t2[data-v-7fc3fdeb]{width:300px}.m-table[data-v-7fc3fdeb]{border:1px solid #ccc}.m-table thead>tr>th[data-v-7fc3fdeb]{border-right:1px solid #ddd;padding-top:12px;padding-bottom:12px;font-size:16px}.m-table tbody>tr>td[data-v-7fc3fdeb]{border:1px solid #ddd}.common-form[data-v-7fc3fdeb]{padding:15px 10px}",""])},622:function(t,e){t.exports={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"login-stat "},[s("form",{staticClass:"common-form"},[s("div",{staticClass:"layout-row cell-ver-mid w-auto"},[s("label",{staticClass:"x-cell col-1",attrs:{for:""}},[e._v("日期：")]),e._v(" "),s("div",{staticClass:"x-cell"},[s("vue-date",{staticClass:"form-control",model:{value:e.startDate,callback:function(t){e.startDate=t},expression:"startDate"}})],1),e._v(" "),s("div",{staticClass:"x-cell ph10"},[e._v("至")]),e._v(" "),s("div",{staticClass:"x-cell"},[s("vue-date",{staticClass:"form-control",model:{value:e.endDate,callback:function(t){e.endDate=t},expression:"endDate"}})],1),e._v(" "),s("div",{staticClass:"x-cell pl15"},[s("button",{staticClass:"btn btn-primary",attrs:{type:"button"},on:{click:e.submit}},[e._v("查询")])])])]),e._v(" "),s("div",{staticClass:"table-wrapper clearfix"},[s("div",{staticClass:"table-box t-1"},[s("table",{staticClass:"m-table"},[e._m(0),e._v(" "),e.list1?s("tbody",e._l(e.list1,function(t){return s("tr",[s("td",{domProps:{textContent:e._s(t.cityTitle)}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.iopUser)}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.lopLogUser)}}),e._v(" "),s("td",{domProps:{textContent:e._s(e.getRate(t.logRate))}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.logNumber)}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.logAvg)}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.clickNumber)}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.clickAvg)}})])}),0):e._e()])]),e._v(" "),s("div",{staticClass:"table-box t-2"},[s("table",{staticClass:"m-table"},[e._m(1),e._v(" "),e.list2?s("tbody",e._l(e.list2,function(t){return s("tr",[s("td",{domProps:{textContent:e._s(t.moduleName)}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.accessUser)}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.accessNumber)}})])}),0):e._e()])])])])},staticRenderFns:[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("thead",[s("tr",[s("th",[t._v("分公司")]),t._v(" "),s("th",[t._v("账号数量")]),t._v(" "),s("th",[t._v("登陆账号数量")]),t._v(" "),s("th",[t._v("账号使用率")]),t._v(" "),s("th",[t._v("登录人次")]),t._v(" "),s("th",[t._v("人均登录次数")]),t._v(" "),s("th",[t._v("点击次数")]),t._v(" "),s("th",[t._v("人均点击次数")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("thead",[s("tr",[s("th",[t._v("模块名称")]),t._v(" "),s("th",[t._v("使用人数")]),t._v(" "),s("th",[t._v("点击次数")])])])}]}},645:function(t,e,s){var a=s(588);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);s(1)("4bb8031a",a,!0,{})}});
webpackJsonp([5],{107:function(t,a,e){var i=e(67),r=["鹰眼","风云","远方","征途","速析"],o={};o.submit=function(){var t=this;if(!0===this.check()){this.loading=!0;var a={name:encodeURIComponent(this.userName),mobilePhone:this.mobile,email:this.email,company:encodeURIComponent(this.depart),func:"appAccount"};this.vRequest.fetch3("/rest/account",a).then(function(a){LOG(a),t.loading=!1,t.reset(),t.$msg({text:"提交成功！请等待审核，审核结果将通过手机短信通知您。",type:"success",duration:6e3})}).catch(function(a){LOG(a),t.loading=!1,t.$msg(a.respMsg||"提交失败")})}},o.check=function(){if(!this.hasProChecked)return this.$msg("请选择至少一个产品");var t=i.all([[this.userName,"required:姓名"],[this.mobile,"required:手机号","mobile"],[this.email,"nullPass","email"],[this.captcha,"required:验证码"]]);return!0===t||this.$msg(t)},o.reset=function(){this.proChecked=r.map(function(){return!0}),this.userName="",this.mobile="",this.email="",this.depart="",this.captcha=""};var n={};n.prolist=function(){return r},n.prolistText=function(){return r.join("、")},n.hasProChecked=function(){for(var t=0;t<this.proChecked.length;t++)if(this.proChecked[t])return!0;return!1};var s={},l=function(){},m=function(){},c=function(){},p=function(){return{loading:!1,proChecked:r.map(function(){return!0}),userName:"",mobile:"",email:"",depart:"",captcha:""}};t.exports={data:p,created:l,methods:o,computed:n,watch:s,props:[],mounted:m,mixins:[],beforeDestroy:c,components:{}}},137:function(t,a,e){a=t.exports=e(0)(),a.push([t.i,".body-apply{background:url("+e(25)+") no-repeat 50%}",""])},138:function(t,a,e){a=t.exports=e(0)(),a.push([t.i,".page-apply>.v-title[data-v-5b7a20aa]{position:fixed;top:50%;left:50%;width:500px;margin-top:-330px;margin-left:-250px;text-align:center}.page-apply>.v-title h1[data-v-5b7a20aa]{color:#fff;font-size:38px;margin-top:0;margin-bottom:10px}.mform[data-v-5b7a20aa]{position:fixed;left:50%;top:50%;margin-top:-210px;margin-left:-223px;width:446px;height:480px}.mform>div>label[data-v-5b7a20aa]{font-size:16px}.mform input[type=text][data-v-5b7a20aa]{width:220px}.mform input[type=text].captcha-input[data-v-5b7a20aa]{width:130px}.mform .prolist-box label[data-v-5b7a20aa]{margin-right:35px;margin-bottom:10px;font-size:16px}.mform .prolist-text[data-v-5b7a20aa]{font-size:16px}.mform .captcha-img[data-v-5b7a20aa]{width:80px;height:32px}.mform .btn-box[data-v-5b7a20aa]{margin-top:45px;margin-left:102px}.mform .btn-box .btn-primary[data-v-5b7a20aa]{width:80px}.mform .btn-box button img[data-v-5b7a20aa]{width:16px;height:16px;vertical-align:-3px}",""])},225:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"page-apply"},[t._m(0),t._v(" "),e("div",{staticClass:"mform v-label-right form-layer"},[e("div",{staticClass:"m-row-auto mb5"},[e("label",[t._v("申请产品：")]),t._v(" "),e("div",{staticClass:"prolist-text",domProps:{textContent:t._s(t.prolistText)}})]),t._v(" "),e("div",{staticClass:"m-row-mid-auto mt25"},[t._m(1),t._v(" "),e("div",[e("input",{directives:[{name:"model",rawName:"v-model",value:t.userName,expression:"userName"}],staticClass:"form-control",attrs:{type:"text",id:"userName"},domProps:{value:t.userName},on:{input:function(a){a.target.composing||(t.userName=a.target.value)}}})])]),t._v(" "),e("div",{staticClass:"m-row-mid-auto"},[t._m(2),t._v(" "),e("div",[e("input",{directives:[{name:"model",rawName:"v-model",value:t.mobile,expression:"mobile"}],staticClass:"form-control",attrs:{type:"text",id:"mobile"},domProps:{value:t.mobile},on:{input:function(a){a.target.composing||(t.mobile=a.target.value)}}})])]),t._v(" "),e("div",{staticClass:"m-row-mid-auto"},[e("label",{attrs:{for:"email"}},[t._v("Email：")]),t._v(" "),e("div",[e("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],staticClass:"form-control",attrs:{type:"text",id:"email"},domProps:{value:t.email},on:{input:function(a){a.target.composing||(t.email=a.target.value)}}})])]),t._v(" "),e("div",{staticClass:"m-row-mid-auto"},[e("label",{attrs:{for:"depart"}},[t._v("所属单位：")]),t._v(" "),e("div",[e("input",{directives:[{name:"model",rawName:"v-model",value:t.depart,expression:"depart"}],staticClass:"form-control",attrs:{type:"text",id:"depart"},domProps:{value:t.depart},on:{input:function(a){a.target.composing||(t.depart=a.target.value)}}})])]),t._v(" "),e("div",{staticClass:"m-row-mid-auto"},[t._m(3),t._v(" "),e("div",[e("input",{directives:[{name:"model",rawName:"v-model",value:t.captcha,expression:"captcha"}],staticClass:"form-control captcha-input",attrs:{type:"text",id:"captcha"},domProps:{value:t.captcha},on:{input:function(a){a.target.composing||(t.captcha=a.target.value)}}})]),t._v(" "),e("div",{staticClass:"pl10"},[e("img",{staticClass:"captcha-img",attrs:{src:t.getImageUrl("/captcha.jpg")}})])]),t._v(" "),e("div",{staticClass:"btn-box"},[e("button",{staticClass:"btn btn-primary",on:{click:t.submit}},[t._v("\r\n                提交\r\n                "),e("img",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"ml5",attrs:{src:t.getImageUrl("/loading.gif")}})])])])])},staticRenderFns:[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"v-title"},[e("h1",[t._v("内蒙古移动大数据平台")]),t._v(" "),e("h1",[t._v("体验账号申请")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("label",{attrs:{for:"userName"}},[e("em",{staticClass:"red-star"},[t._v("*")]),t._v("姓名：")])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("label",{attrs:{for:"mobile"}},[e("em",{staticClass:"red-star"},[t._v("*")]),t._v("手机号：")])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("label",{attrs:{for:"captcha"}},[e("em",{staticClass:"red-star"},[t._v("*")]),t._v("验证码：")])}]}},27:function(t,a,e){function i(t){e(273),e(272)}var r=e(2)(e(107),e(225),i,"data-v-5b7a20aa",null);t.exports=r.exports},272:function(t,a,e){var i=e(137);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);e(1)("4fb041d6",i,!0,{})},273:function(t,a,e){var i=e(138);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);e(1)("a57578e6",i,!0,{})},35:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=e(3),r=e(27),o=e.n(r);new i.Vue({el:"#main",components:{"v-main":o.a}})},4:function(t,a){t.exports=dll},67:function(t,a){var e=function(t){return""===t||null===t||void 0===t},i={required:"请填写",number:"请填写数字",maxlen:"超过最大长度限制",mobile:"请输入11位有效手机号",password:"密码为6-16位数字或字母",email:"请输入正确的email，例如：abc@gmail.com",url:"请输入正确的URL"},a={errmsg:i},r=function(t,e){var i=a[t];return"function"!=typeof i||"all"===t||i(e)};a.required=function(t){return t.trim().length>0},a.mobile=function(t){return!!/^1\d{10}$/.test(t)},a.email=function(t){return!!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(t)},a.all=function(t){if(!t||0===t.length)return!0;for(var a=0;a<t.length;a++)for(var o=t[a],n=o[0],s=1;s<o.length&&("nullPass"!==o[s]||!e(n));s++){var l=o[s].split(":"),m=l[0],c=l[1]||"";if(!r(m,n))return i[m]+c}return!0},t.exports=a}},[35]);
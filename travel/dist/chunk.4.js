webpackJsonp([4],{

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

var mounted = function mounted() {
    if (!this.charts) {
        this.charts = {};
    }
    this.$on('window-resize', this.handleResize);
};
var destroyed = function destroyed() {
    this.$off('window-resize', this.handleResize);
    this._chartlayermix_destroyed = true;
};
var activated = function activated() {
    this._deactivated = false;
    this.$nextTick(function () {
        this.resizeAllCharts();
    });
};
var deactivated = function deactivated() {
    this._deactivated = true;
};
var methods = {};
methods.handleResize = function (e) {
    var _this = this;

    if (this._chartlayermix_destroyed) {
        return false;
    }
    if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
    }
    this.resizeTimer = setTimeout(function () {
        _this.resizeAllCharts();
    }, 80);
};
methods.resizeAllCharts = function () {
    if (this._deactivated) {
        return;
    }
    for (var i in this.charts) {
        if (!this.charts.hasOwnProperty(i)) {
            continue;
        }
        if (this.charts[i] && this.charts[i].resize) {
            this.charts[i].resize();
        }
    }
};
module.exports = {
    methods: methods,
    activated: activated,
    deactivated: deactivated,
    mounted: mounted,
    destroyed: destroyed,
    mixins: [__webpack_require__(146)]
};

/***/ }),

/***/ 146:
/***/ (function(module, exports) {

// 依赖vue.eventhandler.js

var created = function created() {
    if (this._bind_resized) {
        return;
    }
    window.addEventListener('resize', this);
    this._bind_resized = true;
};

var beforeDestroy = function beforeDestroy() {
    window.removeEventListener('resize', this);
    this._bind_resized = false;
};

module.exports = {
    created: created,
    beforeDestroy: beforeDestroy
};

/***/ }),

/***/ 147:
/***/ (function(module, exports) {

var mounted = function mounted() {};
var destroyed = function destroyed() {};
var activated = function activated() {};
var deactivated = function deactivated() {};
var methods = {};
methods.windowMax = function () {
    var _this = this;

    this.$refs.clayer.fullMode(function () {
        _this.$emit('window-resize', 'full');
    });
    this.isFullMode = true;
};
methods.windowRestore = function () {
    var _this2 = this;

    this.$refs.clayer.restoreMode(function () {
        _this2.$emit('window-resize', 'restore');
    });
    this.isFullMode = false;
};
var computed = {};
module.exports = {
    props: [],
    data: function data() {
        var o = {
            isFullMode: false
        };
        return o;
    },
    methods: methods,
    computed: computed,
    activated: activated,
    deactivated: deactivated,
    mounted: mounted,
    destroyed: destroyed
};

/***/ }),

/***/ 148:
/***/ (function(module, exports, __webpack_require__) {

var Cover = __webpack_require__(149);
var mounted = function mounted() {
    this._cover = new Cover();
};
var destroyed = function destroyed() {
    if (this._cover) {
        this._cover.remove();
        this._cover = null;
    }
};
var activated = function activated() {
    if (this._cover) {
        this._cover.show();
    }
};
var deactivated = function deactivated() {
    if (this._cover) {
        this._cover.hide();
    }
};
var methods = {};
var computed = {};
module.exports = {
    props: [],
    methods: methods,
    computed: computed,
    activated: activated,
    deactivated: deactivated,
    mounted: mounted,
    destroyed: destroyed
};

/***/ }),

/***/ 149:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * 遮罩层
 */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    var zIndex = 3000;
    var opacity = 0.6;
    function Cover() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var elem = document.createElement('div');
        elem.className = '';
        elem.style.display = 'none';
        elem.style.width = '100%';
        elem.style.height = '100%';
        elem.style.backgroundColor = '#000';
        elem.style.position = 'fixed';
        elem.style.top = '0';
        elem.style.left = '0';
        elem.style.right = '0';
        elem.style.bottom = '0';
        elem.style.zIndex = options.zIndex || zIndex;
        elem.style.opacity = options.opacity || opacity;
        elem.style.filter = 'alpha(opacity=' + 100 * opacity + ')';
        if (options.className) {
            elem.className += options.className;
        }
        document.body.appendChild(elem);
        this.elem = elem;
        this.options = options;
        this.init();
    }
    var proto = Cover.prototype;
    proto.init = function () {
        // 默认显示
        if (this.options.show !== false) {
            this.show();
        }
    };
    proto.show = function () {
        this.elem.style.display = 'block';
    };
    proto.hide = function () {
        this.elem.style.display = 'none';
    };
    proto.remove = function () {
        document.body.removeChild(this.elem);
    };

    return Cover;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var methods = {};
var computed = {};
computed.maxVisible = function () {
	if (this.full === false) {
		return true;
	}
	return false;
};
computed.restoreVisible = function () {
	if (this.full === true) {
		return true;
	}
	return false;
};
var watch = {};
var mounted = function mounted() {};
var destroyed = function destroyed() {};
var dataFunc = function dataFunc() {
	var o = {};
	return o;
};
/* harmony default export */ __webpack_exports__["default"] = ({
	data: dataFunc,
	watch: watch,
	mixins: [],
	methods: methods,
	computed: computed,
	props: ['full'],
	mounted: mounted,
	destroyed: destroyed,
	components: {}
});

/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.close-btn-box[data-v-1f529e94] {\n  position: absolute;\n  top: 6px;\n  right: 12px;\n  z-index: 1111;\n}\n.close-btn-box > a[data-v-1f529e94] {\n  vertical-align: middle;\n  font-size: 22px;\n}\n.close-btn-box > a.x-close[data-v-1f529e94] {\n  font-size: 27px;\n}\n", ""]);

// exports


/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(154)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(150),
  /* template */
  __webpack_require__(153),
  /* scopeId */
  "data-v-1f529e94",
  /* cssModules */
  null
)
Component.options.__file = "D:\\wamp\\www\\meepo3927.github.io\\travel\\js\\comp\\chart_layer\\close-box.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] close-box.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1f529e94", Component.options)
  } else {
    hotAPI.reload("data-v-1f529e94", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "close-btn-box"
  }, [(_vm.maxVisible) ? _c('a', {
    staticClass: "x-max layer-icon-btn mr5",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.$emit('max')
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-window-maximize"
  })]) : _vm._e(), _vm._v(" "), (_vm.restoreVisible) ? _c('a', {
    staticClass: "x-restore layer-icon-btn mr5",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.$emit('restore')
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-window-restore"
  })]) : _vm._e(), _vm._v(" "), _c('a', {
    staticClass: "x-close layer-icon-btn",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.$emit('close')
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-times"
  })])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1f529e94", module.exports)
  }
}

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(151);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("4fe33a66", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-1f529e94\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/less-loader/index.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./close-box.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-1f529e94\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/less-loader/index.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./close-box.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 156:
/***/ (function(module, exports) {

var refreshInterval = 60;

var mounted = function mounted() {
    this.setupRefresh();
};
var destroyed = function destroyed() {
    clearInterval(this.refreshTimer);
};
var activated = function activated() {
    this.setupRefresh();
};
var deactivated = function deactivated() {
    this.closeRefresh();
};
var methods = {};
methods.refreshCurrent = function () {
    var i = this.active;
    var funcName = 'render' + i;
    this[funcName] && this[funcName]({
        chart: this.charts.c
    });
};
methods.setupRefresh = function () {
    var _this = this;

    this.closeRefresh();
    this.refreshTimer = setInterval(function () {
        _this.refreshCurrent();
    }, refreshInterval * 1000);
};
methods.closeRefresh = function () {
    if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
    }
};
methods.render = function (a) {
    if (a === this.active) {
        return;
    }
    this.active = a;
    var m = 'render' + a;
    this[m] && this.$nextTick(this[m]);
};
var computed = {};
computed.id = function () {
    return this.area ? this.area.id : 0;
};
computed.areaName = function () {
    if (this.area) {
        return this.area[this.area.level];
    }
    return '';
};
computed.title = function () {
    return this.areaName + '实时客流量';
};
module.exports = {
    props: ['area'],
    data: function data() {
        var o = {
            active: 0
        };
        return o;
    },
    methods: methods,
    computed: computed,
    activated: activated,
    deactivated: deactivated,
    mounted: mounted,
    destroyed: destroyed
};

/***/ }),

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_chart__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_request__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var tool = __webpack_require__(10);

var docHtml = document.documentElement;
var docBody = document.body;
var getHeight = function getHeight() {
    return docHtml.clientHeight || docBody.clientHeight;
};
var getUserNum = function getUserNum(list) {
    var len = list.length;
    for (var i = len - 3; i >= 0; i--) {
        var item = list[i] || {};
        if (item.userNum !== undefined) {
            return item.userNum;
        }
    }
    return 0;
};
var methods = {};
methods.layerReady = function () {
    var defaultActive = 1;
    if (this.$parent.$refs.realtimeChart) {
        var rc = this.$parent.$refs.realtimeChart;
        if (rc.active) {
            defaultActive = rc.active;
        }
    }
    this.render(defaultActive);
};
methods.getBoxHeight = function () {
    return $(this.$refs.blayer).height();
};
methods.getMyChart = function (el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.chart) {
        this.charts.c = options.chart;
        return options.chart;
    }
    if (this.charts.c) {
        this.charts.c.dispose();
        this.charts.c = null;
    }
    this.charts.c = __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getLoadingChart(el);
    return this.charts.c;
};
methods.render1 = function () {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var chart = this.getMyChart(this.$refs.one, options);
    __WEBPACK_IMPORTED_MODULE_1_util_request__["a" /* default */]['getAttractionRealtime1'](this.id).then(function (result) {
        chart.hideLoading();
        _this.userNum = getUserNum(result);
        chart.setOption(__WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getHumanTrafficOption({
            title: {
                text: '景区人流量监控',
                subtext: _this.areaName
            },
            data: result
        }));
    }, function () {
        chart.hideLoading();
    });
};
methods.render2 = function () {
    var _this2 = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var chart = this.getMyChart(this.$refs.two, options);

    __WEBPACK_IMPORTED_MODULE_1_util_request__["a" /* default */]['getAttractionRealtime2'](this.id).then(function (result) {
        chart.hideLoading();
        chart.setOption(__WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getAttractionInOutOption({
            title: '景区迁入/迁出人数监控',
            subtitle: _this2.areaName,
            data: result
        }));
    }, function () {
        chart.hideLoading();
    });
};
methods.render3 = function () {
    var _this3 = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var chart = this.getMyChart(this.$refs.three, options);
    __webpack_require__.e/* require.ensure */(0/* duplicate */).then((function () {
        __webpack_require__(142);
        __webpack_require__(143);
        _this3.realRender3(chart);
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
methods.realRender3 = function (chart) {
    var _this4 = this;

    __WEBPACK_IMPORTED_MODULE_1_util_request__["a" /* default */].getAttractionSource1(this.id).then(function (data) {
        __WEBPACK_IMPORTED_MODULE_1_util_request__["a" /* default */].getAttractionSource12(_this4.id).then(function (data2) {
            chart.hideLoading();
            var o = __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getAttractionSource1Option({
                data: data || [],
                nmData: data2 || []
            });
            chart.setOption(o);
        });
    }, function () {
        chart.hideLoading();
    });
};
methods.setHeight = function () {
    this.h = this.getBoxHeight();
};
var computed = {};
computed.imgStyle = function () {
    var s = {};
    var v = this.h * 0.27;
    s.height = v + 'px';
    s.width = v + 'px';
    return s;
};
computed.pStyle = function () {
    var s = {};
    s.fontSize = this.h * 0.03 + 'px';
    return s;
};
computed.numStyle = function () {
    var s = {};
    s.fontSize = this.h * 0.14 + 'px';
    return s;
};
var watch = {};
var created = function created() {
    this.$on('handle-resize', this.setHeight);
    this.$on('window-resize', this.setHeight);
};
var mounted = function mounted() {};
var beforeDestroy = function beforeDestroy() {
    this.$off('window-resize', this.setHeight);
    this.$off('handle-resize', this.setHeight);
};
var destroyed = function destroyed() {};
var dataFunc = function dataFunc() {
    var o = {
        userNum: '&nbsp;',
        h: getHeight()
    };
    return o;
};
/* harmony default export */ __webpack_exports__["default"] = ({
    data: dataFunc,
    watch: watch,
    mixins: [__webpack_require__(146), __webpack_require__(148), __webpack_require__(144), __webpack_require__(156), __webpack_require__(147)],
    methods: methods,
    computed: computed,
    props: [],
    created: created,
    mounted: mounted,
    beforeDestroy: beforeDestroy,
    destroyed: destroyed,
    components: {
        'close-box': __webpack_require__(152)
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.my-chart[data-v-f06578ba] {\n  height: 100%;\n  padding: 8px 10px;\n}\n.x-body[data-v-f06578ba] {\n  top: 13%;\n}\n.info-row[data-v-f06578ba] {\n  margin-left: auto;\n  margin-right: auto;\n}\n.info-row .col-2[data-v-f06578ba] {\n  padding-left: 12px;\n}\n.info-row .col-2 .user-num[data-v-f06578ba] {\n  color: #ff2847;\n  margin: 7px 0 7px 0;\n}\n.info-row .col-2 .p-title[data-v-f06578ba],\n.info-row .col-2 .p-copyright[data-v-f06578ba] {\n  padding-left: 8px;\n  line-height: 1.4;\n  color: #666;\n  font-weight: 600;\n}\n.x-foot.active-1[data-v-f06578ba] {\n  top: 40%;\n}\n", ""]);

// exports


/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('center-layer', {
    ref: "clayer",
    attrs: {
      "width": "96%",
      "height": "94%",
      "anim": "true"
    },
    on: {
      "ready": _vm.layerReady
    }
  }, [_c('div', {
    ref: "blayer",
    staticClass: "big-chart-layer vertical-flex",
    class: {
      'full-mode': _vm.isFullMode
    }
  }, [_c('close-box', {
    attrs: {
      "full": _vm.isFullMode
    },
    on: {
      "close": function($event) {
        _vm.$emit('close')
      },
      "max": _vm.windowMax,
      "restore": _vm.windowRestore
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "x-head"
  }, [_c('span', {
    staticClass: "x-title",
    domProps: {
      "textContent": _vm._s(_vm.title)
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "btn-group mb10 ver-top ml10"
  }, [_c('button', {
    staticClass: "btn",
    class: {
      active: _vm.active === 1
    },
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.render(1)
      }
    }
  }, [_vm._v("景点流量监控")]), _vm._v(" "), _c('button', {
    staticClass: "btn",
    class: {
      active: _vm.active === 2
    },
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.render(2)
      }
    }
  }, [_vm._v("迁入/迁出流量分析")]), _vm._v(" "), _c('button', {
    staticClass: "btn",
    class: {
      active: _vm.active === 3
    },
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.render(3)
      }
    }
  }, [_vm._v("景区客流来源排行")])])]), _vm._v(" "), (_vm.active === 1) ? _c('div', {
    staticClass: "x-body"
  }, [_c('div', {
    staticClass: "m-row w-auto col-mid info-row"
  }, [_c('div', {
    staticClass: "col-1 m-col"
  }, [_c('img', {
    style: (_vm.imgStyle),
    attrs: {
      "src": _vm.vImgPath + '/logo_o.png'
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "col-2 m-col"
  }, [_c('p', {
    staticClass: "p-title",
    style: (_vm.pStyle)
  }, [_vm._v("景区实时人数")]), _vm._v(" "), _c('div', {
    staticClass: "user-num",
    style: (_vm.numStyle),
    domProps: {
      "innerHTML": _vm._s(_vm.userNum)
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "p-copyright",
    style: (_vm.pStyle)
  }, [_vm._v("内蒙古移动提供大数据支持")])])])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "x-foot",
    class: ['active-' + _vm.active]
  }, [(_vm.active === 1) ? _c('div', {
    ref: "one",
    staticClass: "my-chart"
  }) : _vm._e(), _vm._v(" "), (_vm.active === 2) ? _c('div', {
    ref: "two",
    staticClass: "my-chart"
  }) : _vm._e(), _vm._v(" "), (_vm.active === 3) ? _c('div', {
    ref: "three",
    staticClass: "my-chart"
  }) : _vm._e()])], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-f06578ba", module.exports)
  }
}

/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(182);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("4c7b9271", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-f06578ba\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/less-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./attraction_realtime_big.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-f06578ba\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/less-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./attraction_realtime_big.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(217)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(164),
  /* template */
  __webpack_require__(204),
  /* scopeId */
  "data-v-f06578ba",
  /* cssModules */
  null
)
Component.options.__file = "D:\\wamp\\www\\meepo3927.github.io\\travel\\js\\comp\\attraction_realtime_big.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] attraction_realtime_big.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f06578ba", Component.options)
  } else {
    hotAPI.reload("data-v-f06578ba", Component.options)
  }
})()}

module.exports = Component.exports


/***/ })

});
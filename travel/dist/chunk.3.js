webpackJsonp([3],{

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(221)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(175),
  /* template */
  __webpack_require__(208),
  /* scopeId */
  "data-v-ca443942",
  /* cssModules */
  null
)
Component.options.__file = "D:\\wamp\\www\\meepo3927.github.io\\travel\\js\\comp\\city_realtime_big.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] city_realtime_big.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca443942", Component.options)
  } else {
    hotAPI.reload("data-v-ca443942", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 149:
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
    mixins: [__webpack_require__(151)]
};

/***/ }),

/***/ 151:
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

/***/ 152:
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

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

var Cover = __webpack_require__(154);
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

/***/ 154:
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

/***/ 155:
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

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.close-btn-box[data-v-1f529e94] {\n  position: absolute;\n  top: 6px;\n  right: 12px;\n  z-index: 1111;\n}\n.close-btn-box > a[data-v-1f529e94] {\n  vertical-align: middle;\n  font-size: 22px;\n}\n.close-btn-box > a.x-close[data-v-1f529e94] {\n  font-size: 27px;\n}\n", ""]);

// exports


/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(159)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(155),
  /* template */
  __webpack_require__(158),
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

/***/ 158:
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

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(156);
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

/***/ 161:
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

/***/ 175:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_chart__ = __webpack_require__(11);
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



var tool = __webpack_require__(10);
var methods = {};
methods.optionClick = function (item) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    item.active = !item.active;
    var option = null;
    if (this.active === 1) {
        this.itemActive1[item.sceneryId] = item.active;
        var param = this.selectedOptions;
        option = __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getAttractionUserRealtime(param);
        this.charts.c.setOption(option, true); // not Merge
        this.$emit('render-option', this.active, param);
    } else if (this.active === 2) {
        this.itemActive2 = item.placeID;
        this.options.forEach(function (v) {
            if (v === item) {
                v.active = true;
                return;
            }
            if (v.placeID && v.placeID === item.placeID) {
                v.active = true;
                return;
            }
            v.active = false;
        });

        var chart = options.chart || __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getLoadingChart(this.$refs.two);
        this.charts.c = chart;
        __WEBPACK_IMPORTED_MODULE_1_util_request__["a" /* default */].getAttractionRealtime2(item.placeID).then(function (result) {
            var param = result;
            chart.hideLoading();
            option = __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getAttractionInOutOption({
                titleOption: __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getTitleOption2(item.sceneryName, '景区迁入/迁出人数监控'),
                data: result
            });

            chart.setOption(option);
            _this.$emit('render-option', _this.active, item);
        });
    }
};

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
methods.processOptions = function (result) {
    var _this2 = this;

    return result.map(function (v, i) {
        var n = {};
        for (var p in v) {
            n[p] = v[p];
        }

        // 第一个默认选中
        n.active = i === 0 ? true : false;

        // 根据之前操作选中
        if (_this2.active === 1) {
            var b = _this2.itemActive1[v.sceneryId];
            if (b !== undefined) {
                n.active = b;
            }
        } else if (_this2.active === 2) {
            if (_this2.itemActive2) {
                n.active = v.placeID === _this2.itemActive2;
            }
        }

        if (n.placeName) {
            n.sceneryName = n.placeName;
        }
        return n;
    });
};
methods.getItemStyle = function (item) {
    var index = this.selectedOptions.indexOf(item);
    if (index < 0) {
        return null;
    }
    var o = {};
    var c = __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getThemeColorByIndex(index, this.themeColor);
    if (c) {
        o.color = c;
    }
    return o;
};
methods.render1 = function () {
    var _this3 = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var chart = options.chart || __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getLoadingChart(this.$refs.one);
    this.charts.c = chart;
    __WEBPACK_IMPORTED_MODULE_1_util_request__["a" /* default */]['getCityRealtime1'](this.id).then(function (result) {
        if (_this3.active !== 1) {
            return;
        }
        // build options
        _this3.options = [];
        _this3.options = _this3.processOptions(result);
        chart.hideLoading();
        var option = __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getAttractionUserRealtime(_this3.selectedOptions);
        chart.setOption(option, true);
        _this3.$emit('render-option', _this3.active, _this3.selectedOptions);
    }, function () {
        chart.hideLoading();
    });
};
methods.render2 = function () {
    var _this4 = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options = [];
    __WEBPACK_IMPORTED_MODULE_1_util_request__["a" /* default */]['getAttractionsOfCity'](this.id).then(function (result) {
        if (_this4.active !== 2) {
            return;
        }

        _this4.options = _this4.processOptions(result);
        var defaultOption = _this4.options[0];
        _this4.options.forEach(function (v) {
            if (v.active) {
                defaultOption = v;
            }
        });
        _this4.optionClick(defaultOption, options);
    }, function () {
        mlayer.msg('没有获取到景区');
    });
};
var computed = {};
computed.selectedOptions = function () {
    var a = [];
    this.options.forEach(function (v) {
        v.active && a.push(v);
    });
    return a;
};
var watch = {};
var created = function created() {
    var _this5 = this;

    this.themeColor = __WEBPACK_IMPORTED_MODULE_0_util_chart__["default"].getThemeColor();

    var realtimeChart = this.$parent.$refs.realtimeChart;
    if (realtimeChart) {
        var param1 = realtimeChart.param1 || [];
        param1.forEach(function (id) {
            _this5.itemActive1[id] = true;
        });

        var param2 = realtimeChart.param2 || {};
        if (param2.placeID) {
            this.itemActive2 = param2.placeID;
        }
    }
};
var mounted = function mounted() {};
var destroyed = function destroyed() {};
var dataFunc = function dataFunc() {
    var o = {
        itemActive1: {},
        itemActive2: '',
        options: []
    };
    return o;
};
/* harmony default export */ __webpack_exports__["default"] = ({
    data: dataFunc,
    watch: watch,
    mixins: [__webpack_require__(153), __webpack_require__(149), __webpack_require__(161), __webpack_require__(152)],
    created: created,
    methods: methods,
    computed: computed,
    props: [],
    mounted: mounted,
    destroyed: destroyed,
    components: {
        'close-box': __webpack_require__(157)
    }
});

/***/ }),

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.my-chart[data-v-ca443942] {\n  height: 100%;\n}\n.x-left[data-v-ca443942] {\n  width: 190px;\n}\n.x-foot[data-v-ca443942] {\n  left: 200px;\n}\n", ""]);

// exports


/***/ }),

/***/ 208:
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
  }, [_vm._v("迁入/迁出流量分析")])])]), _vm._v(" "), _c('div', {
    staticClass: "x-left o-scroll"
  }, [_c('ul', {
    staticClass: "option-list"
  }, _vm._l((_vm.options), function(item) {
    return _c('li', {
      class: {
        active: item.active
      },
      style: (_vm.getItemStyle(item)),
      on: {
        "click": function($event) {
          _vm.optionClick(item)
        }
      }
    }, [_c('i', {
      staticClass: "fa",
      class: [item.active ? 'fa-check-circle' : 'fa-circle-o']
    }), _vm._v(" "), _c('span', {
      domProps: {
        "textContent": _vm._s(item.sceneryName)
      }
    })])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "x-foot with-left"
  }, [(_vm.active === 1) ? _c('div', {
    ref: "one",
    staticClass: "my-chart"
  }) : _vm._e(), _vm._v(" "), (_vm.active === 2) ? _c('div', {
    ref: "two",
    staticClass: "my-chart"
  }) : _vm._e()])], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ca443942", module.exports)
  }
}

/***/ }),

/***/ 221:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(186);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("0a40ee88", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-ca443942\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/less-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./city_realtime_big.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-ca443942\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/less-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./city_realtime_big.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});
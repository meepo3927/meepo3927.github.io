<template>
  <div class="vue-echarts"></div>
</template>

<style scoped lang="less">
.vue-echarts {
  height: 100%;
}
</style>

<script>
import echarts from 'echarts';
import Vue from 'vue';
import 'lib/echarts_theme/vintage';
import 'lib/echarts_theme/roma.js';
import 'lib/echarts_theme/bigshow.js';
import 'lib/echarts_theme/shine.js';
import 'lib/echarts_theme/dark.js';
import 'lib/echarts_theme/infographic.js';
//const loadingText = '正在加载数据...';
const loadingText = '';
const loadingOpt = {
  text: loadingText,
  color: 'rgba(255, 255, 255, 0)'
};
// enumerating ECharts events for now
const ACTION_EVENTS = [
  'legendselectchanged',
  'legendselected',
  'legendunselected',
  'datazoom',
  'datarangeselected',
  'timelinechanged',
  'timelineplaychanged',
  'restore',
  'dataviewchanged',
  'magictypechanged',
  'geoselectchanged',
  'geoselected',
  'geounselected',
  'pieselectchanged',
  'pieselected',
  'pieunselected',
  'mapselectchanged',
  'mapselected',
  'mapunselected',
  'axisareaselected',
  'brush',
  'brushselected'
]

const MOUSE_EVENTS = [
  'click',
  'dblclick',
  'mouseover',
  'mouseout',
  'mousedown',
  'mouseup',
  'globalout'
]

export default {
  props: {
    options: Object,
    theme: String,
    initOptions: Object,
    group: String,
    loading: Boolean,
    autoResize: Boolean
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {
    // Only recalculated when accessed from JavaScript.
    // Won't update DOM on value change because getters
    // don't depend on reactive values
    width: {
      cache: false,
      get () {
        return this.chart.getWidth()
      }
    },
    height: {
      cache: false,
      get () {
        return this.chart.getHeight()
      }
    },
    isDisposed: {
      cache: false,
      get () {
        return this.chart.isDisposed()
      }
    }
  },
  watch: {
    // use assign statements to tigger "options" and "group" setters
    options: {
      handler (options) {
        if (options) {
          if (!this.chart) {
            this._init();
          } else {
            this.chart.setOption(this.options, true);
          }
        } else {
          this.reset();
        }

      },
      deep: true
    },
    group: {
      handler (group) {
        this.chart.group = group
      }
    },
    loading: function (v) {
      if (this.chart) {
        v 
        ? this.chart.showLoading('default', loadingOpt)
        : this.chart.hideLoading();
      }
    }
  },
  methods: {
    reset () {
      this.clear();
      if (this.loading) {
        this.chart.showLoading('default', loadingOpt);
      }
    },
    // provide a explicit merge option method
    mergeOptions (options) {
      this._delegateMethod('setOption', options)
    },
    // just delegates ECharts methods to Vue component
    // use explicit params to reduce transpiled size for now
    resize (options) {
      this._delegateMethod('resize', options)
    },
    dispatchAction (payload) {
      this._delegateMethod('dispatchAction', payload)
    },
    convertToPixel (finder, value) {
      return this._delegateMethod('convertToPixel', finder, value)
    },
    convertFromPixel (finder, value) {
      return this._delegateMethod('convertFromPixel', finder, value)
    },
    containPixel (finder, value) {
      return this._delegateMethod('containPixel', finder, value)
    },
    showLoading (type, options) {
      this._delegateMethod('showLoading', type, options)
    },
    hideLoading () {
      this._delegateMethod('hideLoading')
    },
    getDataURL (options) {
      return this._delegateMethod('getDataURL', options)
    },
    getConnectedDataURL (options) {
      return this._delegateMethod('getConnectedDataURL', options)
    },
    clear () {
      this._delegateMethod('clear')
    },
    dispose () {
      this._delegateMethod('dispose');
      this.chart = null;
    },
    _delegateMethod (name, ...args) {
      if (!this.chart) {
        Vue.util.warn(`Cannot call [${name}] before the chart is initialized. Set prop [options] first.`, this)
        return
      }
      return this.chart[name](...args)
    },
    _init () {
      if (this.chart) {
        return
      }

      let chart = echarts.init(this.$el, this.theme, this.initOptions)

      if (this.group) {
        chart.group = this.group
      }
      chart.setOption(this.options || {}, true);
      

      // expose ECharts events as custom events
      ACTION_EVENTS.forEach(event => {
        chart.on(event, params => {
          this.$emit(event, params)
        })
      })
      MOUSE_EVENTS.forEach(event => {
        chart.on(event, params => {
          this.$emit(event, params)

          // for backward compatibility, may remove in the future
          this.$emit('chart' + event, params)
        })
      })
      if (this.autoResize !== false) {
        this.__resizeHanlder = () => {
          chart.resize()
        };
        window.addEventListener('resize', this.__resizeHanlder);
      }

      this.chart = chart
    }
  },
  mounted () {
    // auto init if `options` is already provided
    if (this.options) {
      this._init()
    }

    if (this.loading) {
      this._init();
      this.showLoading('default', loadingOpt);
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    if (this.__resizeHanlder) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    this.dispose()
  },
  connect (group) {
    if (typeof group !== 'string') {
      group = group.map(chart => chart.chart)
    }
    echarts.connect(group)
  },
  disconnect (group) {
    echarts.disConnect(group)
  },
  registerMap (...args) {
    echarts.registerMap(...args)
  },
  registerTheme (...args) {
    echarts.registerTheme(...args)
  }
}
</script>

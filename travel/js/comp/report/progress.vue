<template>
<div class="progress-cover" v-if="layerVisible">
    <!-- 进行中 -->
    <div class="i-wrapper" >
        <div class="current-status" v-if="doing">
            <i class="fa fa-clock-o"></i>
            <span>正在提取数据...</span>
        </div>
        <div class="current-status" v-if="done">
            <i class="fa fa-checked-o"></i>
            <span>
                数据提取已完成！
                <a href="javascript:;" @click="restore">立即查看数据</a>
            </span>
        </div>
        <!-- <div class="loading-bar"></div> -->
        <div class="percent-bar mt15">
            <span class="x-1" v-text="isBarTooThin ? '' : percentStr" 
                :style="{width: percentStr}"></span>
            <span class="x-2" v-text="percentStr" v-show="isBarTooThin"></span>
        </div>
    </div>

</div>
</template>

<script>
import {request} from 'root';
const STATUS_DEFAULT = '0';
const STATUS_RUNNING = '1';
const FETCH_INTERVAL = 5 * 1000;

let methods = {};
methods.start = function () {
    this.layerVisible = true;
    this.fetchRender();
};
// 查看数据
methods.restore = function () {
    clearTimeout(this.timer);
    this.layerVisible = false;
    this.$store.commit('init', true);
    this.vBus.fire('restoreReportParam', [this.info.param]);
};
methods.delayFetch = function () {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.fetchRender, FETCH_INTERVAL);
};
methods.fetchRender = function () {
    request.getJSON3('/async/report/status').then((data) => {
        this.info = data;
        this.delayFetch();
        // this.$store.commit('init', true);
    }).catch((e) => {
        this.delayFetch();
    });
};
methods.initFetch = function () {
    request.getJSON3('/async/report/status').then((data) => {
        if (data.status === STATUS_RUNNING) {
            this.layerVisible = true;
            this.info = data;
            this.delayFetch();
        } else {
            this.$store.commit('init', true);
        }
    }).catch(() => {
        this.$store.commit('init', true);
    });
};
let computed = {};
computed.percent = function () {
    if (!this.info) {
        return 0;
    }
    let o = this.info;
    if (o.all === 0) {
        return 0;
    }
    return Math.ceil(100 * o.done / o.all);
};
computed.percentStr = function () {
    return this.percent + '%'
};
computed.doing = function () {
    return !this.done;
};
computed.done = function () {
    if (!this.info) {
        return false;
    }
    return (this.info.done === this.info.all);
};
computed.isBarTooThin = function () {
    return (this.percent < 10);
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.initFetch();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        layerVisible: false,
        info: undefined
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "../../ref";
.progress-cover {
    position: fixed;
    top: 0;
    left: @side-nav-width;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background-color: rgba(255, 255, 255, .8);
}
.i-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    text-align: center;
    .current-status {
        margin-top: 42vh;
        font-size: 28px;
        em {
            color: #f00;
        }
        i.fa {
            font-size: 40px;
            color: #409eff;
            vertical-align: -4px;
            margin-right: 6px;
        }
    }
}
.percent-bar {
    @my-height:  28px;
    @my-radius:  @my-height / 2;
    height: @my-height;
    border-radius: @my-radius;
    width: 460px;
    background-color: #ebeef5;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    box-shadow: 0 2px 3px #999;
    & > span {
        display: inline-block;
        height: 100%;
        line-height: @my-height;
        vertical-align: top;
    }
    & > .x-1 {
        text-align: right;
        padding-right: 10px;
        //background-color: #67c23a;
        background-color: #409eff;
        border-radius: @my-radius;
        color: #fff;
    }
    & > .x-2 {
    }
}
</style>

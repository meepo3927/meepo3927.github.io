<template>
<div class="page-log-realtime">
    <h1>实时日志</h1>
    <div class="log-wrapper" ref="wrapper">
        <ul>
            <li v-for="v in list" v-html="v"></li>
        </ul>
    </div>
    <div class="op-box">
        <label>
            <input type="checkbox" v-model="isAutoScroll" /> 自动滚动
        </label>
        <button class="btn" @click="clearAll">清除日志</button>
    </div>
</div>
</template>

<script>
require('root');
const tool = require('util/tool.js');
const config = require('global/config.js');
const MAX_COUNT = 30000;
const CUT_NUM = 5000;
let methods = {};
methods.autoScroll = function () {
    let $w = this.$refs.wrapper;
    $w.scrollTop = $w.scrollHeight;
};
methods.cut = function () {
    this.list = this.list.slice(-CUT_NUM);
};
methods.clearAll = function () {
    this.list = [];
};
methods.line = function (item) {
    // host, timestamp, level, logger, message
    let levelClass = 'level-' + item.level;
    let str = [
        item.host,
        '<span class="style-datetime">' + item['@timestamp'] + '</span>',
        '<span>' + item.thread + '</span>',
        '<span class="' + levelClass + '">' + item.level + '</span>',
        '<span class="style-logger">' + item.logger + '</span>',
        '<span class="style-message">' + item.message + '</span>'
    ].join(' ');
    this.list.push(str);
};
methods.renderArray = function (list) {
    list.forEach((line) => {
        this.line(line);
    });
    LOG('Push日志：' + list.length + '条');
};
methods.onMessage = function (e) {
    // LOG(e);
    let str = e.data;
    try {
        var j = JSON.parse(str);
    } catch(e) {
        return mlayer.msg('JSON解析失败');
    }
    
    if (!j) {
        return mlayer.msg('JSON解析失败');
    }
    if (Array.isArray(j)) {
        this.renderArray(j);
    }
    if (this.list.length > MAX_COUNT) {
        this.cut();
    }
    if (this.isAutoScroll) {
        this.$nextTick(() => {
            setTimeout(this.autoScroll, 100);
        });
    }
};
methods.connect = function () {
    if (!window.WebSocket) {
        return mlayer.msg('您的浏览器不支持WebSocket', {
            time: 99999 * 10000
        });
    }
    let url = 'ws://' + location.host + config.basePath + '/log';
    if (config.dev) {
        url = 'ws://localhost:8080/TD-nmtravel-web/log';
    }
    var ws = new WebSocket(url);
    ws.onopen = () => {
        LOG('onopen');
    };
    ws.onmessage = this.onMessage;
    ws.onerror = (e) => {
        LOG('onError:', e);
        mlayer.msg('连接服务器失败');
    };
    ws.onclose = (e) => {
        LOG('onClose');
        this.ws = null;
    };
    this.ws = ws;
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
    this.connect();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: [],
        isAutoScroll: true
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
@pad:  20px;
.page-log-realtime {
    padding-top: 5px;
}
h1 {
    margin: 10px @pad 20px;
}
.log-wrapper {
    margin-left: @pad;
    margin-right: @pad;
    border: 1px solid #eee;
    height: calc(~'100vh - 140px');
    overflow: auto;
    padding: 15px;
    background-color: #F4F4F4;
    ul > li {
        line-height: 1.4;
        font-family: monospace;
        font-size: 14px;
        word-wrap: break-word;
        word-break: break-all;
    }
}
.op-box {
    margin: @pad;
    label {
        cursor: pointer;
    }
    button {
        height: 28px;
        width: 80px;
        margin-left: 80px;
    }
}
</style>

<style lang="less">
.log-wrapper > ul > li {
    .level-INFO {
        color: #42E718;
    }
    .level-WARN {
        color: #E8E800;
        font-weight: bold;
    }
    .level-ERROR {
        color: #F00000;
        font-weight: bold;
    }
    .level-DEBUG {}
    .style-datetime {
        color: #FFA64D;
    }
    .style-message {
        color: #645BFF;
    }
    .style-logger {
        color: #FF75FF;
    }
}
</style>
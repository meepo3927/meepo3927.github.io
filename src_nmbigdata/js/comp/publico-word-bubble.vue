<template>
<div class="word-bubble">
    <div class="word" v-for="(v, i) in queue"
        :key="v"
        :class="v.className"
        :style="v.style">
        <div v-text="v.text"></div>
    </div>
</div>
</template>

<script>
import tool from 'util/tool.js';
const shuffle = (arr) => {
    let len = arr.length;
    if (len <= 1) {
        return arr;
    }
    for (let i = 0; i < len; i++) {
        let r = Math.round(Math.random() * len);
        if (r >= len) {
            r = len - 1;
        }
        if (!arr[i] || !arr[r]) {
            continue;
        }
        let temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
};
let methods = {};
methods.delayFetch = function () {
    setTimeout(() => {
        this.fetching = false;
        this.fetch();
    }, 10 * 1000);
};
methods.fetch = function () {
    if (this.fetching) {
        return;
    }
    this.fetching = true;
    this.vRequest.publicoWordBubble().then((arr) => {
        if (arr && arr.length) {
            this.cache = JSON.parse(JSON.stringify(arr));
            this.fetching = false;
            this.list = this.list.concat(shuffle(arr));
            this.startTick();
        } else {
            this.delayFetch();
        }
    }).catch(() => {
        this.delayFetch();
    });
};
methods.add = function (item) {
    // totalTimes
    let text = item.searchWords || item.content;
    let left = tool.getRandInt(0, 80);
    // let size = tool.getRandInt(70, 120);
    let size = 6 * tool.strlen(text) + 20;
    size = Math.max(54, size);
    size = Math.min(130, size);
    if (size > 100 && left > 60) {
        left -= 42;
    }
    let style = {
        'left': left + '%',
        'width': size + 'px',
        'height': size + 'px'
        // 'line-height': size + 'px'
    };
    if (this.i > 13) {
        this.i = 1;
    }
    let className = [
        'color-' + this.i
    ];
    let o = {
        style,
        className,
        text: text
    };
    this.queue.push(o);
    setTimeout(() => {
        this.remove(o);
    }, 8000);
    this.i++;
};
methods.remove = function (o) {
    let q = this.queue;
    for (let i = q.length - 1; i >= 0; i--) {
        if (q[i] === o) {
            q.splice(i, 1);
        }
    }
};
methods.startTick = function () {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
    }
    this.tick();
};
methods.tick = function () {
    let list = this.list;
    if (list.length) {
        this.add(list.pop());
        let time = tool.getRandInt(300, 1000);
        this.timer = setTimeout(this.tick, time);
    }

    // 该补充数据了
    if (list.length <= 2) {
        if (this.cache) {
            this.list = this.list.concat(this.cache);
        } else {
            this.loopFetch();
        }
    }
};
methods.loopFetch = function () {
    if (this.looplock) {
        return;
    }
    this.fetch();
    this.looplock = true;
    setTimeout(() => {
        this.looplock = false;
    }, 3000);
};
let computed = {};
let watch = {};

const created = function () {};
const mounted = function () {
    window.WordBubble = this;
    this.fetch();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        i: 1,
        fetching: false,
        list: [],
        queue: []
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
    mixins: [
        // require('mixins/request_mix.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@keyframes bubble {
    0% {
        opacity: 0;
    }
    30% {}
    50% {
        opacity: 1;
    }
    70% {}
    100% {
        opacity: 0;
        transform: translateY(-520px);
    }
}
@color-1: #d5344c;
@color-2: #e5582d;
@color-3: #f4b320;
@color-4: #c0cc35;
@color-5: #49a146;
@color-6: #068b7d;
@color-7: #01609b;
@color-8: #01609b;
@color-9: #863888;
@color-10: #b33172;
@color-11: #88b643;
@color-12: #1e2972;
@color-13: #c59f06;

@anim-duration:  4s;
.word-bubble {
    position: relative;
    height: 100%;
    overflow: hidden;
}

.word {
    // width: 80px;
    // height: 80px;
    color: #fff;
    border-radius: 50%;
    background-color: red;
    text-align: center;
    font-size: 16px;
    word-wrap: break-word;
    word-break: break-all;
    padding-left: 10px;
    padding-right: 10px;
    position: absolute;
    bottom: -50px;

    animation: bubble @anim-duration ease 0s;
    animation-fill-mode: both;

    display: table;
    & > div {
        height: 100%;
        width: 100%;
        display: table-cell;
        vertical-align: middle;
        margin-left: auto;
        margin-right: auto;
    }
}
.word.color-1 {background-color: @color-1;}
.word.color-2 {background-color: @color-2;}
.word.color-3 {background-color: @color-3;}
.word.color-4 {background-color: @color-4;}
.word.color-5 {background-color: @color-5;}
.word.color-6 {background-color: @color-6;}
.word.color-7 {background-color: @color-7;}
.word.color-8 {background-color: @color-8;}
.word.color-9 {background-color: @color-9;}
.word.color-10 {background-color: @color-10;}
.word.color-11 {background-color: @color-11;}
.word.color-12 {background-color: @color-12;}
.word.color-13 {background-color: @color-13;}
</style>

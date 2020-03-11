<template>
<ul class="scroll-msg" :class="{clickable: isClickable}"
    @mouseover="onMouseOver" @mouseout="onMouseOut">
    <li v-for="v in list" v-text="v.noticeTitle" 
        @click="onClick(v)"></li>
    <li v-if="fakeItem" v-text="fakeItem.noticeTitle"
        @click="onClick(fakeItem)"></li>
</ul>
</template>

<script>
const H = 20;
const INTERVAL_FRAME = 20;
const INTERVAL_LOOP = 3 * 1000;
let methods = {};
methods.onClick = function (item) {
    this.$emit('itemclick', item);
};
methods.onMouseOver = function () {
    this.paused = true;
};
methods.onMouseOut = function () {
    this.paused = false;
};
methods.init = function () {
    this.stop();
    this.timer = setTimeout(this.run, INTERVAL_LOOP);
};
methods.initIfReady = function () {
    if (this.dataReady) {
        this.init();
    }
};
methods.stop = function () {
    clearTimeout(this.timer);
    this.timer = 0;
};
methods.run = function () {
    let t1 = this.$el.scrollTop;
    if ((t1 % H === 0) && this.paused) { // 暂停
        return this.init();
    }
    let t2 = t1 + 1;
    if (t2 >= this.maxY) {
        t2 = 0;
    }
    if (t2 % H  === 0) {
        this.$el.scrollTop = t2;
        this.timer = setTimeout(this.run, INTERVAL_LOOP);
    } else {
        this.$el.scrollTop = t2;
        this.timer = setTimeout(this.run, INTERVAL_FRAME);
    }
};
let computed = {};
computed.maxY = function () {
    if (!this.list) {
        return 0;
    }
    return (this.list.length) * H;
};
computed.dataReady = function () {
    return (this.list && this.list.length);
};
computed.fakeItem = function () {
    if (this.list && this.list[0]) {
        return this.list[0];
    }
};
computed.isClickable = function () {
    return !!(this.clickable);
};
let watch = {};
watch.list = function () {
    if (this.dataReady) {
        this.init();
    } else {
        this.stop();
    }
};
const created = function () {
};
const mounted = function () {
    // window.ScrollMsg = this;
    this.$nextTick(this.initIfReady);
};
const beforeDestroy = function () {
    this.stop();
};
const dataFunc = function () {
    let o = {};
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['list', 'clickable'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
ul {
    overflow: hidden;
    height: 20px;
    line-height: 20px;
    &.clickable li:hover {
        color: #5FAEE3;
        cursor: pointer;
    }
    li {
        color: inherit;
        font-size: 13px;
        text-shadow: 0 1px 2px #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>

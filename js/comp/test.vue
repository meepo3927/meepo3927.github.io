<template>
<div class="comp-test">
    <p class="my-title" :class="{active: active}">Test Component</p>
    <ul>
        <li v-for="n in list">
            <a href="javascript:;" v-text="n" @click="remove(n)"></a>
        </li>
    </ul>
    <div class="content-wrapper">
        <transition 
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            v-bind:css="false">
            <div v-if="index === 1" key="c1" class="content">content - 1</div>
            <div v-else-if="index === 2" key="c2" class="content">content - 22222222</div>
            <div v-else key="c3" class="content">content - 3333333333333333333</div>
        </transition>
    </div>
    <button @click="alert" class="btn">Button</button>
</div>
</template>

<script>
import 'velocity';
let methods = {};
methods.beforeEnter = function (el) {
    $(el).css({
        opacity: 0,
        marginLeft: '300px'
    });
};
methods.enter = function (el, done) {
    $(el).velocity({
        opacity: 1,
        marginLeft: 0
    }, 500, done);
};
methods.leave = function (el, done) {
    $(el).velocity({
        opacity: 0,
        marginLeft: '-300px'
    }, 500, done);
};
methods.alert = function () {
    this.active = !this.active;
    if (this.index + 1 > 3) {
        this.index = 1;
    } else {
        this.index++;
    }
};
methods.remove = function (n) {
    var pos = this.list.indexOf(n);
    if (~pos) {
        this.list.splice(pos, 1);
    }
};
export default {
    name: 'vtest',
    methods,
    data: () => {
        let list = [];
        for (let i = 0; i < 10; i++) {
            list.push(i);
        }
        return {
            active: false,
            list: list,
            index: 1
        }
    }
};
</script>

<style scoped lang="less">
.comp-test {
    & > p {
        width: 200px;
        transition: transform 3s;
        color: red;
        &.active {
            transform: translate(100px, 200px);
        }
    }
    .content-wrapper {
        position: relative;
        height: 100px;
    }
    .content {
        position: absolute;
        top: 0;
    }
}
</style>
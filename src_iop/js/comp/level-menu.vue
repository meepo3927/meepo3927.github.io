<template>
<ul class="level-menu" v-if="dataReady" ref="ul"
    :class="rootClass" 
    :style="[myPosition]">
    <li v-for="(item, index) in list">
        <!-- 子菜单 -->
        <level-menu v-if="hasChildren(item)" v-show="isChildrenVisible(item)"
            :list="item.children" 
            :level="childlv"
            @enter="onChildrenEnter"
            @item-click="onSubItemClick" />
        <!-- 菜单项 -->
        <a :href="getHref(item)" @click="onItemClick(item)"
            @mouseenter="onMouseEnter(item)"
            @mouseleave="onMouseLeave(item)">
            <i class="fa icon-1" :class="getICONClass(item, index)"></i>
            <span v-text="getMenuName(item)"></span>
            <i class="fa fa-angle-right" v-if="hasChildren(item)"></i>
        </a>
    </li>
</ul>
</template>

<script>
import store from 'store/shell.js';
const DELAY_TIME = 700;
const ICONS = ['fa-desktop', 'fa-cog', 'fa-camera', 'fa-dot-circle-o'];

const methods = {};
methods.getHref = function (item) {
    if (item.children && item.children.length) {
        return 'javascript:;';
    }
    if (!item.moduleUrl || (item.moduleUrl === 'about:blank')) {
        return undefined;
    }
    return 'javascript:;';
};
methods.onItemClick = function (item) {
    if (item.children && item.children.length) {
        // do nothing
        return false;
    } else {
        this.$emit('item-click', item);
    }
};
// 子菜单的click，向上传递
methods.onSubItemClick = function (item) {
    this.$emit('item-click', item);
};
methods.getMenuName = function (item) {
    return (item.folderName || '').split('|')[0];
};
methods.getICONClass = function (item, index) {
    return item.icon || ICONS[index] || 'fa-cube';
};
methods.cleanTimer = function () {
    if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = 0;
    }
};
methods.delayHide = function () {
    this.delayTimer = setTimeout(() => {
        this.showChildren(null);
    }, DELAY_TIME);
};
methods.onRootMouseEnter = function () {
};
methods.onRootMouseLeave = function () {
};
methods.onMouseEnter = function (item) {
    this.cleanTimer();
    if (this.hasChildren(item)) {
        this.currentActive = item;
    } else {
        this.currentActive = null;
    }
};
methods.onMouseLeave = function (item) {
};
methods.showChildren = function (item) {
    this.currentActive = item;
};
methods.isChildrenVisible = function (item) {
    return (this.currentActive === item);
};
methods.hasChildren = function (item) {
    return (item.children && item.children.length);
};
methods.onChildrenEnter = function () {
    this.cleanTimer();
};
methods.documentHandler = function (e) {
    const T = e.target;
    // Click On anchor
    if (this.anchor && this.anchor.contains(T)) {
        return false;
    }
    // Click Inside
    if (this.$refs.ul.contains(T)) {
        return false;
    }
    // Click Out Side
    this.$emit('dispose');
};
const computed = {};
computed.isRoot = function () {
    return (this.level === 1);
};
computed.dataReady = function () {
    return Array.isArray(this.list) && (this.list.length > 0);
};
computed.childlv = function () {
    return (this.level + 1);
};
computed.rootClass = function () {
    return [
        'level-' + this.level,
        (this.level > 1) ? 'level-sub' : ''
    ]
};
computed.myPosition = function () {
    if (this.anchor && (this.level === 1)) {
        const position = {};
        const rect = this.anchor.getBoundingClientRect();
        position.top = (rect.top) + 'px';
        position.left = (rect.width + rect.left) + 'px';
        return position;
    }
};
const created = function () {};
const mounted = function () {
    if (this.isRoot) {
        store.commit('setMenuVisible', true);
        document.addEventListener('click', this.documentHandler);
    }
};
const beforeDestroy = function () {
    if (this.isRoot) {
        store.commit('setMenuVisible', false);
        document.removeEventListener('click', this.documentHandler);
    }
};
const dataFunc = function () {
    let o = {
        anchor: null,
        currentActive: null
    };
    return o;
};
export default {
    name: 'level-menu',
    data: dataFunc,
    created,
    methods,
    computed,
    props: {
        list: {
            type: Array,
            required: true
        },
        level: {
            type: Number,
            default: 1
        }
    },
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref.less";

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
@keyframes fade-in-enter {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
.level-menu {
    width: 260px;
    background-color: @side-menu-back-color;
    &.level-1 {
        position: fixed;
        animation: fade-in .3s ease;
    }
    &.level-sub {
        position: absolute;
        left: 100%;
        border: 1px solid lighten(@side-menu-back-color, 10%);
        animation: fade-in-enter .3s ease;
    }
}
li > a {
    display: block;
    padding: 12px 10px;
    color: #EEE;
    i {
        font-size: 16px;
    }
    i.icon-1 {
        width: 18px;
        text-align: center;
        margin-right: 18px;
    }
    span {
        display: inline-block;
        width: 75%;
    }
}
li > a:hover {
    color: @side-menu-text-hover-color;
    i, span {
        color: inherit;
    }
}
</style>

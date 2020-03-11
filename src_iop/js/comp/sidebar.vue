<template>
<div class="sidebar" :class="rootClass">
    <!-- 头图 -->
    <div class="head-img">
        <img :src="headImgSrc" v-show="isModeNormal" title="回到首页"
            @click="onHeadImgClick"/>
    </div>
    <!-- 切换按钮 -->
    <a href="javascript:;" class="toggle-btn" @click="toggleMode">
        <i class="fa fa-bars"></i>
    </a>
    <!-- 菜单 -->
    <div class="menu-section">
        <ul v-if="list" class="menu-ul">
            <li v-for="v in list" class="menu-li" :class="{active: v === activeItem}">
                <a href="javascript:;" @click="onItemClick(v, $event)" 
                    :title="getMenuName(v)">
                    <i class="fa menuicon" :class="[v.icon]" ></i>
                    <div class="menu-name" v-text="getMenuName(v)"></div>
                    <i class="fa fa-angle-right" v-if="hasChildren(v)"></i>
                </a>
            </li>
        </ul>
        <p v-if="list === null" class="data-empty">菜单加载失败</p>
    </div>
</div>
</template>

<script>
import store from 'store/shell.js';
import mlayer from 'mlayer';
import levelMenu from 'comp/level-menu.vue';
import URL from 'util/url.js';
const openUrl = URL.query().openurl;
const methods = {};
methods.getAutoICONClass = function () {
    const ICONS = [
        'fa-desktop',
        'fa-cog',
        'fa-camera',
        'fa-dot-circle-o'
    ];
    return ICONS[this.iconIndex++] || 'fa-cube';
};
methods.onHeadImgClick = function () {
    this.$emit('jump', Vue.getEntryUrl());
};
methods.initOpenUrl = function () {
    this.$emit('jump', openUrl);
};
methods.initOpenHome = function () {
    this.$emit('jump', Vue.getEntryUrl());
};
methods.initClick = function () {
    for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i];
        if (item.folderName === '首页' || item.folderName === '看板中心') {
            return this.onItemMockClick(item);
        }
    }
    for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i];
        if (!item.children || !item.children.length) {
            return this.onItemMockClick(item);
        }
    }
    this.$emit('jump', Vue.getEntryUrl());
};
methods.onItemClick = function (item, event) {
    // 重复点击
    if (this.clickItem === item) {
        if (this.menuInstance) {
            return this.disposeMenu();
        }
    }
    this.clickItem = item;
    // 子菜单
    if (item.children && item.children.length) {
        // 先销毁
        this.disposeMenu();
        this.menuInstance = Vue.$newComponent(levelMenu, {
            list: item.children,
            anchor: event.currentTarget || event.target
        });
        this.menuInstance.$on('dispose', this.disposeMenu);
        this.menuInstance.$on('item-click', this.onMenuItemClick);
    } else {
        this.activeItem = item;
        this.requestPath(item);
    }
};
methods.hasChildren = function (item) {
    return (item.children && item.children.length);
};
methods.onItemMockClick = function (item) {
    this.activeItem = item;
    this.requestPath(item);
};
// 子菜单点击
methods.onMenuItemClick = function (item) {
    this.activeItem = this.clickItem;
    this.disposeMenu();
    this.requestPath(item);
    this.clickItem = null;
};
// 根据url渲染高亮
methods.setUrl = function (url) {
    // 获取匹配的item
    // 需要getMenu接口改造返回moduleUrl
    if (url === this.lastModuleUrl) {
        return;
    }
    this.clickItem = null;
    this.activeItem = null;
};
methods.disposeMenu = function () {
    if (this.menuInstance) {
        Vue.$disposeComponent(this.menuInstance);
        this.menuInstance = null;
    }
};
methods.requestPath = function (item) {
    if (item.moduleUrl === 'about:blank') {
        return mlayer.msg('仅供演示');
    }
    if (item.moduleUrl) {
        //跳转
        this.$emit('jump', item.moduleUrl);
        this.lastModuleUrl = item.moduleUrl;
    }
};
methods.toggleMode = function () {
    store.commit('toggleMode');
};
methods.getMenuName = function (item) {
    return (item.folderName || '').split('|')[0];
};
const computed = {};
computed.mode = function () {
    return store.state.sideMode;
};
computed.isModeNormal = function () {
    return store.getters.isSideModeNormal;
};
computed.isModeMini = function () {
    return store.getters.isSideModeMini;
};
computed.headImgSrc = function () {
    return this.vImgPath + '/global/iop.png';
    // return this.vImgPath + '/global/iop_logo.png';
};
const created = function () {};
computed.rootClass = function () {
    return [
        'mode-' + this.mode
    ]
};
const mounted = function () {
    if (openUrl) {
        setTimeout(this.initOpenUrl, 150);
    } else {
        setTimeout(this.initOpenHome, 50);
    }
    Request.getMenuOnce().then((data) => {
        this.list = data.length ? data.map(v => {
            if (!v.icon) {
                v.icon = this.getAutoICONClass();
            }
            return v;
        }) : null;
        if (!openUrl) {
            // this.initClick();
        }
    }).catch((e) => {
        this.list = null;
    });
};
const beforeDestroy = function () {
};
const dataFunc = function () {
    let o = {
        iconIndex: 0,
        list: undefined,
        clickItem: null,
        activeItem: null,
        lastModuleUrl: undefined
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
@toggle-btn-width:  28px;
@toggle-btn-height: 36px;
@normal-icon-width: 28px;
@normal-pad-left:   6px;
@normal-pad-top:    10px;
@normal-menu-name-width:  @side-width-normal
    - @normal-icon-width
    - @normal-pad-left
    - 36px;
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    padding-top: @top-bar-height;
    z-index: 1;
}
/**
 *********************** 正常模式
 */
.sidebar.mode-normal {
    width: @side-width-normal;
    .toggle-btn {
        right: -(@toggle-btn-width) / 2;
    }
    .menu-li > a {
        line-height: 24px;
        padding-top: @normal-pad-top;
        padding-bottom: @normal-pad-top;
        padding-left: @normal-pad-left;
        & > .menuicon {
            width: @normal-icon-width;
            text-align: center;
            vertical-align: middle;
        }
        & > .fa-angle-right {
            font-size: 20px;
            vertical-align: middle;
        }
        & > .menu-name {
            font-size: 15px;
            margin-left: 4px;
            width: @normal-menu-name-width;
            display: inline-block;
            white-space: nowrap;
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    
}
/**
 *********************** 缩小模式
 */
.sidebar.mode-mini {
    width: @side-width-mini;
    .toggle-btn {
        right: (@side-width-mini - @toggle-btn-width) / 2;
    }
    .menu-ul {
    }
    .menu-li {
        margin-bottom: 8px;
    }
    .menu-li > a {
        text-align: center;
        height: @side-width-mini;
        padding-top: 13px;
        & > i.menuicon {
        }
        & > .fa-angle-right {
            display: none;
        }
        & > .menu-name {
            display: none;
        }
    }
}
.data-empty {
    color: #fff;
    text-align: center;
    padding: 10px 0;
}
.toggle-btn {
    background: url("../../images/sidemenu/side_toggle_btn.png") no-repeat 0 0;
    background-size: contain;
    display: inline-block;
    text-align: center;
    width: @toggle-btn-width;
    height: @toggle-btn-height;
    position: absolute;
    top: (@top-bar-height - @toggle-btn-height) / 2 + 2px;
    i {
        color: #fff;
        font-size: 18px;
        margin-top: 7px;
    }
}
.head-img {
    position: absolute;
    top: 0;
    width: 100%;
    height: @top-bar-height;
    background-color: @side-head-back-color;
    text-align: center;
    padding-top: (@top-bar-height / 2) - 14px;
    border-bottom: 1px solid darken(@side-head-back-color, 10%);
    img {
        cursor: pointer;
    }
}
.menu-section {
    height: 100%;
    background-color: @side-menu-back-color;
}
.menu-li > a {
    display: block;
    color: @side-menu-text-color;
    border-left: 2px solid transparent;
    &:hover {
        color: @side-menu-text-hover-color;
    }
    & > .menuicon {
        font-size: 20px;
    }
}
.menu-li.active > a {
    color: @side-menu-text-active-color;
    background-color: @side-active-back-color;
    border-color: @side-menu-text-active-color;
    box-shadow: -2px 0 3px @side-menu-back-color;
}

</style>

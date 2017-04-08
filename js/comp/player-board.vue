<template>
<div class="player-board m-row" :class="{on: on}">
    <!-- 头像 -->
    <div class="avatar-box">
        <div class="level">LV.1</div>
        <img src="images/class/warrior.jpg" alt="">
        <div class="exp-bar" :style="{width: expBarWidth}">
        </div>
    </div>
    <!-- 状态 -->
    <div class="status-box">
        <div class="x-1 m-row ">
            <div class="col-1 hp">生命：{{hp}} / {{maxHp}}</div>
            
        </div>
        <div class="x-2 m-row ">
            <div class="col-1 mana">魔法：10</div>
            <div class="col-2 gold">金币：{{gold}}</div>
        </div>
    </div>
</div>
</template>

<script>
var methods = {};
var computed = {};
computed.on = function () {
    return this.status ? this.status.on : false;
};
computed.myData = function () {
    return this.data || {};
};
computed.hp = function () {
    return this.myData.hp || 0;
};
computed.maxHp = function () {
    return this.myData.maxHp || 0;
};
computed.gold = function () {
    return this.myData.gold || 0;
};
computed.expBarWidth = function () {
    return this.myData.exp + '%';
};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
    var o = {};
    return o;
};
export default {
    data: dataFunc,
    methods,
    computed,
    props: ['data', 'status'],
    mounted,
    destroyed,
    components: {}
};
</script>

<style scoped lang="less">
// 当前回合
.player-board.on {
    .avatar-box img {
        border-color: #fff;
    }
}
.avatar-box {
    position: relative;
    line-height: 0;
    font-size: 0;
    img {
        border: 1px solid #333;
        width: 44px;
        height: 44px;
        display: block;
    }
    .exp-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        width: 0;
        background-color: #66FF33;
        transition: width .3s ease;
    }
}
.level {
    position: absolute;
    left: 3px;
    top: 3px;
    font-size: 12px;
}
</style>
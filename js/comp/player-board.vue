<template>
<div class="player-board m-row">
    <!-- 头像 -->
    <div class="avatar-box">
        <div class="level">LV.1</div>
        <img src="images/class/warrior.jpg" alt="">
    </div>
    <!-- 状态 -->
    <div class="status-box">
        <div class="x-1 m-row ">
            <div class="col-1 hp">生命：100</div>
            <div class="col-2 gold">金币：0</div>
        </div>
        <div class="x-2 m-row ">
            <div class="col-1 mana">魔法：10</div>
            <div class="col-2 exp">经验：0%</div>
        </div>
    </div>
</div>
</template>

<script>
var methods = {};
var computed = {};
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
    props: [],
    mounted,
    destroyed,
    components: {}
};
</script>

<style scoped lang="less">
.player-board {
}
.avatar-box {
    position: relative;
    line-height: 0;
    font-size: 0;
    img {
        border: 1px solid #eee;
        width: 44px;
        height: 44px;
        display: block;
    }
}
.level {
    position: absolute;
    left: 3px;
    top: 3px;
    font-size: 12px;
}
</style>
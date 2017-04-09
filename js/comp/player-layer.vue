<template>
<div class="player-layer center-layer">
    <table class="table">
        <thead>
            <tr>
                <th class="col-1 tal">P{{id}}属性</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="col-1">职业：</td>
                <td class="col-2" v-text="my.className" 
                    :class="[classNameColor]"></td>
            </tr>

            <tr class="color-level">
                <td class="col-1">等级：</td>
                <td class="col-2" v-text="my.level"></td>
            </tr>

            <tr class="color-exp">
                <td class="col-1">经验：</td>
                <td class="col-2">{{my.exp}}%</td>
            </tr>

            <tr class="color-hp">
                <td class="col-1">生命：</td>
                <td class="col-2" v-text="hptext"></td>
            </tr>
            <tr class="color-gold">
                <td class="col-1">金币：</td>
                <td class="col-2" v-text="my.gold"></td>
            </tr>
            <tr class="color-mana">
                <td class="col-1">魔法：</td>
                <td class="col-2" v-text="my.mana"></td>
            </tr>

        </tbody>
    </table>
</div>
</template>

<script>
var methods = {};
var computed = {};
computed.my = function () {
    return this.data || {};
};
computed.hptext = function () {
    return this.my.hp + ' / ' + this.my.maxHp;
};
computed.classNameColor = function () {
    return `color-${this.my.classId}`;
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
    props: ['data', 'id'],
    mounted,
    destroyed,
    components: {}
};
</script>

<style scoped lang="less">
.player-layer {
    background-color: #000;
    color: #fff;
    width: 82%;
    height: 84%;
    box-shadow: 0 0 5px #eee;
    border-radius: 10px;

    padding: 10px;
}
.player-layer table {
    font-size: 18px;
    th {}
    td {}
    td.col-1 {
        width: 120px;
    }
    .col-2 {}
}
</style>
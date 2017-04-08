<template>
<div class="stage-2">
	<div class="head clearfix">
		<player-board class="board" :data="p1data" :status="p1Status"/>
		<player-board class="board" :data="p2data" :status="p2Status"/>
	</div>
	<vue-canvas @collect="collect" @after-collect="afterCollect" />
</div>
</template>

<script>
import Player from 'comp/player.js';
import Msg from 'comp/msg.js';

var docElem = document.documentElement;
var methods = {};
// 收集
methods.collect = function (list) {
	this.getCurPlayer().collect(list);
};
// 收集结束
methods.afterCollect = function () {
	this.turnPlayer();
};
// 当前玩家
methods.getCurPlayer = function () {
	return this['p' + this.curPlayer];
};
// 切换玩家
methods.turnPlayer = function () {
	this.curPlayer = 3 - this.curPlayer;
};
var computed = {};
computed.p1Status = function () {
	return {
		on: (this.curPlayer === 1)
	};
};
computed.p2Status = function () {
	return {
		on: (this.curPlayer === 2)
	};
};
var mounted = function () {
	this.curPlayer = 1;
	setTimeout(() => {
		Msg.pop('游戏开始，玩家1行动', {
			position: 'left bottom'
		});
	}, 800);
};
let destroyed = function () {
};
let dataFunc = function () {
	this.p1 = new Player({
		id: 1
	});
	this.p2 = new Player({
		id: 2,
		enemy: this.p1
	});
	this.p1.setOption({
		enemy: this.p2
	});

	var o = {
		curPlayer: 0,
		p1data: this.p1.data,
		p2data: this.p2.data
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	destroyed,
	components: {
		'vue-canvas': require('comp/canvas.vue'),
		'player-board': require('comp/player-board.vue')
	}
};
</script>

<style scoped lang="less">
.board {
	width: 50%;
	float: left;
}
</style>
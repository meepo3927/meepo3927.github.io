<template>
<div class="stage-2">
	<div class="head clearfix">
		<player-board class="board" />
		<player-board class="board" />
	</div>
	<vue-canvas />
</div>
</template>

<script>
var docElem = document.documentElement;
var methods = {};
var computed = {};
var mounted = function () {

};
let destroyed = function () {
};
let dataFunc = function () {
	var o = {
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
<template>
<div class="stage-2">
	<div class="head"></div>
	<vue-canvas />
</div>
</template>

<script>
window.li = function (url) {
    var img = new Image();
    var t1 = Date.now();
    img.onload = function () {
        LOG('onload', Date.now() - t1);
    };
    img.onerror = function () {
        LOG('onerror', Date.now() - t1);
    };
    img.onabort = function () {
        LOG('onabort');
    };
    img.src = url;
};
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
		'vue-canvas': require('comp/canvas.vue')
	}
};
</script>

<style scoped lang="less">
</style>
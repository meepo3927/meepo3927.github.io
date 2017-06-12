<template>
<div class="page-layout">
	<div class="layout-left">
		<slot name="left"></slot>
	</div>
	<div class="layout-main">
		<slot></slot>

		<div class="x-footer-block"></div>
		<div class="x-footer">
			<div class="pull-right">中国移动内蒙古分公司</div>
			<div class="copyright">
				<strong>Copyright</strong> Teradata &copy; 2007-2016
			</div>
		</div>
	</div>

</div>
</template>

<script>
var methods = {};
var computed = {};
var watch = {};
var mounted = function () {};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.page-layout {
	
}
.x-footer-block {
	height: 40px;
}
</style>
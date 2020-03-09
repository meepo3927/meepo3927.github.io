<template>
<form @submit.prevent class="table-search-form">
	<input type="text" class="input-text" placeholder="搜索" 
		v-model="keyword"
		@input="search" />
	<button type="button" @click="search">
		<i class="fa fa-search"></i>
	</button>
</form>
</template>

<script>
var methods = {};
methods.search = function () {
	this.$emit('search', this.keyword);
};
var computed = {};
var watch = {};
var mounted = function () {};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		keyword: ''
	};
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
.comp-xxx {
	
}
input[type=text] {
	vertical-align: top;
}
</style>
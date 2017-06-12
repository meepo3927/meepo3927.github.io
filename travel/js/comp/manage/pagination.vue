<template>
<ul class="pagination clearfix">

	<li :class="{disabled: curPage === 1}">
		<a href="javascript:;" @click="onClick(1)">首页</a>
	</li>
	<li :class="{disabled: curPage === 1}">
		<a href="javascript:;" @click="prev">前一页</a>
	</li>

	<li v-for="v in list" :class="{active: v === curPage}">
		<span v-if="v === curPage" v-text="v"></span>
		<a href="javascript:;" v-if="v !== curPage" v-text="v" @click="onClick(v)"></a>
	</li>

	<li :class="{disabled: curPage >= totalPage}">
		<a href="javascript:;" @click="next">后一页</a>
	</li>

	<li :class="{disabled: curPage >= totalPage}">
		<a href="javascript:;" @click="onClick(totalPage)">尾页</a>
	</li>

</ul>
</template>

<script>
var methods = {};
methods.prev = function () {
	var p = this.curPage - 1;
	if (p >= 1) {
		this.$emit('click', p);
	}
};
methods.next = function () {
	var p = this.curPage + 1;
	if (p <= this.totalPage && p >= 1) {
		this.$emit('click', p);
	}
};
methods.onClick = function (p) {
	if (p >= 1) {
		this.$emit('click', p);
	}
};
var computed = {};
computed.list = function () {
	var arr = [];
	var cur = this.curPage;
	for (var i = this.curPage - 3; i <= this.curPage + 3; i++) {
		if (i < 1 || i > this.totalPage) {
			continue;
		}
		arr.push(i);
	}
	return arr;
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
	props: ['curPage', 'totalPage'],
	mounted,
	destroyed,
	components: {}
};
</script>

<style scoped lang="less">
.pagination {
	
}
ul {
	margin-top: 8px;
	
}
ul > li {
}
ul > li:last-child > a,
ul > li:last-child > span {
	border-bottom-right-radius: 4px;
	border-top-right-radius: 4px;
}
ul > li > a,
ul > li > span {
	font-size: 13px;
	background-color: #ffffff;
	border: 1px solid #dddddd;
	color: #666;
	float: left;
	line-height: 1.42857;
	margin-left: -1px;
	padding: 4px 10px;
	position: relative;
	text-decoration: none;
}
ul > li > a {}
ul > li > span {}

ul > li > a.active,
ul > li > a:hover {
	background-color: #eee;
	border-color: #ddd;
	color: #23527c;
}

ul > li.active > span {
	background-color: #f4f4f4;
	border-color: #dddddd;
}
</style>
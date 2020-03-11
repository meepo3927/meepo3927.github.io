/**
 * Table Footer: 总条数，分页
 * @Vue
 * @date  2017.02.27
 */

define(['vue'], function (Vue) {
	var paging = `
		<ul class="pagination" v-show="totalPage >= 1">
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
		</ul>
	`.trim();
	var template = `<div class="comp-table-footer">
		<div class="x-paging">
			${paging}
		</div>

		<div class="x-info">
			当前显示<span v-text="start"></span>到<span v-text="end"></span>条，共<span v-text="totalCount"></span>条记录
		</div>
	</div>`;
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
	var computed = {
		start: function () {
			return this.option ? (this.option.start || 0) : 0;
		},
		end: function () {
			return this.option ? (this.option.end || 0) : 0;
		},
		totalCount: function () {
			return this.option ? (this.option.totalCount || 0) : 0;
		},
		curPage: function () {
			return this.option ? (this.option.curPage || 0) : 0;
		},
		totalPage: function () {
			return this.option ? (this.option.totalPage || 0) : 0;
		},
		list: function () {
			var arr = [];
			var cur = this.curPage;
			for (var i = this.curPage - 2; i <= this.curPage + 2; i++) {
				if (i < 1 || i > this.totalPage) {
					continue;
				}
				arr.push(i);
			}
			return arr;
		}
	};
	var onReady = function () {
	};
	var data = function () {
		return {};
	};
	return Vue.component('table-footer', {
		template: template,
		methods: methods,
		computed: computed,
		data: data,
		props: ['option'],
		mounted: onReady
	});
});
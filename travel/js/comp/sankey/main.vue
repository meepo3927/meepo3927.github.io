<template>
<div class="v-main p10">
	<h1>景区路径分析</h1>
	<!-- 检索条件 -->
	<div class="condition-box mt20 mb10 m-row col-mid">
		<!-- 选择景区 -->
		<div class="m-col col-scenery-select">
			<label for="">选择景区：</label>
			<vue-chosen :options="attractions" class="scenery-select" 
				v-model="fetchParam.scenery_name" />
		</div>
		<div class="m-col col-date">
			<label>选择日期：</label>
			<datepicker v-model="startDatetime" class-name="input-text" />
			<span class="mh5">到</span>
			<datepicker v-model="endDatetime" class-name="input-text" />
		</div>
		<!-- 来源/去向 -->
		<div class="m-col col-direction">
			<div class="btn-group">
				<button class="btn" :class="{active: srctype === 1}"
					@click="changeSrcType(1)">显示来源</button>
				<button class="btn" :class="{active: srctype === 2}"
					@click="changeSrcType(2)">显示去向</button>
			</div>
		</div>
		<!-- 仅限市内 -->
		<div class="m-col">
			<label class="checkbox">
				<input type="checkbox" v-model="inCity" @change="fetchRender" />
				仅限市内
			</label>
		</div>
	</div>

	<!-- chart -->
	<my-chart class="sankey-chart" :o="o" />
</div>
</template>

<script>
import {config, mlayer, request, $} from 'root';
import ChartUtil from 'util/chart.js';
import MDate from 'lib/mdate.js';
import tool from 'util/tool.js';
var DateUtil = MDate.Util;
var methods = {};
methods.getMyOption = function (result = {}) {
	return ChartUtil.getAttractionPathOption({
		series: [{
			left: 20,
			top: 10,
			bottom: 10,
			right: '15%',
			data: result.nodes,
			links: result.links,
		}]
	});
};
methods.getFetchParam = function () {
	let o = tool.extend({
		start_date: this.startDatetime,
		end_date: this.endDatetime
	}, this.fetchParam);

	return o;
};
methods.fetchRender = function () {
	this.fetchCount++;
	var c = this.fetchCount;
	this.o = null;
	request.getAttractionPath(this.getFetchParam()).then((r) => {
		if (c !== this.fetchCount) {
			return;
		}
		this.o = this.getMyOption(r);
	}).catch((r) => {
		if (c !== this.fetchCount) {
			return;
		}
		this.o = 'empty';
		mlayer.msg('数据加载失败');
	});
};

methods.changeSrcType = function (v) {
	if (this.srctype === v) {
		return false;
	}
	this.srctype = v;
	this.fetchRender();
};
var computed = {};
var watch = {};
watch.fetchParam = {
	deep: true,
	handler: function () {
		this.fetchRender();
	}
};
const mounted = function () {
	request.getAuthUsers(request.getAuthParam()).then((r) => {
		this.attractions = r.map((v) => {
			return {
				text: v.userName,
				value: v.userName // v.userId
			};
		});
	});
	this.$on('onDateChange', this.fetchRender);
};
const created = function () {
	this.fetchCount = 0;
	window.VM = this;
};
const beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		srctype: 1,
		inCity: true,
		fetchParam: {
			scenery_name: ''
		},
		attractions: [],
		o: null
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/begin_end_datetime.js')
	],
	methods,
	computed,
	props: [],
	created,
	mounted,
	beforeDestroy,
	components: {
		'my-chart': require('comp/common/my-chart.vue')
	}
};
</script>

<style scoped lang="less">
.v-main {
	
}
.condition-box {
	min-width: 870px;
	& > .m-col > label {
		font-size: 14px;
		line-height: 32px;
	}
}
@scenery-select-width: 200px;
.col-scenery-select {
	width: @scenery-select-width + 100;
	.scenery-select {
		width: @scenery-select-width;
	}
}
.col-date {
	width: 360px;
	input[type=text] {
		width: 100px;
	}
}
.col-direction {
	width: 200px;
}
.sankey-chart {
	overflow: hidden;
	height: ~'calc(100vh - 115px)';
}
</style>
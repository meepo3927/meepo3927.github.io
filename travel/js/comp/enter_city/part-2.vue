<template>
<div class="analysis-part height-flex">
	<!-- 日期选择 -->
	<div class="datepicker-box fl x-head">
		<label >选择日期：</label>
		<datepicker :value="startDatetime" @input="onStartDateInput($event)" />
		<span class="d-span">到</span>
		<datepicker :value="endDatetime" @input="onEndDateInput($event)" />

		<!-- 省内外 -->
		<div class="btn-group ml25" >
			<button class="btn-big" v-for="(v, k) in vConfig.homeMap" 
				v-if="v !== '全部'"
				:class="{active: userType === k}"
				@click="switchUserType(k)" 
				v-text="v"></button>
		</div>
	</div>
	<!-- chart -->
	<div class="x-body ">
		<my-chart :o="o" />
	</div>
</div>
</template>

<script>
import request from 'util/request';
import chartUtil from 'util/chart';
import EchartUtil from 'util/echart.js';
import MDate from 'lib/mdate.js';

var methods = {};

methods.render = function (i) {
};
methods.setup = function (option) {
	if (this.userType === '1') {
		// 省内
		require.ensure([], () => {
			require('lib/geo/neimenggu.js');
			this.o = option;
		});
	} else if (this.userType === '2') {
		// 省外
		require.ensure([], () => {
			require('lib/geo/china.js');
			this.o = option;
		});
	} else if (this.userType === '3') {
		// 国外
		require.ensure([], () => {
			require('lib/geo/world.js');
			this.o = option;
		});
	}
};
methods.fetchRender = function () {
	this.disposeCharts();
	let p = {
		start_date: this.startDatetime,
		end_date: this.endDatetime,
		scenery_city: this.id,
		userType: this.getUserTypeParam()
	};
	this.o = null;
	request.vwRPTOuterUserDaily(p).then((r) => {
		if (p.userType !== this.getUserTypeParam()) {
			return;
		}
		if (p.userType == 3) {
			// 省内
			let defaults = {
				title: {
					text: '地市客流省内来源排行',
					subtext: this.subtext
				}
			};
			var option = chartUtil.vwRPTOuterUserDaily3(defaults, {
				data: r.map
			});
		} else if (p.userType === 2) {
			// 省外
			let defaults = {
				title: {
					text: '地市客流省外来源排行',
					subtext: this.subtext
				}
			};
			option = chartUtil.vwRPTOuterUserDaily2(defaults, {
				data: r.map
			});
		} else {
			// 国外
			let defaults = {
				title: {
					text: '地市客流' + this.vConfig.homeMap[3] + '来源排行',
					subtext: this.subtext
				}
			};
			option = chartUtil.vwRPTOuterUserDaily1(defaults, {
				data: r.map
			});
		}

		this.setup(option);
	}).catch(() => {
		this.o = 'empty';
	});
};

var computed = {};

var mounted = function () {
	this.fetchRender();
	this.$on('onDateChange', () => {
		this.fetchRender();
	});
};
let beforeDestroy = function () {
	this.disposeCharts();
};
let dataFunc = function () {
	var o = {
		userType: '1'
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: [],
	mounted,
	mixins: [
		require('./part-mix.js'),
		require('comp/chart_layer/the_common_mix.js')
	],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@import "../../ref.less";
.analysis-part {
}

</style>
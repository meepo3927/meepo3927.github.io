<template>
<div class="c">
	<span v-text="channelText"></span>
	<span v-text="errmsg" v-if="errmsg" class="text-error "></span>
	<a href="javascript:;" class="ml15" @click="show"
		v-show="channelCount">查看基站</a>

	<center-layer close="1" v-if="layerVisible" 
		width="75vw" height="80vh"
		@close="onClose">
		<div class="layer-wrapper">
			<table class="m-table">
				<thead>
					<tr>
						<th class="col-index">序号</th>
						<th>基站ID</th>
						<th>基站名称</th>
					</tr>
				</thead>
				<tbody v-if="dataReady">
					<tr v-for="(v, i) in lacCells">
						<td v-text="i + 1" class="text-center"></td>
						<td v-text="v.LACCELLID"></td>
						<td v-text="v.LACNAME"></td>
					</tr>
				</tbody>
				<tfoot v-if="loadingVisible">
					<tr>
						<td colspan="3" class="loading-cell">
							<div class="loading-1"></div>
						</td>
					</tr>
				</tfoot>
				<tfoot v-if="dataEmpty">
					<tr>
						<td colspan="3" class="empty-cell">
							暂无数据
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</center-layer>
</div>
</template>

<script>
const request = require('util/request.js');
var methods = {};
methods.fetchRender = function () {
	if (!this.channelStr) {
		return;
	}
	let p = {
		channels: this.channelStr
	};
	let req = request.gisStationLacCells(p);
	this.lacCells = undefined;
	this.setPromise('gisStationLacCells', req).then((result) => {
		if (result.data && result.data.length) {
			this.lacCells = result.data;
		} else {
			this.lacCells = [];
		}
	}).catch((e) => {
		this.lacCells = [];
	});
};
methods.check = function () {
	if (this.channelCount) {
		this.errmsg = '';
		return true;
	}
	this.errmsg = '请选择至少一个渠道';
	return false;
};
methods.show = function () {
	this.layerVisible = true;
};
methods.onClose = function () {
	this.layerVisible = false;
};
var computed = {};
computed.dataReady = function () {
	if (this.lacCells && this.lacCells.length) {
		return true;
	}
	return false;
};
computed.channelCount = function () {
	return this.value[0] ? this.value[0].length : 0;
};
computed.channelStr = function () {
	if (this.value[0] && this.value[0].length) {
		return this.value[0].map((v) => {
			return v.id + ',' + v.range
		}).join('|');
	}
	return '';
};
computed.channelText = function () {
	if (this.channelCount) {
		return '已选择' + this.channelCount + '个渠道';
	}
};
computed.loadingVisible = function () {
	return (this.lacCells === undefined)
};
computed.dataEmpty = function () {
	if (this.lacCells && this.lacCells.length === 0) {
		return true;
	}
	return false;
};
let watch = {};
watch.channelCount = function () {
	this.check();
};
watch.channelStr = function (v) {
	v && this.fetchRender();
};
var mounted = function () {
	this.fetchRender();
};
export default {
	data: function () {
		return {
			lacCells: undefined,
			layerVisible: false
		};
	},
	watch,
	methods,
	computed,
	props: [],
	mounted,
	mixins: [
		require('./mix.js'),
		require('mixins/request_mix.js')
	]
};
</script>

<style scoped lang="less">
.c {}
.layer-wrapper {
	background-color: #fff;
	overflow: auto;
}
table .col-index {
	text-align: center;
	width: 120px;
}
table .loading-cell {
	padding: 15px;
	.loading-1 {
		margin-left: auto;
		margin-right: auto;
	}
}
table .empty-cell {
	text-align: center;
	padding: 15px;
}
</style>
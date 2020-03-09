<template>
<div class="rank-list-box">
	<table class="table">
		<thead>
			<tr>
				<th class="col-ranking">排名</th>
				<th class="tal">旗县</th>
				<th class="col-num-state">实时客流量</th>
			</tr>
		</thead>
	</table>
	<div class="list-table-box">
		<table class="table">
			<tbody>
				<tr v-for="(v, i) in list">
					<td v-text="i + 1" class="col-ranking"></td>
					<td v-text="v.countryName"></td>
					<td class="col-num-state">
						{{v.userNum}}
						<span class="state-span state-1">正常</span>
					</td>
				</tr>
				<tr v-if="listEmpty">
					<td colspan="4" class="tac">没有数据</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>

<script>
import barStore from 'store/rightbar.js';
import request from 'util/request';
import tool from 'util/tool.js';

var methods = {};
methods.fetchRender = function () {
	let p = {
		scenery_city: this.cityId,
		userType: this.userType
	};
	this.map = null;
	this.$emit('request-start');
	request.vwRptCurrentRomaAtDay1(p).then((r) => {
		// 请求过期了
		if (p.userType !== this.userType) {
			return;
		}
		this.$emit('request-over');
		this.map = r;
	}).catch((e) => {
		this.$emit('request-over');
	});
};
var computed = {};
computed.cityId = function () {
	return barStore.getters.areaId;
};
const sorted = (data) => {
	let list = tool.extend([], data);
	return list.sort((a, b) => {
		return (b.userNum - a.userNum);
	});
};
computed.list = function () {
	if (!this.map) {
		return null;
	}
	for (let i = 0; i < this.map.length; i++) {
		let item = this.map[i];
		if (item.key === this.dateKey) {
			return sorted(item.datas);
		}
	}
	return null;
};
computed.listEmpty = function () {
	if (!this.list || !this.list.length) {
		return true;
	}
	return false;
};
var watch = {};
watch.userType = function () {
	this.fetchRender();
};
watch.cityId = function () {
	this.fetchRender();
};
var mounted = function () {
};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		map: null
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: ['userType', 'dateKey'],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.list-table-box {
	max-height: 500px;
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
<template>
<table class="table m-table event-list-table">
	<thead>
		<tr>
			<th class="col-1 text-center">事件编号</th>
			<th class="col-2 text-center">事件集名称</th>
			<!--<th class="col-3 text-center">事件类型</th> -->
			<th class="col-4 text-center">创建人</th>
			<th class="col-5 text-center">创建时间</th>
			<th class="col-6 text-center">事件状态</th>
			<th class="col-7 text-center">操作</th>
		</tr>
	</thead>
	<tbody v-if="!listEmpty">
		<tr v-for="item in mylist" :key="item">
			<td class="col-1 text-center" v-text="item.evtSetId"></td>
			<td v-text="item.evtSetName" class="text-center"></td>
			
			<td v-text="item.createPersn" class="text-center"></td>
			<td v-text="item.createTime" class="text-center"></td>
			<td v-text="item.isActive" class="text-center"
				:class="[isActive(item)? 'text-success' : 'text-warning']"></td>
			<td class="text-center">
				<a href="javascript:;" @click="showDetail(item)">查看</a>
				<a :href="getEditUrl(item)" class="ml15" v-if="item.isOwner">修改</a>
				<a href="javascript:;" class="ml15" v-if="item.isOwner && isActive(item)" 
					@click="disableEvent(item)">失效</a>
				<a href="javascript:;" class="ml15" v-if="item.isOwner && !isActive(item)" 
					@click="enableEvent(item)">正常</a>

				<a :href="getCopyUrl(item)" class="ml15">复制</a>
				<a href="javascript:;" class="ml15" v-if="item.isOwner" @click="deleteEvent(item)">删除</a>
			</td>
		</tr>
	</tbody>
	<!-- 空 -->
	<tbody v-if="listEmpty && !loading" is="table-empty" :colspan="columnCount"></tbody>
	<!-- loading -->
	<tfoot v-show="loading" is="table-loading" :colspan="columnCount" ></tfoot>
</table>
</template>

<script>
import request from 'util/request.js';
import config from 'config';
var methods = {};
methods.showDetail = function (item) {
	this.$emit('show-detail', item);
};
methods.isActive = function (item) {
	return item.isActive === '生效';
};
methods.getEditUrl = function (item) {
	return this.getStaticUrl('/create_event', 'id=' + item.evtSetId);
};
methods.getCopyUrl = function (item) {
	return this.getStaticUrl('/create_event', 'id=' + item.evtSetId + '&mode=copy');
};
methods.disableEvent = function (item) {
	request.op(request.ajaxUrlBase + '/event/disableEventSet.action', {eventSetId: item.evtSetId}).then(() => {
		mlayer.iconMsg('操作成功');
		this.delayRefresh();
	}, () => {
		mlayer.msg(config.msg.opfail);
	});
};
methods.enableEvent = function (item) {
	request.op(request.ajaxUrlBase + '/event/enableEventSet.action', {eventSetId: item.evtSetId}).then(() => {
		mlayer.iconMsg('操作成功');
		this.delayRefresh();
	}, () => {
		mlayer.msg(config.msg.opfail);
	});
};
methods.deleteEvent = function (item) {
	if (!confirm(config.msg.confirmDelete)) {
		return;
	}
	request.op(request.ajaxUrlBase + '/event/deleteEventSet.action', {eventSetId: item.evtSetId}).then(() => {
		mlayer.iconMsg('删除成功');
		this.delayRefresh();
	}, () => {
		mlayer.msg(config.msg.opfail);
	});
};
var computed = {};
var mounted = function () {};
export default {
	data: function () {
		return {
			columnCount: 7
		};
	},
	methods,
	computed,
	props: ['list', 'loading'],
	mounted,
	mixins: [
		require('comp/table/mixin.js')
	]
};
</script>

<style scoped lang="less">
</style>
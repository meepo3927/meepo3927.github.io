<template>
<div class="v-main p10">
	<search-form @search="search" />
	<table class="table-2">
		<thead>
			<tr>
				<th class="col-datetime">通知时间</th>
				<th class="col-scenery-name">景区名称</th>
				<th class="col-level">预警级别</th>
				<th class="text-left">信息</th>
				<th class="text-left">操作人</th>
				<th class="col-op">操作</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="v in plist">
				<td v-text="v.datetime" class="col-datetime"></td>
				<td v-text="v.sceneryName" ></td>
				<td v-text="v.alarmType" class="col-level"></td>
				<td >
					<div class="info-value"
						v-html="v.alarmInfo">
					</div>
				</td>
				<td v-text="v.operatorCode"></td>
				<td>
					<a href="javascript:;" @click="remove(v)">删除</a>
					<a href="javascript:;" @click="edit(v)" 
						class="ml10">编辑</a>
				</td>
			</tr>
		</tbody>
		<tfoot v-show="emptyVisible">
			<tr>
				<td :colspan="colspan">没有记录</td>
			</tr>
		</tfoot>
	</table>
	<div class="loading-1 mt5" v-show="loading"></div>
	<div is="pagination" 
		:cur-page="curPage" 
		:total-page="pagingTotalPage"
		@click="changePage"></div>
</div>
</template>

<script>
import {config, mlayer, request} from 'common';
var methods = {};
methods.remove = function (item) {
	if (!confirm('是否确定删除？')) {
		return false;
	}
	let p = this.getOperateParam(item);
	request.deleteAlarmMessage(p).then(() => {
		mlayer.iconMsg('删除成功！');
		this.removeItem(item);
	}).catch(() => {
		mlayer.msg('删除失败');
	});
};
methods.getOperateParam = function (item) {
	return {
		sceneryId: item.sceneryId,
		calDate: item.calDate,
		alarmTime: item.alarmTime,
		operatorCode: item.operatorCode
	};
};
methods.edit = function (item) {
	let msg = prompt('请输入备注信息：');
	if (!msg) {
		return;
	}
	let p = this.getOperateParam(item);
	p.operInfo = (msg);
	request.updateAlarmMessage(p).then((r) => {
		item.alarmInfo = msg;
		mlayer.iconMsg('编辑成功！');
	}).catch(() => {
		mlayer.msg('编辑失败');
	});
};
methods.getDateTime = function (item) {

	let calDate = item.calDate;
	var date = '';
	if (calDate) {
		let y = calDate.substr(0, 4);
		let m = calDate.substr(4, 2);
		let d = calDate.substr(6, 2);
		date = [y, m, d].join('-');
	}

	let t = item.alarmTime + '';
	let h = t.substr(0, 2);
	let i = t.substr(2, 2);
	let s = t.substr(4, 2);
	let time = [h, i, s].join(':');
	return [date, time].join(' ');
};
var computed = {};
computed.colspan = function () {
	return 6;
};
computed.pagePerNum2 = function () {
	return 3;
};
var watch = {};
const created = function () {
	let p = this.getRequestParam();
	this.fetchPromise = request.getAlarmMessage(p);
};
var mounted = function () {
	this.loading = true;
	this.fetchPromise.then((r) => {
		this.loading = false;

		this.backlist = this.olist = r.map((v) => {
			v.datetime = this.getDateTime(v);

			return v;
		});

	}).catch(() => {
		this.loading = false;
	});
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/manage_table.js')
	],
	created,
	methods,
	computed,
	props: [],
	mounted,
	destroyed,
	components: {
	}
};
</script>

<style scoped lang="less">
.v-main {
	
}
.col-datetime {
	width: 240px;
	text-align: center;
}
.col-scenery-name {
	text-align: left;
}
.col-level {
	width: 140px;
	text-align: center;
}
.col-op {
	text-align: left;
}
.text-left {
	text-align: left;
}
.info-value {
	line-height: 1.4;
}
</style>
<template>
<div class="v-main p10">
	<search-form @search="search" />
	<table class="table-2">
		<thead>
			<tr>
				<th class="tal col-id">景区ID</th>
				<th class="tal">景区名称</th>
				<th class="tal col-alarm-num">报警阈值</th>
				<th class="tal col-operator">操作人</th>
				<th class="tal col-op">操作</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="v in plist" :key="v.sceneryId">
				<td v-text="v.sceneryId"></td>
				<td v-text="v.sceneryName"></td>
				<td class="col-alarm-num">
					<span v-text="v.alarmValue"
						v-show="!v.modeEdit"></span>
					<input type="text" class="input-text"
						v-model="v.alarmNumForEdit" 
						v-show="v.modeEdit" />
					<button class="btn ml10" type="button" v-show="v.modeEdit"
						@click="submit(v)">确定</button>
					<button class="btn ml10" type="button" v-show="v.modeEdit"
						@click="cancel(v)">取消</button>
				</td>
				<td v-text="v.operatorCode"></td>
				<td>
					<a href="javascript:;" @click="modify(v)">修改阈值</a>
				</td>
			</tr>
		</tbody>
		<tfoot v-show="emptyVisible">
			<tr>
				<td colspan="5">没有记录</td>
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
import {config, mlayer, request, $} from 'root';
import tool from 'util/tool';
var methods = {};
methods.modify = function (v) {
	v.modeEdit = !v.modeEdit;
};
methods.submit = function (v) {
	let newValue = parseInt(v.alarmNumForEdit, 10);
	if (isNaN(newValue)) {
		return mlayer.msg('请输入合法的数字');
	}

	if (newValue <= 0) {
		return mlayer.msg('阈值必须大于0');
	} else if (newValue >= 100000) {
		return mlayer.msg('阈值必须小于100000');
	}
	let param = {
		sceneryId: v.sceneryId,
		alarmValue: newValue,
		operatorCode: config.user.code
	};
	let layer = mlayer.loading();
	request.updateSceneryAlarm(param).then(() => {
		v.alarmValue = v.alarmNumForEdit = newValue;
		v.operatorCode = param.operatorCode;
		v.modeEdit = false;
		layer.close();
		mlayer.iconMsg('修改成功！');
		
	}).catch(() => {
		layer.close();
		mlayer.msg('修改失败');
		
	});
};
methods.cancel = function (v) {
	v.modeEdit = false;
};
var computed = {};
var watch = {};
const created = function () {
	let p = this.getRequestParam();
	this.fetchPromise = request.getSelectSceneryAlarm(p);
};
const mounted = function () {
	this.loading = true;
	this.fetchPromise.then((r) => {
		this.loading = false;

		this.backlist = this.olist = r.map((v) => {
			v.modeEdit = false;
			v.alarmNumForEdit = v.alarmValue;
			return v;
		});

	}).catch(() => {
		this.loading = false;
	});
};
let beforeDestroy = function () {};
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
	methods,
	created,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {
	}
};
</script>

<style scoped lang="less">
.v-main {
	
}
.col-id {
	width: 120px;
}
.col-alarm-num {
	width: 360px;
}
.col-alarm-num > button {
	vertical-align: top;
}
.col-operator {
	width: 100px;
}
.col-op {
	width: 160px;
}
</style>
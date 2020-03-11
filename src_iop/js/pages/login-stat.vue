<template>
<div class="login-stat ">
	<!-- 参数 -->
	<form class="common-form">
		<div class="layout-row cell-ver-mid w-auto">
			<label for="" class="x-cell col-1">日期：</label>
			<div class="x-cell">
				<vue-date class="form-control" v-model="startDate" />
			</div>
			<div class="x-cell ph10">至</div>
			<div class="x-cell">
				<vue-date class="form-control" v-model="endDate" />
			</div>
			<div class="x-cell pl15">
				<button class="btn btn-primary" type="button"
					@click="submit">查询</button>
			</div>
		</div>

	</form>
	<div class="table-wrapper clearfix">
		<!-- 1 -->
		<div class="table-box t-1">
			<table class="m-table">
				<thead>
					<tr>
						<th>分公司</th>
						<th>账号数量</th>
						<th>登陆账号数量</th>
						<th>账号使用率</th>
						<th>登录人次</th>
						<th>人均登录次数</th>
						<th>点击次数</th>
						<th>人均点击次数</th>
					</tr>
				</thead>
				<tbody v-if="list1">
					<tr v-for="v in list1">
						<td v-text="v.cityTitle"></td>
						<td v-text="v.iopUser"></td>
						<td v-text="v.lopLogUser"></td>
						<td v-text="getRate(v.logRate)"></td>
						<td v-text="v.logNumber"></td>
						<td v-text="v.logAvg"></td>
						<td v-text="v.clickNumber"></td>
						<td v-text="v.clickAvg"></td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- 2 -->
		<div class="table-box t-2">
			<table class="m-table">
				<thead>
					<tr>
						<th>模块名称</th>
						<th>使用人数</th>
						<th>点击次数</th>
					</tr>
				</thead>
				<tbody v-if="list2">
					<tr v-for="v in list2">
						<td v-text="v.moduleName"></td>
						<td v-text="v.accessUser"></td>
						<td v-text="v.accessNumber"></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
</template>

<script>
import MDate from 'lib/mdate.js';

let methods = {};
methods.submit = function () {
	this.list1 = null;
	this.list2 = null;
	let ld = mlayer.loading();
	this.vRequest.getLoginStat(this.submitParam).then((r) => {
		this.list1 = r[1];
		this.list2 = r[0];
		ld.close();
	}).catch((e) => {
		ld.close();
		LOG(e);
		if (e.responseText && e.responseText.indexOf('未登录') >= 0) {
			mlayer.msg('请先登录');
		} else {
			mlayer.msg('获取数据失败');
		}
	});
};
methods.getRate = function (str) {
	if (str) {
		return str + '%';
	}
}
let computed = {};
computed.submitParam = function () {
	return {
		startDate: this.startDate,
		endDate: this.endDate
	};
};
let watch = {};
const created = function () {};
const mounted = function () {
	this.$nextTick(this.submit);
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let start = MDate.Util.getDateOffset(new Date, -14);
	let end = new Date;
	let startDate = MDate.Util.getYMDStr(start);
	let endDate = MDate.Util.getYMDStr(end);
	let o = {
		startDate,
		endDate,
		list1: null,
		list2: null
	};
	return o;
};
export default {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: [],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">

.table-box {
	padding: 10px;
	
	float: left;
}
.t1 {
	width: 800px;
	margin-right: 30px;
}
.t2 {
	width: 300px;
}
.m-table {
	border: 1px solid #ccc;
	thead > tr > th {
		border-right: 1px solid #ddd;
		padding-top: 12px;
		padding-bottom: 12px;
		font-size: 16px;
	}
	tbody > tr > td {
		border: 1px solid #ddd;
	}
}
.common-form {
	padding: 15px 10px;
}
</style>

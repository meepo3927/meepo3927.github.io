<template>
<div class="user-auth">
	<h3>授权账号：</h3>
	<form action="" class="label-w-6 search-form" @submit.prevent v-if="formVisible">
		<div class="form-item " v-if="citylistVisible">
			<label for="">选择地市：</label>
			<div class="x-right">
				<v-chosen class="input-width" :options="citylist" 
					v-model="myCityId" @change="onCityChange" />
			</div>
		</div>

		<div class="form-item ">
			<label for="">搜索：</label>
			<div class="x-right">
				<input type="text" class="input-text input-width"
					v-model="keyword">
			</div>
		</div>
	</form>
	<!-- 列表 -->
	<ul class="account-list" v-if="accountFiltered">
		<li>
			<label class="checkbox">
				<input type="checkbox" @change="onAllChange" /> [全选]
			</label>
		</li>
		<li v-for="acct in accountFiltered" :class="{active: acct.checked}">
			<label class="checkbox">
				<input type="checkbox" v-model="acct.checked" /> {{acct.sceneryName}}
			</label>
		</li>
	</ul>
	<!-- 文字 -->
	<p v-show="msg" class="empty-text" v-text="msg"></p>
	<div class="loading-1 mt15" v-show="loading"></div>

	<!-- 按钮 -->
	<button class="btn mt15 mb15" type="button" v-show="saveBtnVisible"
		@click="save">保存</button>
</div>
</template>

<script>
import userStore from 'store/user_select.js';
import request from 'util/request.js';

var methods = {};
methods.onAllChange = function (e) {
	let b = e.target.checked;
	if (!this.accountFiltered) {
		return;
	}
	this.accountFiltered.forEach((item) => {
		item.checked = b;
	});
};
methods.onCityChange = function (v) {
	this.keyword = '';
	this.$nextTick(this.fetchRender);
};
methods.fetchRender = function () {
	if (!this.pId || !this.myCityId) {
		return;
	}
	this.loading = true;
	this.accounts = null;
	let p = {userId: this.pId, cityId: this.myCityId};
	request.getCityChildrenAccounts(p).then((data) => {

		this.loading = false;
		this.accounts = data;
	}).catch(() => {
		this.loading = false;
		this.accounts = [];
	});
};
methods.save = function () {
	let list = [];
	for (let i = 0; i < this.accounts.length; i++) {
		let item = this.accounts[i];
		if (item.checked) {
			list.push(item.sceneryId);
		}
	}
	let userId = this.pId;
	let roles = list.join(',');
	let cityId = this.myCityId;
	let ld = mlayer.loading();
	request.updateUserRole({userId, roles, cityId}).then((r) => {
		ld.close();
		mlayer.iconMsg('保存成功！');
	}).catch((e = {}) => {
		ld.close();
		mlayer.msg(e.msg || '提交失败');
		LOG(e);
	});
};
var computed = {};
computed.pId = function () {
	return this.info.id;
};
computed.cityId = function () {
	return this.info.cityId || 400;
};
computed.info = function () {
	return userStore.state.selectInfo || {};
};
computed.msg = function () {
	if (!this.pId) {
		return '请选择账号';
	}
	if (this.accountEmpty && !this.loading) {
		if (this.keyword) {
			return '没有搜索到结果';
		} else {
			return '没有获取数据';
		}
	}
};
computed.accountFiltered = function () {
	if (!this.accounts) {
		return null;
	}
	let keyword = this.keyword.trim();
	return this.accounts.filter((v) => {
		if (!keyword) {
			return true;
		}
		if (v.sceneryName.indexOf(keyword) < 0) {
			return false;
		}
		return true;
	});
};
computed.accountEmpty = function () {
	if (this.accountFiltered && this.accountFiltered.length) {
		return false;
	}
	return true;
};
computed.saveBtnVisible = function () {
	if (!this.pId || this.accountEmpty || this.loading) {
		return false;
	}
	return true;
};
computed.formVisible = function () {
	if (this.accounts && this.accounts.length) {
		return true;
	}
	return false;
};
computed.citylistVisible = function () {
	if (!this.cityId || this.cityId == 400) {
		return true;
	}

	return false;
};
computed.citylist = function () {
	
	return request.getStaticCityList({withAll: true}).map((v) => ({
		value: v.id,
		text: v.name
	}));
};
var watch = {};
watch.pId = function () {
	this.keyword = '';
	this.myCityId = this.cityId;
	this.fetchRender();
};

var mounted = function () {
	this.myCityId = this.cityId;
	this.fetchRender();
};
let beforeDestroy = function () {
};
let dataFunc = function () {
	var o = {
		myCityId: null,
		accounts: null,
		loading: false,
		keyword: ''
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {
		'v-chosen': require('comp/common/v-chosen.vue')
	}
};
</script>

<style scoped lang="less">
@import (reference) "../../../less/global/config";
.user-auth {
	min-width: 280px;
	max-height: ~'calc(100vh - 105px)';
	
	overflow-x: hidden;
	overflow-y: auto;
	padding: 12px 20px;
}
.empty-text {
	color: #777;
	margin-top: 10px;
}

.account-list {
	margin-left: 1px;
	li {
		margin-top: 18px;
	}
	li.active {
		color: @theme-color;
	}
}
.search-form {
	width: 320px;
}
.input-width {
	width: 140px;
}
</style>
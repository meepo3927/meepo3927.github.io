<template>
<div class="page-user-manage p10">
	<div class="clearfix" >
		<!-- 用户 tree -->
		<div class="tree-box fl section-box" >
			<h3 class="section-title">用户列表：</h3>
			<a href="javascript:;" class="create-user-btn" @click="showCreateUser">
				<i class="fa fa-plus"></i>
				新增用户
			</a>
			<div class="ztree" id="ztree1" ref="tree"></div>
			<div class="loading-1" v-show="view.loadingUser"></div>
		</div>

		<div class="form-box fl" ref="formBox">
			<div class="btn-group ">
				<button class="btn" :class="{active: tab === 1}" 
					@click="switchTab(1)">修改密码</button>
				<button class="btn" :class="{active: tab === 2}"
					@click="switchTab(2)">授权账号</button>
			</div>
			<!-- 修改密码 表单 -->
			<v-password class="section-box mt15" key="password" v-if="tab === 1" />

			<!-- 授权账号 -->
			<v-auth class="section-box mt15" key="auth" v-if="tab === 2" 
				ref="auth" />
		</div>
		
	</div>

	<!-- 编辑浮层 -->
	<edit-info-layer v-if="view.editInfoVisible" 
		@close="onEditInfoClose"
		@update="onEditInfoUpdate"></edit-info-layer>

	<!-- 新增用户 -->
	<create-user-layer v-if="view.createUserVisible" 
		@close="onCreateUserClose"
		@update="onCreateUserUpdate"></create-user-layer>
</div>
</template>

<script>
import {config, mlayer, request, $, tool} from 'root';
import zTree from 'ztree';
import 'extend/jquery.sticky.js';
import userStore from 'store/user_select.js';

var methods = {};
methods.switchTab = function (n) {
	if (this.tab === n) {
		return;
	}
	this.tab = n;
};

methods.onEditInfoClose = function () {
	this.view.editInfoVisible = false;
};
methods.onEditInfoUpdate = function (o) {
	let node = tool.extend(userStore.state.editInfo, o);
	this.tree.updateNode(node);
};
methods.showCreateUser = function () {
	this.view.createUserVisible = true;
};
methods.onCreateUserClose = function () {
	this.view.createUserVisible = false;
};
methods.onCreateUserUpdate = function () {
	this.fetchUsers();
};
methods.fetchUsers = function () {
	let p = {};
	if (config.user.flag === 'city') {
		p.cityId = config.user.code;
	}
	if (this.tree) {
		this.tree.destroy();
		this.tree = null;
	}
	// 清除
	userStore.commit('clean');

	this.view.loadingUser = true;
	request.getAuthUsers(p).then((r) => {
		this.view.loadingUser = false;
		// 初始化树
		let $tree = $(this.$refs.tree);
		this.tree = $.fn.zTree.init($tree, this.zTreeSetting, this.getNodes(r));
	}).catch(() => {
		this.view.loadingUser = false;
	});
};
methods.getNodes = function (list) {
	if (list === undefined) {
		return [
			{id:1, pId:0, name: "无"},
		];
	}
	return list.map((v) => {

		return {
			id: v.userId,
			pId: -1,
			name: v.userName,
			cityId: v.cityId
		};
	});
};
var computed = {};

computed.zTreeSetting = function () {
	let vm = this;
	const onClick = function (e, id, node, flag) {
		userStore.commit('updateSelectInfo', node);
	};
	const beforeEditName = (id, node) => {
		userStore.commit('updateEditInfo', node);
		this.view.editInfoVisible = true;
		return false;
	};
	const beforeRemove = (id, node) => {
		if (confirm('确定删除该用户吗？')) {

			let p = {
				userId: node.id
			};
			request.deleteUser(p).then(() => {
				mlayer.iconMsg('删除成功！');
				this.tree.removeNode(node, false);
			}).catch(() => {
				mlayer.msg('删除失败');
			});
		}
		return false;
	};
	let callback = {
		onClick,
		beforeEditName,
		beforeRemove,
		beforeDrag: () => {
			return false;
		}
	};
	let setting = {
		callback,
		edit: {
			enable: true,
			removeTitle: '删除',
			renameTitle: '编辑',
			showRemoveBtn: true,
			showRenameBtn: true
		}
	};
	return setting;
};
var watch = {};
const created = function () {
};
var mounted = function () {
	window.VM = this;
	this.fetchUsers();
};
const beforeDestroy = function () {};
let dataFunc = function () {

	var o = {
		tab: 1,
		view: {
			loadingUser: false,
			editInfoVisible: false,
			createUserVisible: false
		}
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
	created,
	mounted,
	beforeDestroy,
	components: {
		'edit-info-layer': require('./edit-info.vue'),
		'v-password': require('./password.vue'),
		'v-auth': require('./auth.vue'),
		'create-user-layer': require('./create-user.vue')
	}
};
</script>

<style scoped lang="less">
.v-main {
	
}

.tree-box {
	& > h3 {
		margin-left: 5px;
	}
	position: relative;
	min-width: 320px;
	max-height: ~'calc(100vh - 60px)';
	overflow-y: auto;
	overflow-x: hidden;
	margin-right: 25px;
	padding: 1px 10px 10px 5px;
	.create-user-btn {
		position: absolute;
		top: 15px;
		right: 15px;
		color: #00c;
		&:active {
			color: #f00;
		}
	}
}

</style>
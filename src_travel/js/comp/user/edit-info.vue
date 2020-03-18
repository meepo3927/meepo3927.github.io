<template>
<center-layer >
	<div class="edit-info-layer">
		<close-box @close="$emit('close')" />
		<h2>编辑用户信息</h2>
		<form action="" class="label-w-6">
			<!-- 用户名 -->
			<div class="form-item" >
				<label for="">用户名：</label>
				<div class="x-right">
					<input type="text" class="input-text" v-model="name" />
				</div>
			</div>

			<!-- 按钮 -->
			<div class="form-item ">
				<label for="" >&nbsp;</label>
				<div class="x-right">
					<button class="btn" type="button" @click="submit">
						提交
					</button>
					<span class="inline-loading ml10" v-show="loading"></span>
				</div>
			</div>
		</form>
	</div>
	
</center-layer>
</template>

<script>
import userStore from 'store/user_select.js';
import request from 'util/request.js';
var methods = {};
methods.close = function () {
	this.$emit('close');
};
methods.submit = function () {
	if (this.loading) {
		return;
	}
	let p = {
		userId: this.info.id,
		userName: this.name
	};
	if (!this.name.trim()) {
		return mlayer.msg('用户名不能为空');
	}

	this.loading = true;
	request.updateUserName(p).then((r) => {
		this.loading = false;
		this.close();
		mlayer.iconMsg('修改成功！');
		this.$emit('update', {name: p.userName});
	}).catch((o = {}) => {
		this.loading = false;
		mlayer.msg(o.msg || '修改失败');
	});
};
var computed = {};
computed.info = function () {
	return userStore.state.editInfo || {};
};
var watch = {};
var mounted = function () {
	this.name = this.info.name;
};
let beforeDestroy = function () {};
let dataFunc = function () {
	var o = {
		name: '',
		loading: false
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [
		require('mixins/with_cover.js')
	],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {
		'close-box': require('comp/chart_layer/close-box.vue')
	}
};
</script>

<style scoped lang="less">
.edit-info-layer {
	background-color: #fff;
	padding: 15px 20px;
	border-radius: 5px;
}
.input-text {
	width: 320px;
}
</style>
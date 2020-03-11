<template>
<div class="channel-config-layer">
	<h4>选择事件覆盖的渠道：</h4>
	<div class="search-box">
		<input type="text" class="form-control search-input" 
			@keyup.enter="searchTree"
			v-model="keyword"
			placeholder="根据渠道名称模糊搜索" />
		<a href="javascript:;" class="clear-btn" v-show="keyword"
			@click="clearKeyword">
			<i class="fa fa-times"></i>
		</a>
		<button class="btn btn-primary" @click="searchTree" >
			<i class="fa fa-search"></i>
		</button>
	</div>
	<div class="clearfix mt5">
		<!-- 左 树 -->
		<div class="tree-box">
			<ztree :data="treeData" :setting="treeSetting"
				ref="tree"
				@click="onNodeClick" />
			<p v-show="treeData === null" class="text-empty">暂无数据</p>
		</div>
		<!-- 右 表单 -->
		<div class="form-box" v-if="formVisible">
			<!-- 渠道名称 -->
			<div class="m-row-mid-auto">
				<div class="x-label">渠道名称：</div>
				<div v-text="nodeName"></div>
			</div>

			<!-- 范围 -->
			<div class="m-row-mid-auto mt15">
				<div class="x-label">渠道覆盖范围<em>*</em>：</div>
				<div class="">
					<select class="form-control" v-model="form.range">
						<option value="3">3千米</option>
						<option value="5">5千米</option>
					</select>
				</div>
			</div>

			<div class="m-row-mid-auto mt15">
				<div class="x-label">　</div>
				<div>
					<button class="btn btn-primary" @click="saveChannelInfo">保存渠道信息</button>
				</div>
			</div>
		</div>

	</div>
	<div class="submit-btn-box mt10">
		<button class="btn btn-success" @click="saveTree">
			下一步
			<div class="loading-1 v-inline" v-show="loadingSave"></div>
		</button>
	</div>
</div>
</template>

<script>
import request from 'util/request.js';
import config from 'config';
import tool from 'util/tool.js';
const DEFAULT_RANGE = 3;
const FORM_CHANGE_TIP = '请先保存渠道信息';
const MAX_CHANNEL_COUNT = 5;
let methods = {};
methods.onClose = function () {
	return true;
};
methods.checkNodeInfo = function (node) {
	if (!this.isleafNode(node)) {
		return true;
	}
	// 范围, 位置
	if (!node.range) {
		return false;
	}
	return true;
};
methods.fetchTree = function () {
	this.curNode = null;
	this.treeData = 'loading';
	let p = {};
	// getChannelInfo
	request.queryChannelPasser(p).then((data) => {
		if (data) {
			data = this.fixData(data);
			data = this.initValue(data);
			this.treeData = data;
			this.oTreeData = data;
		} else {
			this.treeData = null;
		}
	}).catch((e) => {
		this.treeData = null;
	});
};

methods.onNodeClick = function (e, node) {
	if (this.curNode) {
		// 相同节点反复点 or 还没选中
		if (this.curNode.id === node.id || !node.checked) {
			this.$refs.tree.ztree.checkNode(node, !node.checked, true, true);
		}
	}

	this.curNode = node;
	this.form.range = node.range || DEFAULT_RANGE;
	this.oform = tool.extend({}, this.form);
};
methods.checkChannelInfo = function () {
	let fm = this.form;
	if (!fm.range) {
		return mlayer.msg('请选择渠道覆盖范围');
	}
	return true;
};
methods.updateChannelNode = function () {
	let fm = this.form;
	this.oform = tool.extend({}, fm);
	let curNode = this.curNode;
	if (curNode) {
		for (let k in fm) {
			curNode[k] = fm[k];
		}
		curNode.desc = this.getNodeDesc(curNode);
		if (curNode.highlight) {
			curNode.highlight = false;
		}
		this.$refs.tree.updateNode(curNode);
		tool.eachTree(this.oTreeData, (node) => {
			if (node.id == curNode.id) {
				node.range = curNode.range;
				node.desc = curNode.desc;
			}
		});
	}
};
methods.saveChannelInfo = function () {
	if (this.checkChannelInfo() !== true) {
		return;
	}
	let p = tool.extend({}, this.form);
	p.channelId = this.channelId;
	request.saveChannelPasser(p).then(() => {
		this.updateChannelNode();
		mlayer.iconMsg('保存成功！');
	}).catch((e) => {
		LOG(e);
		mlayer.msg('保存失败');
	});
};
// 保存
methods.saveTree = function () {
	if (this.isFormChanged()) {
		return mlayer.msg(FORM_CHANGE_TIP);
	}
	let channels = this.getSelectedChannels();
	if (channels.length > MAX_CHANNEL_COUNT) {
		return mlayer.msg('最多只能选择' + MAX_CHANNEL_COUNT + '个渠道');
	}
	// 检查渠道信息
	if (this.checkChannels(channels) === true) {
		// id, range
		let channelStr = channels.map((v) => {
			return v.id + ',' + v.range
		}).join('|');
		this.loadingSave = true;
		request.gisStationLacCells({channels: channelStr}).then((result) => {
			this.loadingSave = false;
			if (result.data && result.data.length) {
				let v1 = channels.map((v) => {
					return {id: v.id, range: v.range};
				});
				let v2 = result.data.map((v) => {
					return tool.transformLacCell(v.LACCELLID);
				});
				this.$emit('input', [v1, v2]);
				this.$emit('done');
			} else {
				mlayer.msg('获取基站列表失败');
			}
		}).catch((e) => {
			this.loadingSave = false;
			mlayer.msg('获取基站列表失败');
			LOG(e);
		});
		//this.$emit('input', [p1]);
		//this.$emit('done');
	}
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
	window.ChannelPassConfig = this;
	this.valueCopy = JSON.stringify(this.value[0] || []);
	this.fetchTree();
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		loadingSave: false,
		form: {
			range: DEFAULT_RANGE
		}
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
	mixins: [
		require('mixins/channel_config_layer.js')
	],
	beforeDestroy,
	components: {
	}
};
</script>

<style scoped lang="less">
</style>

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
				<div>
					<input type="text" class="form-control" placeholder="1-10" 
						v-model="form.range" />
				</div>
				<div class="pl10">千米</div>
			</div>
			<!-- 渠道具体位置 -->
			<div class="m-row-mid-auto mt15">
				<div class="x-label">渠道具体位置<em>*</em>：</div>
				<div>
					<textarea class="form-control" v-model="form.addr"
						placeholder="例如：新城区乌兰察布东街48号"></textarea>
				</div>
			</div>
			<!-- 优惠内容 
			<div class="m-row-mid-auto mt15">
				<div class="x-label">优惠内容<em>*</em>：</div>
				<div>
					<textarea class="form-control" v-model="form.content"
						placeholder="例如：赠送8G省内流量"></textarea>
				</div>
			</div>
			-->
			<div class="m-row-mid-auto mt15">
				<div class="x-label">　</div>
				<div>
					<button class="btn btn-primary" @click="saveChannelInfo">保存渠道信息</button>
				</div>
			</div>
		</div>

	</div>
	<div class="submit-btn-box mt10">
		<button class="btn btn-success" @click="saveTree">下一步</button>
	</div>
</div>
</template>

<script>
import request from 'util/request.js';
import config from 'config';
import tool from 'util/tool.js';

const FORM_CHANGE_TIP = '请先保存渠道信息';

let methods = {};
methods.onClose = function () {
	let list = this.getSelectedList().map(v => v.id);
	let vStr = JSON.stringify(list);
	// 没有变化
	if (vStr === this.valueCopy) {
		this.$emit('done');
		return true;
	}

	if (confirm('你有渠道勾选改动尚未保存，确定关闭吗？ (保存请点击下一步)')) {
		this.$emit('done');
		return true;
	}
	return false;
};
methods.fetchTree = function () {
	this.curNode = null;
	this.treeData = 'loading';
	let p = {};
	request.getChannelInfo(p).then((data) => {
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
		LOG(e);
	});
};
methods.checkNodeInfo = function (node) {
	if (!this.isleafNode(node)) {
		return true;
	}
	// 范围, 位置
	if (!node.range || !node.addr) {
		return false;
	}
	return true;
};
methods.onNodeClick = function (e, node) {
	if (this.curNode) {
		// 相同节点反复点 or 还没选中
		if (this.curNode.id === node.id || !node.checked) {
			this.$refs.tree.ztree.checkNode(node, !node.checked, true, true);
		}
	}

	this.curNode = node;
	this.form.range = node.range || '';
	this.form.addr = node.addr || '';
	this.oform = tool.extend({}, this.form);
};
methods.checkChannelInfo = function () {
	let fm = this.form;
	if (!fm.range) {
		return mlayer.msg('请输入渠道覆盖范围');
	}
	if (isNaN(fm.range)) {
		return mlayer.msg('请输入正确的渠道覆盖范围，1-10(千米)之间');
	}
	if (fm.range > 10 || fm.range < 1) {
		return mlayer.msg('渠道覆盖范围必须在1-10(千米)之间');
	}
	if (!fm.addr) {
		return mlayer.msg('请输入渠道具体位置');
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
				node.addr = curNode.addr;
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
	request.saveChannelInfo(p).then(() => {
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
	let list = this.getSelectedList();
	// 检查渠道信息
	if (this.checkChannels(list) === true) {
		this.$emit('input', list.map(v => v.id));
		this.$emit('done');
	}
};
let computed = {};

let watch = {};
const created = function () {};
const mounted = function () {
	window.ChannelAreaConfig = this;
	this.valueCopy = JSON.stringify(this.value);
	this.fetchTree();
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		form: {
			range: '',
			addr: ''
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

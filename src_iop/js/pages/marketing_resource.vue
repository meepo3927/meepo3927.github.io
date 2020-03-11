<template>
<div class="v-main" :class="{'left-hidden': leftHidden}">
	<div class="x-left">
		<div class="ztree" ref="tree"></div>
		<div class="loading-bar" v-show="loadingTree" >
			<img :src="loadingSrc" />
		</div>
	</div>
	<div class="x-right">
		<iframe :src="src" frameborder="0"></iframe>
		<a href="javascript:;" class="toggle-btn" @click="toggleLeft">
			<i class="fa" :class="[leftHidden ? 'fa-angle-right' : 'fa-angle-left']"></i>
		</a>
	</div>
	<iframe :src="ifmSrc" style="display: none;" @load="ifmOnload"></iframe>
</div>
</template>

<script>
import {request} from 'common';
import Tree from 'util/ztree';
import config from 'config';

const DEFAULT_SRC = 'about:blank';
let methods = {};
methods.ifmOnload = function () {
	this.initMenu();
};
methods.toggleLeft = function () {
	this.leftHidden = !this.leftHidden;
};
methods.findUrlNode = function (list) {
	if (!list || list.length === 0) {
		return {};
	}
	for (let i = 0; i < list.length; i++) {
		let children = list[i].children || [];
		for (let j = 0; j < children.length; j++) {
			let item = children[j];
			if (item.moduleUrl) {
				return item;
			}
		}
	}
	return {};
};
methods.transformResult = function (list, level = 0) {
	let nodes = [];
	(list || []).forEach((v, i) => {
		let open = false;
		if (level === 0 || i === 0) {
			open = true;
		}
		nodes.push({
			id: v.folderId,
			pId: v.parFolderId,
			name: v.folderName,
			moduleUrl: v.moduleUrl,
			appId: v.appId,
			folderId: v.folderId,
			open
		});
		nodes = nodes.concat(this.transformResult(v.children, level + 1));
	});
	return nodes;
};
methods.initMenu = function () {
	clearTimeout(this.initTimer);
	const onClick = (e, id, node) => {
		if (node.moduleUrl) {
			this.src = node.moduleUrl;
		} else {
			request.getPath(node).then((r) => {
				if (r.moduleUrl) {
					this.src = r.moduleUrl;
				}
			}).catch((e) => {
				
			});
		}
	};
	let setting = {
		data: {
			simpleData: {
				enable: true
			}
		}
	};
	this.getNodesRequest.then((r) => {
		this.loadingTree = false;
		let item = this.findUrlNode(r);
		this.tree = new Tree(this.$refs.tree, {
			nodes: this.transformResult(r),
			setting,
			onClick
		});
		let nodes = this.tree.z.getNodesByParam('id', item.folderId);
		// 默认选中
		if (nodes && nodes[0]) {
			this.tree.z.selectNode(nodes[0]);
		}
		if (item.moduleUrl) {
			this.src = item.moduleUrl;
		}
	});
};
let computed = {};
computed.mockNodes = function () {
	return [
		{id:1, pId:0, name:"资源监控", open:true},
		{id:101, pId:1, name:"系统空存资源"},
		{id:102, pId:1, name:"折扣折让资源"}
	];
};
computed.ifmSrc = function () {
	return config.BASS_SSO_URL || 'about:blank';
};
computed.loadingSrc = function () {
	return this.vImgPath + '/loading_bar.gif';
};
let watch = {};
const created = function () {
	this.getNodesRequest = request.getMenu('resourceCenterRPT');
};
const mounted = function () {
	this.initTimer = setTimeout(this.initMenu, 20 * 1000);
};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		src: DEFAULT_SRC,
		leftHidden: false,
		loadingTree: true
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
.v-main {
	position: relative;
    height: 100%;
}
@toggle-btn-width: 15px;
@left-width: 260px;
@left-hidden-width: 1px;
@left-border-color: #eee;
@container-bgcolor: #fff;
.x-left {
	position: absolute;
	left: 0;
	top: 0;
	width: @left-width;
	font-size: 14px;
	padding: 10px;
	overflow: hidden;

	background-color: @container-bgcolor;
	border-right: 1px solid @left-border-color;
	// height: 100vh;
    height: 100%;

	transition: all .5s ease;
}
.x-right {
	// height: 100vh;
    height: 100%;
	margin-left: @left-width;
	background-color: @container-bgcolor;
	transition: all .5s ease;
	position: relative;

	line-height: 0;
	font-size: 0;
	& > iframe {
		height: 100%;
	}
}

.toggle-btn {
	@my-height: 50px;
	position: absolute;
	top: 50%;
	margin-top: -(@my-height / 2);
	left: 0;
	display: inline-block;
	color: #333;
	font-size: 18px;
	height: @my-height;
	line-height: @my-height - 4;
	width: @toggle-btn-width;
	text-align: center;
	border: 1px solid @left-border-color;
	background-color: #ddd;
}
.v-main.left-hidden {
	& > .x-left {
		width: @left-hidden-width;
		padding-left: 0;
		padding-right: 0;
	}
	& > .x-right {
		margin-left: @left-hidden-width;
	}
}
.loading-bar {
	padding-top: 10px;
	text-align: center;
}
</style>

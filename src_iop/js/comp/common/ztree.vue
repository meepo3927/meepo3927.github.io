<template>
<div class="comp-ztree">
    <div class="loading-1" v-if="loading"></div>
    <ul class="ztree" :id="elemId" 
        ref="ztree"
        v-show="treeVisible"></ul>
</div>
</template>

<script>
import $ from 'jquery';
import 'lib/jquery.ztree.core.min.js';
import 'lib/jquery.ztree.excheck.min.js';
// import 'lib/jquery.ztree.exedit.min.js';
// import 'lib/jquery.ztree.exhide.min.js';
import tool from 'util/tool.js';

const defaultSetting = {
    data: {
        simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pId',
            rootPId: null
        }
    },
    view: {},
    callback: {}
};

let uuid = 1;
let methods = {};
methods.init = function (data) {
    data = data || this.data;
    let self = this;
    // 事件
    let callback = {};
    callback.onRightClick = function (e, treeId, treeNode) {
        self.$emit('rightclick', e, treeNode);
    };
    callback.onClick = function (e, treeId, treeNode) {
        self.$emit('click', e, treeNode);
    };
    
    let mySetting = {
        callback
    };
    let setting = tool.extend({}, defaultSetting, mySetting, this.setting);
    this.ztree = $.fn.zTree.init(
        $(this.$refs.ztree),
        setting,
        data
    );
};
methods.addNode = function (node, targetNode, position) {
    var index = -1;
    var parent = null;
    if (position === 'before') {
        index = targetNode.getIndex();
    } else if (position === 'after') {
        index = targetNode.getIndex() + 1;
    }

    if (position === 'before' || position === 'after') {
        parent = targetNode.getParentNode();
    } else if (position === 'inside') {
        parent = targetNode;
    }
    return this.ztree.addNodes(parent, index, node);
};
methods.move = function (moveNode, targetNode, moveType) {
    if (this.ztree) {
        return this.ztree.moveNode(targetNode, moveNode, moveType);
    }
    return false;
};
methods.updateNode = function (node) {
    if (this.ztree) {
        return this.ztree.updateNode(node);
    }
    return false;
};
methods.updateNodes = function (nodes) {
    nodes.forEach((node) => {
        this.ztree.updateNode(node);
    });
};
methods.refresh = function () {
    if (this.ztree) {
        return this.ztree.refresh();
    }
};
methods.remove = function (node) {
    if (this.ztree) {
        return this.ztree.removeNode(node);
    }
    return false;
};
methods.getCheckedNodes = function () {
    if (this.ztree) {
        return this.ztree.getCheckedNodes();
    }
    return [];
};
methods.getNodesArray = function () {
    if (this.ztree) {
        let nodes = this.ztree.getNodes();
        return this.ztree.transformToArray(nodes);
    }
    return [];
};
let computed = {};
computed.elemId = function () {
    return this.treeId || ('ztree' + this.id);
};
computed.loading = function () {
    return (this.data === 'loading');
};
computed.treeVisible = function () {
    if (!this.data) {
        return false;
    }
    if (this.loading) {
        return false;
    }
    return true;
};
computed.allowDrag = function () {
    return (this.drag === true || this.drag === 'true');
};
let watch = {};
watch.data = function (o) {
    if (typeof o === 'object' && o) {
        this.init(o);
    }
};
const beforeCreate = function () {
};
const created = function () {
};
const mounted = function () {
    window.zTree = this;
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        id: (uuid++)
    };
    return o;
};
export default {
    data: dataFunc,
    beforeCreate,
    created,
    methods,
    computed,
    watch,
    props: ['data', 'setting', 'treeId'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.comp-ztree {
    
}
</style>

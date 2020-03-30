<template>
<div class="comp-ztree">
    <div class="loading-1" v-if="loading"></div>
    <ul class="ztree" :id="elemId" ref="ztree" v-show="treeVisible"></ul>
</div>
</template>

<script>
import 'lib/jquery.ztree.all.min.js';
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
const ACTION_EVENTS = [
    'addNodes',
    'cancelEditName',
    'cancelSelectedNode',
    'checkAllNodes',
    'checkNode',
    'copyNode',
    'destroy',
    'editName',
    'expandAll',
    'expandNode',
    'getChangeCheckedNodes',
    'getCheckedNodes',
    'getNodeByParam',
    'getNodeByTId',
    'getNodeIndex',
    'getNodes',
    'getNodesByFilter',
    'getNodesByParam',
    'getNodesByParamFuzzy',
    'getSelectedNodes',
    'hideNode',
    'hideNodes',
    'moveNode',
    'reAsyncChildNodes',
    'reAsyncChildNodesPromise',
    'refresh',
    'removeChildNodes',
    'removeNode',
    'selectNode',
    'setChkDisabled',
    'setEditable',
    'showNode',
    'showNodes',
    'transformToArray',
    'transformTozTreeNodes',
    'updateNode'
];
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
    this.$nextTick(() => {
        this.$emit('ready', this.ztree);
    });
};
methods.dispose = function () {
    if (this.ztree) {
        this.ztree.destroy();
        this.ztree = null;
    }
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
methods.getNodesArray = function () {
    if (this.ztree) {
        let nodes = this.ztree.getNodes();
        return this.ztree.transformToArray(nodes);
    }
    return [];
};
for (let i = 0; i < ACTION_EVENTS.length; i++) {
    let action = ACTION_EVENTS[i];
    methods[action] = function () {
        if (this.ztree) {
            return this.ztree[action].apply(this.ztree, arguments);
        }
    };
}
let computed = {};
computed.elemId = function () {
    return this.treeId || ('ztree' + this.id);
};
computed.loading = function () {
    return (this.data === undefined);
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
let watch = {};
watch.data = function (o) {
    if (typeof o === 'object' && o) {
        this.init(o);
    } else if (o === undefined || o === null) {
        this.dispose();
    }
};
const created = function () {};
const mounted = function () {
    if (this.data && typeof this.data === 'object') {
        this.init(this.data);
    }
};
const beforeDestroy = function () {
    this.dispose();
};
const dataFunc = function () {
    let o = {
        id: (uuid++)
    };
    return o;
};
export default {
    data: dataFunc,
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

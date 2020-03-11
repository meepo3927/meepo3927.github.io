const tool = require('util/tool.js');
const FORM_CHANGE_TIP = '请先保存渠道信息';
const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};

const isNodeMatch = (node, keyword) => {
    return (node.name.indexOf(keyword) >= 0);
};
const tripEmptyParent = (tree, keyword) => {
    tool.eachTree(tree, (node, parent, index) => {
        if (!isNodeMatch(node, keyword) && node.children && node.children.length === 0) {
            if (parent) {
                parent.children.splice(index, 1);
            }
        }
    });
};
const isleaf = (node) => {
    return (!node.children) || (node.children.length === 0);
};
let methods = {};
methods.isFormChanged = function () {
    if (!this.oform) {
        return false;
    }
    for (let i in this.oform) {
        if (this.oform[i] !== this.form[i]) {
            return true;
        }
    }
    return false;
};
methods.fixData = function (data) {
    data.open = true;
    // 默认展开前两层
    if (data.children) {
        data.children.forEach((node) => {
            node.open = true;
        });
    }
    // 字段desc
    tool.eachTree(data, (node) => {
        node.desc = this.getNodeDesc(node);
    });
    return data;
};
methods.clearKeyword = function () {
    this.keyword = '';
    if (this.mode !== 'all') {
        this.searchTree();
    }
};
methods.isleafNode = function (node) {
    return isleaf(node);
};
methods.getFontCSS = function (treeId, node) {
    const RED_COLOR = '#CD0000';
    if (node.highlight) {
        return {
            'color': RED_COLOR,
            'font-weight': 'bold'
        };
    }
    if (!this.checkNodeInfo(node)) {
        return {
            'color': RED_COLOR,
            'font-weight': 'normal'
        };
    }
    return {
        'color': '#333',
        'font-weight': 'normal'
    };
};
methods.getNodeDesc = function (node) {
    let arr = [node.name];
    if (node.range) {
        arr.push(node.range + '千米');
    }
    if (node.addr) {
        arr.push(node.addr);
    }
    return arr.join(' ');
};
methods.getFilteredTree = function (keyword) {
    let o = JSON.parse(JSON.stringify(this.oTreeData));
    tool.eachTree(o, (node, parent, index) => {
        // 不匹配的叶子节点
        if (!isNodeMatch(node, keyword) && isleaf(node)) {
            if (parent && parent.children) {
                parent.children.splice(index, 1);
            }
        }
    });
    // 剔除空数组
    tripEmptyParent(o, keyword);
    tripEmptyParent(o, keyword);
    if (o.children.length === 0) {
        return null;
    }
    return o;
};
methods.saveCheckedStatus = function () {
    if (!this.refs.tree.ztree) {
        return;
    }
    let map = this.allCheckedNodesMap;
    let nodes = this.$refs.tree.ztree.getNodes();
    nodes.forEach((root) => {
        tool.eachTree(root, (node) => {
            if (node.checked || node.halfCheck) {
                map[node.id] = true;
            } else {
                map[node.id] = false;
            }
        });
    });
};
methods.setCheckedStatus = function (tree) {
    let map = this.allCheckedNodesMap;
    tool.eachTree(tree, (node) => {
        let id = node.id;
        if (map[id] === true) {
            node.checked = true;
        } else if (map[id] === false) {
            node.checked = false;
        }
    });
};
methods.searchTree = function () {
    if (this.isFormChanged()) {
        return mlayer.msg(FORM_CHANGE_TIP);
    }
    this.saveCheckedStatus();
    this.curNode = null;
    if (!this.oTreeData) {
        return;
    }
    let kw = this.keyword.trim();
    if (kw) {
        this.mode = 'part';
    } else {
        this.mode = 'all';
    }
    let tree = this.getFilteredTree(kw);
    this.setCheckedStatus(tree);
    this.treeData = tree;
};
methods.initValue = function (data) {
    let map = this.allCheckedNodesMap;
    if (this.value) {
        if (Array.isArray(this.value[0])) {
            this.value[0].forEach((item) => {
                if (typeof item === 'string') {
                    map[item] = true;
                } else if ((typeof item === 'object') && item.id) {
                    map[item.id] = true;
                }
            });
        } else {
            this.value.forEach((id) => {
                map[id] = true;
            });
        }
    }
    this.setCheckedStatus(data);
    return data;
};
methods.checkChannels = function (list) {
    if (list.length === 0) {
        return mlayer.msg('请至少选择一个渠道');
    }
    let map = {};
    list.forEach((node) => {
        map[node.id] = true;
    });
    let wrongCount = 0;
    tool.eachTree(this.oTreeData, (node) => {
        if (map[node.id] && !this.checkNodeInfo(node)) {
            wrongCount++;
        }
    });
    let nodes = this.$refs.tree.getNodesArray();
    let highlightNodes = [];
    let firstParent = true;
    nodes.forEach((node) => {
        if (map[node.id] && !this.checkNodeInfo(node)) {
            // 高亮
            node.highlight = true;
            highlightNodes.push(node);
            // 父级 自动展开
            let parent = node.getParentNode();
            if (parent && !parent.open) {
                this.$refs.tree.ztree.expandNode(parent, true, false, firstParent);
                firstParent = false;
            }
        }
    });
    // 高亮
    if (highlightNodes.length) {
        this.$refs.tree.updateNodes(highlightNodes);
    }
    // 有错误
    if (wrongCount) {
        return mlayer.msg('选择的渠道中有' + wrongCount + '个需要完善渠道信息');
    }
    return true;
};
methods.highlightNode = function (node, b) {
    node.highlight = !!b;
    this.$refs.tree.updateNode(node);
};
methods.getSelectedList = function () {
    let list = [];

    if (this.mode === 'all') {
        let nodes = this.$refs.tree.getCheckedNodes();
        nodes.forEach((node) => {
            // 只要叶子节点
            if (isleaf(node)) {
                list.push(node);
            }
        });
    } else {
        this.saveCheckedStatus();
        let map = this.allCheckedNodesMap;
        tool.eachTree(this.oTreeData, (node) => {
            if (map[node.id] === true && isleaf(node)) {
                list.push(node);
            }
        });
    }
    return list;
};
methods.getSelectedChannels = function () {
    return this.getSelectedList().map(v => {
        return {
            id: v.id,
            range: v.range
        }
    });
};
let computed = {};
computed.treeSetting = function () {
    let self = this;
    return {
        check: {
            enable: true,
            autoCheckTrigger: true
        },
        data: {
            key: {
                name: 'desc'
            }
        },
        view: {
            fontCss: this.getFontCSS
        },
        callback: {
            onCheck: function (e, treeId, node) {
                if (!node.checked && node.highlight) {
                    node.highlight = false;
                    self.$refs.tree.updateNode(node);
                }
            },
            beforeClick: function () {
                let changed = self.isFormChanged();
                if (changed) {
                    mlayer.msg(FORM_CHANGE_TIP);
                    return false;
                }
            }
        }
    }
};
computed.oNode = function () {
    return this.curNode || {};
};
computed.channelId = function () {
    return this.oNode.id;
};
computed.nodeName = function () {
    return this.oNode.name;
};
computed.formVisible = function () {
    if (this.curNode && isleaf(this.curNode)) {
        return true;
    }
    return false;
};
module.exports = {
    props: ['value'],
    data: function () {
        var o = {
            curNode: null,
            allCheckedNodesMap: {},
            keyword: '',
            treeData: undefined,
            mode: 'all'
        };
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    components: {
        'ztree': require('comp/common/ztree.vue')
    }
};

var $ = require('jquery');
var zTree = require('ztree');
var tool = require('util/tool');
let UID = 100000;

function Tree(elem, options = {}) {
    if (!elem) {
        return;
    }
    this.elem = elem;
    this.options = options;
    this.setNodeId();

    let $elem = $(elem);
    this.$elem = $elem;
    let defaults = {
        callback: {}
    };
    let setting = tool.extend(defaults, options.setting);
    // 快捷方式
    if (options.onClick) {
        setting.callback.onClick = options.onClick;
    }

    this.z = $.fn.zTree.init($elem, setting, options.nodes);
}
var proto = Tree.prototype;
proto.setNodeId = function () {
    if (!this.elem.id) {
        this.elem.id = 'my_ztree_' + (++UID);
    }
};

module.exports = Tree;
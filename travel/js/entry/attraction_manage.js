/**
 * 景区管理
 */
const Vue = require('vue');
var inspinia = require('comp/inspinia_init.js');
var mlayer = require('mlayer');
var arcgisUtil = require('util/manage_arcgis.js');
var chosen = require('lib/chosen.jquery.js');
var config = require('global/config.js');
var global = window.global || {};

var vData = {
    attractionlist: [],
    view: {
        addFormVisible: false,
        loadingVisible: false,
        showCitySelect: true
    },
    formAdd: {
        name: ''
    },
    keyword: ''
};

var vMethods = {};
vMethods.editStationClose = function () {
    this.loadData({reload: true});
};
vMethods.showAddForm = function () {
    this.view.addFormVisible = !this.view.addFormVisible;
};

vMethods.addAttraction = function () {
    // 浮层已弹出
    var name = this.formAdd.name;
    if (!name) {
        return mlayer.msg('请输入景区名称');
    }
    var onClose = () => {
        this.cleanAddForm();
        this.loadData({reload: true});
    };
    arcgisUtil.openIframe({
        name,
        type: 'add'
    }, {
        title: '新增景区',
        onClose: onClose
    });
};

vMethods.cleanAddForm = function () {
    this.formAdd.name = '';
};
vMethods.removeAttraction = function (item) {
    var index = this.attractionlist.indexOf(item);
    this.attractionlist.splice(index, 1);
};
vMethods.bind = function () {
};
vMethods.render = function (list) {
    // 根据sceneryId聚合
    list.forEach((item) => {
        item.childrenVisible = false;
        item.modeEdit = false;
        item.nameForEdit = item.sceneryName;
        item.loading = false;
        item.children = item.children || [];
    });

    this.attractionlist = list;
};

var vComputed = {};
// 过滤 by keyword
vComputed.attractions = function () {
    var word = this.keyword ? this.keyword.trim() : '';
    if (!word) {
        return this.attractionlist;
    }
    if (!this.attractionlist || !this.attractionlist.length) {
        return [];
    }
    var list = [];
    this.attractionlist.forEach(function (a) {
        if (a.sceneryName.indexOf(word) >= 0) {
            list.push(a);
            return;
        }
        var find = false;
        a.children && a.children.forEach(function (station) {
            if (find) {
                return;
            }
            if (station.cellName.indexOf(word) >= 0) {
                list.push(a);
                find = true;
                return;
            }
        });
    });

    return list;
};
var fetchData = function () {
    var p = $.Deferred();
    let url = config.ajaxPath;
    let action = '/sceneryInfo/getSceneryInfo.action';
    if (config.ajaxlocal) {
        url = global.basePath + action;
    }
    $.ajax({
        url,
        dataType: 'json',
        data: {
            action: '/sceneryInfo/getSceneryInfo.action',
            cityId: global.cityId
        },
        success: function (result) {
            if (result.resultList) {
                p.resolve(result.resultList);
            } else if (result.data) {
                p.resolve(result.data);
            } else {
                p.reject();
            }
        },
        error: function () {
            p.reject();
        }
    });
    return p;
};

vMethods.loadData = function (options = {}) {
    this.view.loadingVisible = true;
    if (options.reload) {
        this.render([]);
    }
    var self = this;
    // 初始化attraction list
    fetchData().then(function (list) {
        self.view.loadingVisible = false;
        self.render(list);
    }, function () {
        self.view.loadingVisible = false;
    });
};
var onReady = function () {
    $('#citySelect').chosen({
        width: 160
    });
    var self = this;
    this.loadData();
    this.bind();
};
var watch = {};

window.AttractionManage = new Vue({
    el: '#wrapper',
    data: vData,
    watch: watch,
    methods: vMethods,
    computed: vComputed,
    mounted: onReady,
    mixins: [
        require('mixins/sidemenu.js')
    ],
    components: {
        'attraction-table': require('comp/manage/attraction_table.vue')
    }
});


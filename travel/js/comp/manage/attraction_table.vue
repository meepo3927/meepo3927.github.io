<template>
<table class="" id="attraction_table">
    <thead>
        <tr>
            <th class="col-1"></th>
            <th class="col-2">景区ID</th>
            <th class="col-3">景区名称</th>
            <th>操作人</th>
            <th class="col-5">操作</th>
        </tr>
    </thead>
    <tbody>
        <template v-for="item in list" v-if="list.length" >
            <tr :key="item.sceneryId">
                <td class="col-1">
                    <a href="javascript:;" class="show-children-btn" @click="showChildren(item, $event)" >
                        <i class="fa" :class="[item.childrenVisible ? 'fa-minus-square' : 'fa-plus-square']"></i>
                    </a>
                </td>
                <td v-text="item.sceneryId"></td>
                <td class="col-scenery-name">
                    <span v-show="item.modeEdit">
                        <input type="text" v-model="item.nameForEdit" class="input-text input-edit-name" 
                            @keydown.enter="editAttractionConfirm(item)" />
                        <button class="btn btn-primary ml10" type="button" 
                            @click="editAttractionConfirm(item)">确定</button>
                        <button class="btn ml10" type="button" 
                            @click="editAttractionCancel(item)">取消</button>

                    </span>

                    <span v-text="item.sceneryName" v-show="!item.modeEdit"></span>

                    <a href="javascript:;" class="fr" @click="beginEditAttraction(item)">修改</a>
                </td>
                <td v-text="item.operatorCode"></td>
                <td>
                    <a href="javascript:;" @click="remove(item)" class="">删除</a>
                </td>
            </tr>
            <tr v-show="item.childrenVisible" 
                :key="item.sceneryId + '-children'"
                class="children-tr">
                <td colspan="5">
                    <table is="station-table" 
                        :stations="item.children" 
                        :attraction="item"
                        :loading="item.loading"
                        @edit-station-close="editStationClose"></table>
                </td>
            </tr>
        </template>
        <tr v-show="showAttractionEmpty">
            <td colspan="5" class="tac">没有内容</td>
        </tr>
        <tr v-show="view.loadingVisible">
            <td colspan="5" class="tac">
                <img :src="vImgPath + '/loading.gif'" alt="">
            </td>
        </tr>
    </tbody>
    <tfoot v-show="showPaging">
        <tr>
            <td colspan="5">
                <pagination class="table-paging" :cur-page="curPage" :total-page="totalPage" @click="changePage"/>
            </td>
        </tr>
    </tfoot>
</table>
</template>

<script>
import arcgisUtil from 'util/manage_arcgis.js';
import request from 'util/request.js';
import config from 'global/config';

const checkAttractionName = (name) => {
    if (name.trim() === '') {
        return '名称不能为空';
    }

    return true;
};
const NUM_PER_PAGE = 20;
var methods = {};
methods.editStationClose = function () {
    this.$emit('edit-station-close');
};

methods.requestChild = function (item) {
    let p = {
        sceneryId: item.sceneryId
    };
    request.getSceneryDetail(p).then((r) => {
        item.children = r;
        item.childrenVisible = true;
        item.loading = false;
    }).catch(() => {
        item.loading = false;
    });
};
methods.showChildren = function (item, e) {
    if (item.loading) {
        return false;
    }
    if (!item.children || !item.children.length) {
        this.requestChild(item);
    } else {
        item.childrenVisible = !item.childrenVisible;
    }

};
// 编辑景区
methods.beginEditAttraction = function (item) {
    // item.modeEdit = true;
    // LOG(item);
    location.href = this.getStaticUrl('/modify_scenery', 'id=' + item.sceneryId);
};
methods.remove = function (item) {
    if (!confirm('确定删除该景区以及所有基站信息吗？')) {
        return false;
    }
    const success = () => {
        let data = {
            action: '/sceneryInfo/delete.action',
            sceneryId: item.sceneryId
        };
        request.fetch({data}).then((result) => {
            mlayer.iconMsg('删除成功');
            this.$emit('remove', item);
        }, fail);
    };
    const fail = () => {
        mlayer.msg('删除失败，请稍后再试');
    };
    arcgisUtil.notice({
        optType: 'del',
        sceneryId: item.sceneryId
    }).success((r) => {
        if (r.success) {
            success();
        } else {
            fail();
        }
    }).error(fail);
};
// 修改名称 - 确定
methods.editAttractionConfirm = function (item) {
    var check = checkAttractionName(item.nameForEdit);
    if (check !== true) {
        return mlayer.msg(check);
    }
    let data = {
        action: '/sceneryInfo/updateSceneryName.action',
        sceneryId: item.sceneryId,
        sceneryName: item.nameForEdit
    };

    request.fetch({data}).then((data, result) => {
        item.sceneryName = item.nameForEdit;
        mlayer.iconMsg('修改成功');
        item.modeEdit = false;

        arcgisUtil.notice({
            optType: 'editName',
            sceneryId: item.sceneryId,
            sceneryName: item.nameForEdit
        });
    }, () => {
        mlayer.msg('修改失败');
    });
};
methods.editAttractionCancel = function (item) {
    item.nameForEdit = item.sceneryName;
    item.modeEdit = false;
};
// 翻页
methods.changePage = function (v) {
    if (v === this.curPage) {
        return;
    }
    this.curPage = v;
};
var computed = {};
computed.totalPage = function () {
    if (!this.attractions || !this.attractions.length) {
        return 1;
    }
    var len = this.attractions.length;
    return Math.floor((len - 1) / NUM_PER_PAGE) + 1;
};
computed.list = function () {
    if (!this.attractions || !this.attractions.length) {
        return [];
    }
    let start = (this.curPage - 1) * NUM_PER_PAGE;
    let end = start + NUM_PER_PAGE;
    return this.attractions.slice(start, end);
};
computed.showAttractionEmpty = function () {
    if (this.view.loadingVisible) {
        return false;
    }
    var a = this.list;
    if (!a || !a.length) {
        return true;
    }
    return false;
};
computed.showPaging = function () {
    if (this.view.loadingVisible || this.showAttractionEmpty) {
        return false;
    }
    if (this.list.length === 0) {
        return false;
    }
    return true;
};
var mounted = function () {};
const beforeDestroy = function () {};
let dataFunc = function () {
    var o = {
        curPage: 1
    };
    return o;
};
let watch = {};
watch.keyword = function () {
    this.curPage = 1;
};
export default {
    data: dataFunc,
    methods,
    watch,
    computed,
    props: ['attractions', 'view', 'keyword'],
    mounted,
    beforeDestroy,
    components: {
        'pagination': require('./pagination.vue'),
        'station-table': require('./station_table.vue')
    }
};
</script>

<style scoped lang="less">
.table {
    .children-tr > td {
        border: none;
    }
    & > tfoot {
        .table-paging {
            margin-top: 0;
            margin-bottom: 0;
        }
    }
}
.input-edit-name {
    width: 410px;
}
</style>
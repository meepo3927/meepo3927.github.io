<template>
<table class="table m-table m-hover event-list-table">
    <thead>
        <tr class="tr-th-center">
            <th>
                <input type="checkbox" @change="changeAll($event)" />
            </th>
            <th class=" ">营销活动ID</th>
            <th class=" ">营销活动名称</th>
            <th class=" ">启停状态</th>
            <th class=" ">触点类型</th>
            <th>优先级</th>
            <th class=" ">操作</th>
        </tr>
    </thead>
    <tbody v-if="!listEmpty">
        <tr v-for="item in mylist" :key="item" class="tr-td-center" 
            @click="onTrClick($event, item)">
            <td>
                <input type="checkbox" v-model="item.checked" />
            </td>
            <td v-text="item.marketingActId"></td>
            <td v-text="item.marketingActDesc" ></td>
            <td v-text="item.startStopDesc" :class="[getActiveColorClass(item)]"></td>
            <td class="">
                <span v-text="item.contactDesc" ></span>
            </td>
            <td  class="">
                <span v-text="item.priorityDesc" v-show="!item.isModeEdit"></span>
                <v-chosen v-if="item.isModeEdit" :options="prioritySelectOptions"
                    v-model="item.priorityForEdit" />

                <button type="button" class="btn btn-primary ml10" v-if="item.isModeEdit" 
                    @click="modifyPriorityConfirm(item)">确定</button>
                <button type="button" class="btn btn-default ml10" v-if="item.isModeEdit" 
                    @click="modifyPriorityCancel(item)">取消</button>
            </td>
            <td class="">
                <a href="javascript:;" v-if="startVisible(item)" @click="startIt(item)">启用</a>
                <a href="javascript:;" v-else @click="stopIt(item)">停用</a>

                <a href="javascript:;" @click="modifyPriority(item)" class="ml20">修改优先级</a>
            </td>
        </tr>
    </tbody>
    <!-- 空 -->
    <tbody v-if="listEmpty && !loading" is="table-empty" :colspan="columnCount"></tbody>
    <!-- loading -->
    <tfoot v-show="loading" is="table-loading" :colspan="columnCount" ></tfoot>
</table>
</template>

<script>

var methods = {};
methods.changeAll = function (e) {
    let elem = e.target;
    let val = elem.checked;
    this.list.forEach((item) => {
        item.checked = val;
    });
};
methods.onTrClick = function (e, item) {
    let target = e.target;
    const t = () => {
        item.checked = !item.checked;
    };
    if (target.tagName === 'TD') {
        return t();
    }
    if (target.tagName === 'SPAN') {
        let p = target.parentNode || target.parentElement;
        if (p && p.tagName === 'TD') {
            return t();
        }
    }
};
methods.modifyPriorityConfirm = function (item) {
    let p = {
        marketingActId: item.marketingActId,
        contactId: item.contactId,
        priority: item.priorityForEdit
    };
    const url = Request.ajaxUrlBase + '/contact/changePriority.action';
    Request.op(url, p).then((r) => {
        item.priority = item.priorityForEdit;
        item.priorityDesc = Config.contactPriorityHash[item.priority];
        item.isModeEdit = false;
        mlayer.iconMsg(r.msg || '修改成功！');
        // this.delayRefresh();
    }, () => {
        mlayer.msg(Config.msg.opfail);
    });
};
methods.modifyPriorityCancel = function (item) {
    item.isModeEdit = false;
};
methods.getActiveColorClass = function (item) {
    if (this.startVisible(item)) {
        return 'text-warning';
    }
    return 'text-success';
};
methods.startVisible = function (item) {
    return (item.startStopDesc !== '启用');
};
methods.stopIt = function (item) {
    let p = {
        marketingActId: item.marketingActId,
        contactId: item.contactId,
        startStopFlag: 0
    };
    const url = Request.ajaxUrlBase + '/contact/changeStartStop.action';
    Request.op(url, p).then(() => {
        mlayer.iconMsg('操作成功');
        this.delayRefresh();
    }, () => {
        mlayer.msg(Config.msg.opfail);
    });
};
methods.startIt = function (item) {
    let p = {
        marketingActId: item.marketingActId,
        contactId: item.contactId,
        startStopFlag: 1
    };
    const url = Request.ajaxUrlBase + '/contact/changeStartStop.action'
    Request.op(url, p).then(() => {
        mlayer.iconMsg('操作成功');
        this.delayRefresh();
    }, () => {
        mlayer.msg(Config.msg.opfail);
    });
};
methods.modifyPriority = function (item) {
    item.isModeEdit = true;
};

var computed = {};
computed.prioritySelectOptions = function () {
    const arr = [];
    for (let i in Config.contactPriorityHash) {
        arr.push({
            text: Config.contactPriorityHash[i],
            value: i
        });
    }
    return arr;
};
computed.columnCount = function () {
    return 7;
};
const created = function () {};
var mounted = function () {};
export default {
    data: function () {
        return {};
    },
    created,
    methods,
    computed,
    props: ['list', 'loading'],
    mounted,
    mixins: [
        require('comp/table/mixin.js')
    ]
};
</script>

<style scoped lang="less">
</style>
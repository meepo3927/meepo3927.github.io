<template>
<div class="page-acct-unlock">
    <h2>账号解锁后台管理</h2>
    <table class="table-2 mt20">
        <thead>
            <tr>
                <th class="col-index">序号</th>
                <th class="col-acct">账号</th>
                <th class="col-status">状态</th>
                <th class="col-op">操作</th>
            </tr>
        </thead>
        <tbody v-if="dataReady">
            <tr v-for="(v, i) in list">
                <td class="col-index" v-text="i + 1"></td>
                <td class="col-acct" v-text="v"></td>
                <td class="col-status">已锁定</td>
                <td class="col-op">
                    <button class="btn" type="button" 
                        @click="unlock(v)">解锁</button>
                </td>
            </tr>
        </tbody>
        <tfoot v-if="loading">
            <tr>
                <td colspan="4"><div class="loading-1 m-center"></div></td>
            </tr>
        </tfoot>
        <tfoot v-if="dataEmpty">
            <tr>
                <td colspan="4" class="empty-cell">没有锁定的账号</td>
            </tr>
        </tfoot>
    </table>
</div>
</template>

<script>
import {config, mlayer, request} from 'root';
//锁定帐号查询接口：http://localhost:8080/TD-nmtravel-web/user/login/retry/locked
//帐号锁定状态恢复接口：http://localhost:8080/TD-nmtravel-web/user/login/retry/delete/admin
let methods = {};
methods.fetchRender = function () {
    this.list = undefined;
    request.REST('/user/login/retry/locked').then((data) => {
        this.list = data;
    }).catch(() => {
        this.list = [];
    });
};
methods.unlock = function (v) {
    if (!confirm('确定解锁' + v + '账号吗？')) {
        return;
    }
    request.REST('/user/login/retry/delete/' + v).then((result) => {
        mlayer.msg('解锁成功！');
        setTimeout(this.fetchRender, 800);
    }).catch((e) => {
        mlayer.msg('解锁失败');
    });
};
let computed = {};
computed.dataReady = function () {
    return Array.isArray(this.list) && (this.list.length);
};
computed.loading = function () {
    return (this.list === undefined);
};
computed.dataEmpty = function () {
    return Array.isArray(this.list) && (this.list.length === 0);
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: undefined
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
.page-acct-unlock {
    padding: 10px;
}
.col-index {
    width: 90px;
}
td.col-index {
    text-align: center;
}
th.col-acct {
    text-align: left;
}
.col-acct {
    padding-left: 14px;
}
.col-status {
    width: 120px;
}
td.col-status {
    text-align: center;
}
td.empty-cell {
    text-align: center;
}
th.col-op {
    text-align: left;
}
.col-op {
    width: 120px;
}
</style>

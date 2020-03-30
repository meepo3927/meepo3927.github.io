<template>
<div class="page-audit-account">
    <h1>东方万里大数据平台 - 体验账号管理</h1>

    <div class="main-wrapper mt25">
        <div class="condition-box">
            <div class="m-row-mid-auto">
                <label for="nameMobileInput" >姓名/手机号：</label>
                <div class="pl10">
                    <input type="text" class="form-control name-mobile-input" 
                        id="nameMobileInput" v-model="keyword"
                        placeholder="根据姓名/手机号模糊匹配" />
                </div>

                <label class="pl30">申请时间：</label>
                <div class="pl10">
                    <v-date class="form-control date-input" v-model="startDate" />
                </div>
                <div class="ph10">至</div>
                <div>
                    <v-date class="form-control date-input" v-model="endDate" />
                </div>

                <label class="pl25">状态：</label>
                <div class="pl10">
                    <select class="form-control status-sel" v-model="status">
                        <option value="">全部</option>
                        <option v-for="(v, k) in statusTextMap" v-text="v" ></option>
                    </select>
                </div>

                <div class="pl50">
                    <button class="btn btn-primary" type="button" 
                        @click="onQueryClick">查询</button>
                </div>
            </div>
        </div>

        <!-- 数据 -->
        <table class="my-table mt25" >
            <thead>
                <tr>
                    <th class="col-index">序号</th>
                    <th>申请人</th>
                    <th class="col-mobile">手机号</th>
                    <th>邮箱</th>
                    <th class="col-company">所属单位</th>
                    <th class="col-datetime">申请时间</th>
                    <th class="text-center">剩余生效时间</th>
                    <th>体验产品</th>
                    <th class="col-status">状态</th>
                    <th class="col-op">操作</th>
                </tr>
            </thead>
            <tbody v-if="mlist">
                <tr v-for="(v, i) in mlist">
                    <td v-text="getNO(i)" class="text-center"></td>
                    <td v-text="v.name"></td>
                    <td v-text="v.mobilePhone"></td>
                    <td v-text="v.email"></td>
                    <td v-text="v.company"></td>
                    <td v-text="v.appTime"></td>
                    <td v-text="getExpireText(v)" class="text-center"></td>
                    <td v-text="productName"></td>
                    <td :class="[getStatusClass(v.flag)]">
                        <span v-text="v.flag"></span>
                    </td>
                    <td>
                        <!-- 待审核 -->
                        <button class="btn btn-primary" @click="open(v)"
                            v-show="v.flag == STATUS_WAIT">开通账号</button>
                        <button class="btn btn-warning ml10" @click="reject(v)"
                            v-show="v.flag == STATUS_WAIT">拒绝</button>
                        <!-- 已开通 -->
                        <button class="btn btn-info" @click="modify(v)"
                            v-show="v.flag == STATUS_PASSED">修改有效期</button>
                        <button class="btn btn-danger ml10" @click="stop(v)"
                            v-show="v.flag == STATUS_PASSED">停用账号</button>
                        <!-- 已拒绝 -->
                        <button class="btn btn-success" @click="open(v)"
                            v-show="v.flag == STATUS_REJECTED">开通账号</button>
                        <button class="btn btn-default ml10" @click="remove(v, i)"
                            v-show="v.flag == STATUS_REJECTED">删除</button>

                        <!-- 已拒绝 -->
                        <button class="btn btn-success" @click="open(v)"
                            v-show="v.flag == STATUS_INVALID">开通账号</button>
                        <button class="btn btn-default ml10" @click="remove(v, i)"
                            v-show="v.flag == STATUS_INVALID">删除</button>

                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr v-if="mlist === undefined">
                    <td colspan="10" class="loading-cell">
                        <div class="loading-1"></div>
                    </td>
                </tr>
                <tr v-if="mlist === null || (mlist && mlist.length === 0)">
                    <td colspan="10" class="text-center">
                        <span class="text-muted">暂无数据</span>
                    </td>
                </tr>
            </tfoot>
        </table>

        <v-pagination class="mt30" :cur-page="curPage" :total-page="totalPage" 
            @change="onPageChange" />
    </div>

    <center-layer v-if="openAccountVisible">
        <div class="center-layer-inner-1">
            <h3 >开通体验账号</h3>
            <a href="javascript:;" class="layer-close-btn" @click="closeAccount">
                <i class="glyphicon glyphicon-remove"></i>
            </a>

            <div class="m-row-mid-auto mt30">
                <label class="col-lb-1">申请人：</label>
                <div class="col-text-1" v-text="curAccount.name"></div>

                <label for="">手机号：</label>
                <div class="col-text-2" v-text="curAccount.mobilePhone"></div>
            </div>


            <div class="m-row-mid-auto mt20">
                <label class="col-lb-1">邮箱：</label>
                <div class="col-text-1" v-text="curAccount.email"></div>

                <label for="">体验平台：</label>
                <div class="col-text-2" v-text="productName"></div>
            </div>

            <div class="m-row-mid-auto mt20">
                <label class="col-lb-1">有效期：</label>
                <div >
                    <select class="form-control" v-model="createForm.expire">
                        <option v-for="(v, i) in expireOptions" :value="v.value" 
                            v-text="v.name" ></option>
                    </select>
                </div>
                <div class="pl20 text-muted">
                    时间从开通时开始计算
                </div>
            </div>

            <div class="layer-btn-box mt30">
                <button class="btn btn-primary" @click="submitAccount">
                    开通
                    <img v-show="createForm.loading" class="button-loading-img" 
                        :src="getImageUrl('/loading.gif')" />
                </button>
                <button class="btn btn-default ml40" @click="closeAccount">取消</button>
            </div>
        </div>
    </center-layer><!-- 开通 -->

    <center-layer v-if="modifyAccountVisible">
        <div class="center-layer-inner-1">
            <h3 >修改账号</h3>
            <a href="javascript:;" class="layer-close-btn" @click="closeModifyAccount">
                <i class="glyphicon glyphicon-remove"></i>
            </a>

            <div class="m-row-mid-auto mt30">
                <label class="col-lb-1">申请人：</label>
                <div class="col-text-1" v-text="curAccount.name"></div>

                <label for="">手机号：</label>
                <div class="col-text-2" v-text="curAccount.mobilePhone"></div>
            </div>

            <div class="m-row-mid-auto mt20">
                <label class="col-lb-1">邮箱：</label>
                <div class="col-text-1" v-text="curAccount.email"></div>

                <label for="">体验平台：</label>
                <div class="col-text-2" v-text="productName"></div>
            </div>

            <div class="m-row-mid-auto mt20">
                <label class="col-lb-1">失效时间：</label>
                <div class="col-text-1" v-text="getExpireText(curAccount)"></div>
            </div>


            <div class="m-row-mid-auto mt20">
                <label class="col-lb-1">有效期：</label>
                <div >
                    <select class="form-control" v-model="modifyForm.expire">
                        <option v-for="(v, i) in expireOptions" :value="v.value" 
                            v-text="v.name" ></option>
                    </select>
                </div>
                <div class="pl20 text-muted">
                    时间从开通时开始计算
                </div>
            </div>

            <div class="layer-btn-box mt30">
                <button class="btn btn-primary" @click="submitModifyAccount">
                    提交
                    <img v-show="modifyForm.loading" class="button-loading-img" 
                        :src="getImageUrl('/loading.gif')" />
                </button>
                <button class="btn btn-default ml40" @click="closeModifyAccount">取消</button>
            </div>
        </div>
    </center-layer><!-- 开通 -->
</div>
</template>

<script>
const Calendar = require('util/calendar.js');
let methods = {};
methods.onQueryClick = function () {
    this.curPage = 1;
    this.fetchRender();
};
methods.fetchRender = function () {
    let p = {
        startTime: this.startDate,
        endTime: this.endDate
    };
    let req = this.vRequest.queryAccount(p);
    this.datalist = undefined;
    this.setPromise('queryAccount', req).then((data) => {
        this.datalist = data;
    }).catch(() => {
        this.datalist = null;
    });
};
methods.refresh = function () {
    this.$nextTick(this.fetchRender);
};
methods.onPageChange = function (n) {
    this.curPage = n;
};
methods.open = function (v) {
    this.curAccount = v;
    this.openAccountVisible = true;
};
methods.modify = function (v) {
    this.curAccount = v;
    this.modifyAccountVisible = true;
};
methods.reject = function (v) {
    this.$confirm('确定拒绝该申请吗？', '', (b) => {
        if (!b) {
            return;
        }
        let p = {
            func: 'refuseApp',
            account: v.account
        };
        this.vRequest.account(p).then((data) => {
            this.$msg('操作完成');
            this.refresh();
        }).catch((e) => {
            this.$msg(e.respMsg || '请求失败');
        });
    });
};
methods.stop = function (v) {
    this.$confirm('确定停用该账号吗？', '', (b) => {
        if (!b) {return;}
        let p = {
            func: 'discontinuation',
            account: v.account
        };
        this.vRequest.account(p).then((data) => {
            this.$msg('操作完成');
            this.refresh();
        }).catch((e) => {
            this.$msg(e.respMsg || '请求失败');
        });
    });
};
methods.removeItem = function (item) {
    for (let i = this.list.length - 1; i >= 0; i--) {
        if (this.list[i] === item) {
            this.list.splice(i, 1);
        }
    }
};
methods.remove = function (v, i) {
    this.$confirm('确定删除该申请吗？', '', (b) => {
        if (!b) {return;}
        let p = {
            func: 'deleteAccount',
            account: v.account
        };
        this.vRequest.account(p).then((data) => {
            this.$msg('操作完成');
            this.refresh();
        }).catch((e) => {
            this.$msg(e.respMsg || '请求失败');
        });
    });
};
methods.submitAccount = function () {
    let fm = this.createForm;
    if (fm.loading) {
        return;
    }
    fm.loading = true;
    let p = {
        func: 'openAccount',
        account: this.curAccount.account,
        days: fm.expire
    };
    this.vRequest.account(p).then((data) => {
        fm.loading = false;
        this.$msg({
            text: '开通成功！', type: 'success'
        });
        this.closeAccount();
        this.refresh();
    }).catch((e) => {
        fm.loading = false;
        this.$msg(e.respMsg || '开通失败');
    });
};
methods.submitModifyAccount = function () {
    let fm = this.modifyForm;
    if (fm.loading) {
        return;
    }
    fm.loading = true;
    let p = {
        func: 'modifyExpiryTime',
        account: this.curAccount.account,
        days: fm.expire
    };
    this.vRequest.account(p).then((data) => {
        fm.loading = false;
        this.$msg({
            text: '修改成功！', type: 'success'
        });
        this.closeModifyAccount();
        this.refresh();
    }).catch((e) => {
        fm.loading = false;
        this.$msg(e.respMsg || '修改失败');
    });
};
methods.closeAccount = function () {
    this.openAccountVisible = false;
};
methods.closeModifyAccount = function () {
    this.modifyAccountVisible = false;
};
methods.getNO = function (i) {
    let n = i + 1;

    return n + (this.curPage - 1) * this.NUM_PER_PAGE;
};
methods.getExpireText = function (v) {
    if (!v.expiryTime || (v.flag !== this.STATUS_PASSED)) {
        return '--';
    }
    let curTime = (new Date()).getTime();
    let d = Calendar.parseDatetime(v.expiryTime);
    let dateTime = d.getTime();
    if (curTime > dateTime) {
        return '--';
    }
    let hours = Math.round((dateTime - curTime) / (3600 * 1000));
    const n1 = Math.floor(hours / 24);
    const n2 = hours % 24;
    let str = '';
    if (n1) {
        str += n1 + '天';
    }
    if (n2) {
        str += n2 + '小时';
    }
    return str;
};
methods.getStatusClass = function (flag) {
    return 'status-' + this.statusMap[flag];
};
let computed = {};
computed.expireOptions = function () {
    return [
        {name: '1天', value: 1},
        {name: '3天', value: 3},
        {name: '7天', value: 7},
        {name: '30天', value: 30},
        {name: '180天', value: 180}
    ];
};
computed.STATUS_WAIT = function () {
    return '待审核';
};
computed.STATUS_PASSED = function () {
    return '已开通'
};
computed.STATUS_REJECTED = function () {
    return '已拒绝'
};
computed.STATUS_INVALID = function () {
    return '已失效'
};
computed.statusMap = function () {
    return {
        '待审核': 0,
        '已开通': 1,
        '已拒绝': 2,
        '已失效': 3
    }
};
computed.statusTextMap = function () {
    return {
        0: '待审核',
        1: '已开通',
        2: '已拒绝',
        3: '已失效'
    }
};
computed.prolist = function () {
    return ['鹰眼', '风云', '远方', '征途', '速析'];
};
computed.productName = function () {
    return '鹰眼/远方/速析';
};
computed.NUM_PER_PAGE = function () {
    return 10;
};
computed.olist = function () {
    if (!this.datalist) {
        return this.datalist;
    }
    let keyword = this.keyword.trim();
    let status = this.status;
    return this.datalist.filter((v) => {
        if (keyword) {
            if (v.name.indexOf(keyword) === -1 && v.mobilePhone.indexOf(keyword) === -1) {
                return false;
            }
        }
        if (status && v.flag != status) {
            return false;
        }
        return true;
    });
};
let watch = {};
watch.startDate = function (v) {
};
watch.endDate = function (v) {};
const created = function () {
};
const mounted = function () {
    window.VM = this;
    this.$nextTick(this.fetchRender);
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        datalist: undefined,
        startDate: -30,
        endDate: undefined,
        openAccountVisible: false,
        modifyAccountVisible: false,
        keyword: '',
        status: '',
        curAccount: {},
        createForm: {
            expire: 3,
            loading: false
        },
        modifyForm: {
            expire: 3,
            loading: false
        }
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/request_mix.js'),
        require('mixins/paging.js')
    ],
    beforeDestroy,
    components: {
        'v-date': require('comp/common/date.vue'),
        'v-pagination': require('comp/common/pagination.vue')
    }
};
</script>

<style scoped lang="less">
@table-width:       1300px;
@status-color-0:    #999;
@status-color-1:    #33CC33;
@status-color-2:    #f00;
@status-color-3:    #EE8A1D;
.page-audit-account {
    padding-left: 25px;
}
.main-wrapper {
    margin-left: 3px;
    margin-right: 30px;
    background-color: #f7f7f7;
    
    padding: 30px 30px;
}
.condition-box {
    .name-mobile-input {
        width: 200px;
    }
    .pro-sel,
    .status-sel {
        width: 120px;
    }
    .date-input {
        width: 120px;
    }
}
.my-table {
    min-width: @table-width;
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    th.col-index {
        text-align: center;
        width: 58px;
    }
    th.col-mobile {
        width: 120px;
    }
    th.col-datetime {
        width: 170px;
    }
    th.col-company {
        width: 220px;
    }
    th.col-status {
        width: 80px;
    }
    th.col-op {
        width: 240px;
    }
    tr > th,
    tr > td {
        padding: 8px 12px;
        border: 1px solid #cdcdcd;
    }
    tr > td {
        color: #444;
    }
    td.status-0 {
        color: @status-color-0;
    }
    td.status-1 {
        color: @status-color-1;
    }
    td.status-2 {
        color: @status-color-2;
    }
    td.status-3 {
        color: @status-color-3;
    }
    td.loading-cell .loading-1 {
        margin: auto;
    }
}
.center-layer-inner-1 {
    .layer-close-btn {
        top: 25px;
        right: 27px;
    }
    & > h3 {
        margin-top: 5px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
    }
    .layer-btn-box {
        text-align: center;
    }
    .layer-btn-box > .btn {
        width: 80px;
    }
    & > div > label {
        width: 80px;
    }
    & > div > label.col-lb-1 {
        width: 76px;
    }
    & > div > .col-text-1 {
        width: 180px;
    }
    & > div > .col-text-2 {
        width: 140px;
    }
}

</style>

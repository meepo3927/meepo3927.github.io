<template>
<div class="vue-comp">
    <!-- 首页 -->
    <div class="m-container">
        <page-title :main="h4text" ></page-title>

        <!-- 表单 (名称) -->
        <div class="panel mt20 pt30 pr40 pl40 pb30">
            <form class="common-form" @submit.prevent ref="form">
                <!-- 第一行 -->
                <div class="layout-row cell-ver-mid row-1">
                    <label class="x-cell col-1">
                        <span class="color-red">*</span> 事件名称：
                    </label>

                    <div class="x-cell col-2 pl10">
                        <input type="text" class="form-control input-lg" name="event-name"
                            v-model="eventName"
                            data-vali="required"
                            errmsg="请填写事件名称">
                    </div>

                    <div class="x-cell col-3 pl15">
                        <span class="text-warning" error-for="event-name"></span>
                        <i class="fa fa-check-circle" success-for="event-name" style="display: none;"></i>
                    </div>
                </div>
            </form>
        </div>
        <button class="btn btn-default btn-lg" v-if="view.backBtnVisible"
            @click="pageBack">返回</button>
        <div class="loading-1" v-show="view.loading"></div>
        <!-- 事件源 -->
        <div v-for="(core, index) in corelist" 
            is="comp-core" class="" ref="core" 
            :option="core"
            :key="core"
            :index="index"
            :childcount="childrens.length"
            :fill="core.fill"
            :main-realtime="mainRealtime"
            @on-realtime-changed="onChildRealtimeChanged(index, $event)"
            @remove="removeCore(index)"
            @change-logic="childChangeLogic(core, $event)" 
            @toggle-left="childToggleLeft(core)"
            @toggle-right="childToggleRight(core)"></div>

        <!-- 括号 -->
        <div is="rule-relation" v-if="lastRelationVisible" class="mt20 sup-style"
            :option="lastRelationOption"
            :relation="lastRelation"
            @toggle-right="lastToggleRight"></div>
        <!-- 按钮 -->
        <div class="btn-box-block"></div>
        <div class="clearfix btn-box" v-show="btnBoxVisible">
            <!-- 
            <a href="javascript:;" class="add-core-btn" >
                <i class="fa fa-plus-circle"></i>
                <span>叠加事件源</span>
            </a>
            -->
            <button class="btn btn-primary" type="button" @click="addOneCore">
                <i class="fa fa-plus-circle"></i>
                叠加事件源
            </button>

            <button class="btn btn-primary" type="button" @click="slideUpAllCore">收起所有事件源</button>
            <button class="btn btn-primary" type="button" @click="slideDownAllCore">展开所有事件源</button>

        </div>
        <button class="btn btn-success pull-right save-btn" 
            v-show="btnBoxVisible"
            type="button"
            :class="{disabled: view.saving}"
            @click="save">确定保存</button>
    </div><!-- m-container -->
</div>
</template>

<script>
import {request} from 'common';
import coreUtil from 'util/event_core.js';
import store from 'util/store';
import tool from 'util/tool';
import URL from 'util/url';
import config from 'config';

import 'mVali';
const getDefaultCoreOption = () => {
    return {
        relation: coreUtil.getRelationOption()
    };
};

let methods = {};
methods.onChildRealtimeChanged = function (index, e) {
    // 以第一项的实时类型为准
    if (index === 0) {
        this.mainRealtime = e;
    }
};
methods.eachCore = function (f) {
    if (!this.$refs.core) {
        return;
    }
    this.$refs.core.forEach(f);
};
methods.addOneCore = function () {
    this.corelist.push(getDefaultCoreOption());
};
methods.removeCore = function (index) {
    if (!confirm('确定删除该事件源吗，删除后无法恢复？')) {
        return;
    }

    this.$refs.core[index].fadeOut(() => {
        this.corelist.splice(index, 1);
        mlayer.msg('删除成功');
    });
};
// Core 逻辑
methods.slideUpAllCore = function () {
    this.eachCore((core) => (core.minWindow()));
};
methods.slideDownAllCore = function () {
    this.eachCore((core) => (core.maxWindow()));
};
methods.getFormula = function () {
    return coreUtil.getFormula(this.corelist.map((v) => (v.relation)), (i) => {
        let core = this.$refs.core[i];
        let inCase = 'e' + (i + 1);
        return core ? core.getEvtId() : inCase;
    }, this.lastRelation);
};
methods.getRequestEditPromise = function () {
    if (!this._requestEditPromise) {
        let id = URL.query().id;
        this._requestEditPromise = request.getEventSetPageConfig(id);
    }

    return this._requestEditPromise;
};
methods.init = function () {
    if (this.inited) {
        return;
    }
    if (this.mode === 'edit' || this.mode === 'copy') {
        this.getRequestEditPromise().then((json) => {
            if (this.view.loading) {
                return;
            }
            if (json) {
                this.restore(json);
                this.inited = true;
            }
        }).catch(() => {
            if (this.view.loading) {
                return;
            }
            this.inited = true;
            this.view.backBtnVisible = true;
            mlayer.msg('数据集不存在');
        });
    } else {
        if (this.view.loading) {
            return;
        }
        if (this.corelist.length === 0) {
            this.inited = true;
            this.corelist.push(getDefaultCoreOption());
        }
    }
};
methods.restore = function (json) {
    this.json = json;
    // 事件集名称
    if (this.mode === 'copy') {
        this.eventName = (json.evtSetName + '-副本');
    } else {
        this.eventName = json.evtSetName;
    }
    mDebug('big json:', json);
    let corelist = [];
    let formula = json.evtSetFormula || '';
    // 解析公式
    let formulaMap = coreUtil.parseFormula(formula);
    if (formulaMap.lastRight) {
        this.lastRelation.right = true;
    }
    // 事件列表
    json.evts.forEach((e) => {
        let core = getDefaultCoreOption();
        // 还原逻辑关系
        core.relation = tool.extend(core.relation, formulaMap[e.evtId]);
        // 回填规则
        core.fill = e;
        corelist.push(core);
    });

    this.corelist = corelist;
    this.renderHighlightQuotes();
};
methods.toJSON = function () {
    var o = {};
    // 事件集ID
    o.evtSetId = this.json.evtSetId || 'es1';
    o.evtSetName = this.eventName;
    o.evtSetFormula = this.getFormula();
    o.evts = [];
    this.eachCore((core) => {
        o.evts.push(core.toJSON());
    });
    return o;
};
methods.checkForm = function () {
    return $(this.$refs.form).mVali('check');
};
methods.delayJumpBack = function () {
    setTimeout(() => {
        let url = this.getStaticUrl('/entry', '#/eventlist');
        this.innerJump(url);
    }, 1000);
};
methods.save = function () {
    var json = this.toJSON();
    mDebug('save json:', json);
    if (!this.checkForm()) {
        return mlayer.msg('请填写事件名称');
    }
    let hasError = false;
    // 检查内容
    this.$refs.core.forEach((core) => {
        if (core.check() === false) {
            hasError = true;
        }
    });
    // 事件括号检查
    if (!coreUtil.checkBracket(json.evtSetFormula)) {
        mlayer.msg('事件间括号不匹配，请检查');
        return;
    }
    
    json.evts.forEach((e, i) => {
        if (!coreUtil.checkBracket(e.ruleSetFormula)) {
            hasError = true;
            mlayer.msg(`事件${i + 1}中规则括号不匹配，请检查`);
            return;
        }
    });
    // 有错误
    if (hasError) {
        return mlayer.msg('有错误，请检查内容');
    }
    // 正在保存
    if (this.view.saving) {
        return;
    }
    // 新建, 渠道常驻人口事件
    if (this.mode === 'create' && this.hasChannelAreaRule(json)) {
        json.evtSetName = this.patchChannelAreaName(json.evtSetName);
        alert('为便于区分不同事件，您的事件名称被系统修改为：' + json.evtSetName);
    }
    // loading
    this.view.saving = true;
    var l = mlayer.loading();
    let done = () => {
        this.view.saving = false;
        l.close();
    };
    // 请求
    var p;
    if (this.mode === 'edit') {
        p = request.editEventSet(json);
    } else {
        p = request.addEventSet(json);
    }
    // 结果判断
    p.then((result) => {
        if (result.success) {
            mlayer.iconMsg('保存成功,即将跳转..', {time: 1000});
            this.delayJumpBack();
        } else {
            mlayer.msg(result.msg || '保存失败');
        }
        done();
    }).catch((e = {}) => {
        mlayer.msg(e.msg || '保存失败');
        done();
    });
};
let computed = {};
computed.h4text = function () {
    let map = {
        create: '新增事件',
        edit: '修改事件',
        copy: '复制事件'
    };
    let text = map[this.mode] || map.create;
    document.title = text;
    return text;
};
computed.childrens = function () {
    return this.corelist;
};
computed.btnBoxVisible = function () {
    if (this.view.loading) {
        return false;
    }
    if (this.corelist.length === 0) {
        return false;
    }
    return true;
};
let watch = {};
const beforeCreate = function () {};
const created = function () {
    this.view.loading = true;
    let query = URL.query();
    if (query.id) {
        // 编辑
        this.mode = query.mode || 'edit';
        this.init();
    } else {
        this.init();
    }
    request.getEventConfig().then(() => {
        this.view.loading = false;
        this.init();
    }, () => {
        this.view.loading = false;
    });
};
const mounted = function () {
    window.VM = this;
    $(this.$refs.form).mVali('init');
};
const destroyed = function () {};
const dataFunc = function () {
    let o = {
        eventName: '',
        json: {},
        corelist: [],
        mode: 'create',
        // 默认的事件源类型, 实时和非实时不能叠加
        mainRealtime: false,
        view: {
            backBtnVisible: false,
            saving: false,
            loading: false
        }
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
    props: [],
    mounted,
    mixins: [
        require('comp/event/create/last_relation_mix.js'),
        require('comp/event/create/relation_parent_mix.js'),
        require('mixins/channel_area_config.js')
    ],
    destroyed,
    components: {
        'comp-core': require('comp/event/create/core.vue'),
        'rule-relation': require('comp/event/create/rule_relation.vue'),
    }
};
</script>

<style scoped lang="less">
.vue-comp {
}
.common-form {
    .col-1 {
        width: 100px;
    }
    .row-1 .col-2 {
        width: 490px;
    }
}
</style>

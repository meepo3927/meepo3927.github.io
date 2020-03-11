/**
 * 创建事件 - 规则(逻辑)关系
 * @Vue
 * @date  2017.03.08
 */

<template>
<div class="rule-config layout-row cell-ver-mid">
    <!-- col1 -->
    <div class="x-cell x-label-1">
        <label for="">规则名称：</label>
    </div>
    <div class="x-cell x-col-1">
        <v-chosen :options="atomOptions" class="atom-select"
            @change="onAtomChange"
            v-model="atomId" />
    </div>

    <!-- 扩展 渠道常驻人口事件 -->
    <!-- col2 -->
    <div class="x-cell x-label-2" v-show="conditionCompVisible">
        <label for="">条件：</label>
    </div>
    <div class="x-cell x-col-2" :class="{vhidden: !conditionCompVisible}">
        <v-chosen class="col-chosen-2" v-if="argComp" :options="conditions" 
            v-model="calcPrincId"
            @change="onConditionChange"
            @update="onConditionUpdate" />

        <span class="arg-comp-empty" v-if="!argComp">无</span>
    </div>
    <!-- 渠道配置 按钮 -->
    <div class="x-cell x-col-channel-btn" v-show="isAtomChannelArea">
        <button class="btn btn-primary" @click="openChannelConfig">配置渠道</button>
    </div>
    <!-- col3 -->
    <div class="x-cell x-label-3" v-show="conditionCompVisible">
        <label>阈值：</label>
    </div>
    <div class="x-cell x-col-3" >
        <!-- 1. 下拉框-单选 -->
        <!-- 2. 下拉框-多选 -->
        <!-- 3. 选择基站 -->
        <!-- 4. 输入框 + 日期区间选择 + 时间段选择 -->
        <!-- 5. 单输入框 -->
        <div v-model="princArg" ref="comp"
            :is="argComp" 
            :rule-desc="ruleDesc"
            :data="argData"
            :mesh="argMesh"
            @set-value="compSetValue"></div>
        <span class="arg-comp-empty" v-if="!argComp">无</span>
    </div>

    <!-- col4 -->
    <div class="x-cell x-col-4">
        <a href="javascript:;" @click="remove"><i class="fa fa-times"></i></a>
    </div>

    <!-- 渠道常驻人口 配置浮层 -->
    <full-layer ref="clayer_13" @close="onChannelConfigCloseClick"
        define-close="1">
        <channel-area-config v-model="princArg" @done="channelConfigClose" ref="clayerInner_13" />
    </full-layer>

    <!-- 渠道过客 配置浮层 -->
    <full-layer ref="clayer_7" @close="onChannelConfigCloseClick"
        define-close="1">
        <channel-pass-config v-model="princArg" @done="channelConfigClose" 
            ref="clayerInner_7" />
    </full-layer>
</div>
</template>

<script>
import request from 'util/request';
import tool from 'util/tool';
import URL from 'util/url.js';
import config from 'config';

var methods = {};
methods.openChannelConfig = function () {
    if (this.$refs[this.clayerName]) {
        this.$refs[this.clayerName].show();
    }
};
methods.channelConfigClose = function () {
    if (this.$refs[this.clayerName]) {
        this.$refs[this.clayerName].close();
    }
};
methods.onChannelConfigCloseClick = function () {
    if (this.$refs[this.clayerInnerName].onClose()) {
        this.$refs[this.clayerName].close();
    }
};
methods.check = function () {
    if (this.$refs.comp && this.$refs.comp.check) {
        return this.$refs.comp.check();
    }
    return true;
};
methods.compSetValue = function (key, value) {
    this.$emit('set-value', [key, value]);
};
methods.onConditionChange = function (val, e, option) {
    this.argMesh = option.getAttribute('argmesh');
};
methods.onConditionUpdate = function (chosen) {
    let o = chosen.getOption();
    if (o) {
        this.argMesh = o.getAttribute('argmesh');
    }
};
methods.goUp = function () {
    if (this.canGoUp) {
        this.$emit('goUp');
    }
};
methods.goDown = function () {
    if (this.canGoDown) {
        this.$emit('goDown');
    }
};
methods.remove = function () {
    if (confirm('确定删除此条规则吗？')) {
        this.$emit('remove');
    }
};
methods.initCoreConfig = function () {
};
methods.onAtomChange = function (val) {
    this.princArg = [];
};
var computed = {};
computed.canGoUp = function () {
    if (this.option && this.option.isFirst) {
        return false;
    }
    return true;
};
computed.canGoDown = function () {
    if (this.option && this.option.isLast) {
        return false;
    }
    return true;
};
computed.srcConfig = function () {
    let o = this.coreConfig;
    let srctype = this.srctype;
    return o[srctype];
};
computed.atomConfig = function () {
    let src = this.srcConfig;
    let atomId = this.atomId;
    if (src && src.ruleMap[atomId]) {
        return src.ruleMap[atomId];
    }
};
// Atom 下拉列表
computed.atomOptions = function () {
    let src = this.srcConfig;
    if (src) {
        let list = src.rules.map((item) => ({
            value: item.atomId,
            text: item.atomText
        }));
        
        return list;
    }
    return [];
};
// 条件下拉列表
computed.conditions = function () {
    let atomConfig = this.atomConfig || {};
    let type = atomConfig.conditionTypeId || 0;
    let arr = this.conditionMap[type] || [];
    let r = [];
    let compId = atomConfig.pageCompTypeId || 0;
    arr.forEach((v) => {

        // 选择基站，去掉[等于]和[不等于]条件
        if (compId === 3) {
            if (v.princDesc === '等于' || v.princDesc === '不等于') {
                return;
            }
        }

        r.push({
            data: tool.extend({}, v),
            value: v.calcPrincId,
            text: v.princDesc
        });
    });

    return r;
};
computed.argComp = function () {
    let atomConfig = this.atomConfig;
    let n = atomConfig ? atomConfig.pageCompTypeId : 0;
    if (n) {
        return 'c-' + n;
    }
    return null;
};
computed.argData = function () {
    return {
        atomId: this.atomId
    };
};
computed.isAtomChannelArea = function () {
    return ~config.channelAreaAtomId.indexOf(this.atomId);
};
computed.conditionCompVisible = function () {
    return !this.isAtomChannelArea;
};
computed.clayerName = function () {
    return 'clayer_' + this.srctype;
};
computed.clayerInnerName = function () {
    return 'clayerInner_' + this.srctype;
};
let watch = {};
watch.calcPrincId = function (val) {
    this.$emit('set-value', ['calcPrincId', val]);
};
watch.atomId = function (val) {
    this.$emit('set-value', ['atomId', val]);
};
watch.princArg = function (val) {
    this.$emit('set-value', ['princArg', val]);
};
watch.srctype = function (v) {
    this.princArg = [];
};
// 规则名称-options变化时，自动更新atomId
watch.atomOptions = function (options) {
    if (!options || !options[0]) {
        return;
    }
    for (let i = 0; i < options.length; i++) {
        if (options[i].value == this.atomId) {
            return;
        }
    }
    this.atomId = options[0].value;
};
// 条件options变化时，自动更新calcPrincId
watch.conditions = function (options) {
    if (!options || !options[0]) {
        return;
    }
    for (let i = 0; i < options.length; i++) {
        if (options[i].value == this.calcPrincId) {
            return;
        }
    }
    this.calcPrincId = options[0].value;
};
const created = function () {

    if (this.config) {
        this.atomId = this.config.atomId;
        this.calcPrincId = this.config.calcPrincId;
        this.princArg = this.config.princArg || [];
        this.ruleDesc = this.config.ruleDesc;
    }

    request.getEventConditionConfig().then((m) => {
        this.conditionMap = m;
    });
    request.getEventCoreConfig().then(({arr, obj}) => {
        this.coreConfig = obj;
    });
};
var mounted = function () {
};
const destroyed = function () {
};
export default {
    data: function () {
        return {
            conditionMap: {},
            coreConfig: {},
            atomId: '',
            calcPrincId: '',
            argMesh: '',
            princArg: [],
            ruleDesc: ''
        };
    },
    watch,
    created,
    methods,
    computed,
    props: ['option', 'config', 'srctype'],
    mounted,
    destroyed,
    components: {
        'c-1': require('comp/event/arg_type/c1.vue'),
        'c-2': require('comp/event/arg_type/c2.vue'),
        'c-3': require('comp/event/arg_type/c3.vue'),
        'c-4': require('comp/event/arg_type/c4.vue'),
        'c-5': require('comp/event/arg_type/c5.vue'),
        'c-6': require('comp/event/arg_type/c6.vue'),

        'c-100': require('comp/event/arg_type/c100.vue'),
        'c-101': require('comp/event/arg_type/c101.vue'),
        'c-102': require('comp/event/arg_type/c102.vue'),
        'channel-area-config': require('comp/event/channel-area-config.vue'),
        'channel-pass-config': require('comp/event/channel-pass-config.vue')
    }
};
</script>

<style scoped lang="less">
@import "../../../../less/global/config";
.rule-config {
    background-color: #fff;
    padding: 15px;
    .x-label-1,
    .x-label-2,
    .x-label-3 {
        & > label {
            white-space: nowrap;
            display: block;
            text-align: right;
            font-size: 16px;
        }
    }
    .x-label-1 {
        width: 80px;
    }
    .x-label-2 {
        width: 64px;
    }
    .x-label-3 {
        width: 66px;
    }
    @condition-col-width: 150px;
    .x-col-1 {
        width: 160px;
    }
    .atom-select {
        width: 150px;
    }
    .x-col-2 {
        width: @condition-col-width;
    }
    .col-chosen-2 {
        width: @condition-col-width;
    }
    .x-col-channel-btn {
        width: 123px;
    }
    .x-col-3 {
        width: 320px;
    }
    .x-col-4 {
        width: 50px;
        a {
            display: inline-block;
        }
        a.disabled,
        a.disabled:hover {
            color: #ccc;
            cursor: not-allowed;
        }
        a > i {
            font-size: 22px;
        }
        a > .fa-times {
            font-size: 24px;
        }
    }
    .arg-comp-empty {
        font-size: 16px;
    }
    .x-cell.vhidden {
        visibility: hidden;
    }
}

@media (max-width: @mq-mid-width) {}
</style>
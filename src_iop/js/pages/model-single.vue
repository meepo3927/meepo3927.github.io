<template>
<div class="page-model-detail">
    <h3>模型详情</h3>

    <div class="my-section mt30" v-if="dataReady">
        <div class="c-row ">
            <label>模型名称：</label>
            <div class="col-1" v-text="info.modelName"></div>

            <label class="lb-2">所属类别：</label>
            <div class="col-1" v-text="info.modelType + '-' + info.modelCategory"></div>
        </div>

        <div class="c-row mt20">
            <label >上线时间：</label>
            <div class="col-1" v-text="info.createTime"></div>
            <label class="lb-2">详情最后编辑时间：</label>
            <div class="col-1" v-text="info.updateTime"></div>
        </div>
    </div>
    <hr>
    <!-- 空 -->
    <div class="data-empty" v-if="dataEmpty">
        <p>数据为空</p>
    </div>

    <!-- ld -->
    <div class="loading-1" v-if="loading"></div>

    <div class="my-section " v-if="dataReady">
        <div class="c-row mt30">
            <label>模型简述：</label>
            <div class="col-2" v-html="info.modelBrief"></div>
        </div>
        <div class="c-row mt20">
            <label>模型目标：</label>
            <div class="col-2" v-html="info.modelAims"></div>
        </div>
        <div class="c-row mt20">
            <label>业务需求：</label>
            <div class="col-2" v-html="info.businessNeed"></div>
        </div>
        <div class="c-row mt20">
            <label>结果输出方式：</label>
            <div class="col-2" v-html="info.resultOpMethod"></div>
        </div>
        <div class="c-row mt20">
            <label>数量级：</label>
            <div class="col-2" v-html="info.dataAmount"></div>
        </div>
        <div class="c-row mt20">
            <label>时间周期：</label>
            <div class="col-2" v-html="info.timeLimit"></div>
        </div>
    </div>
    <hr v-if="dataReady">
    <div class="my-section " v-if="dataReady">
        <div class="c-row mt30">
            <label>字段说明：</label>
            <div class="col-2" v-html="info.fieldDesc"></div>
        </div>
        <div class="c-row mt20">
            <label>来源：</label>
            <div class="col-2" v-html="info.modelSource"></div>
        </div>
        <div class="c-row mt20">
            <label>变量列表：</label>
            <div class="col-2" v-html="info.variableList"></div>
        </div>
        <div class="c-row mt20">
            <label class="label-lb">输出标签：</label>
            <div class="col-2">
                <ul v-if="labels" class="label-ul">
                    <li v-for="lb in labels" v-text="lb.name" 
                        :data-id="lb.id" ></li>
                </ul>
            </div>
        </div>
    </div>
    <hr v-if="dataReady">
    <div class="my-section " v-if="dataReady">
        <div class="c-row mt30">
            <label>核心算法：</label>
            <div class="col-2" v-html="info.coreAlgorithm"></div>
        </div>
        <div class="c-row mt20">
            <label>参数设定：</label>
            <div class="col-2" v-html="info.paramSet"></div>
        </div>
        <div class="c-row mt20">
            <label>模型描述：</label>
            <div class="col-2" v-html="info.modelDesc"></div>
        </div>
        <div class="c-row mt30">
            <label>模型字段：</label>
            <div class="col-2" v-html="info.modelField"></div>
        </div>
    </div>
    <hr v-if="dataReady">
    <div class="my-section" v-if="dataReady">
        <div class="c-row mt30">
            <label>覆盖率：</label>
            <div class="col-1" v-text="getPercent(info.coverage)"></div>

            <label>准确率：</label>
            <div class="col-1" v-text="getPercent(info.accuracy)"></div>
        </div>
        <div class="c-row mt20">
            <label>命中率：</label>
            <div class="col-1" v-text="getPercent(info.hitRate)"></div>

            <label>评估效果：</label>
            <div class="col-1">
                <span v-text="getPercent(info.modelRate)"></span>
                <i class="fa fa-info-circle ml10" v-tooltip="引用模型标签营销活动最高成功率"></i>
            </div>
        </div>
    </div>
    <hr v-if="dataReady">
    <div class="my-section mt30" v-if="dataReady">
        <div class="c-row ">
            <label>备注：</label>
            <div class="col-2" v-html="info.remark || '无'"></div>
        </div>
    </div>
    <div class="btn-box mt30">
        
        <button class="btn btn-default" type="button" 
            @click="onCloseClick">关闭</button>
    </div>
</div>
</template>

<script>
const URL = require('util/url.js');

let methods = {};
methods.onCloseClick = function () {
    window.close();
};
methods.fetchRender = function () {
    const id = URL.query().id;
    const p = {
        modelId: id
    }
    Request.getModelInfo(p).then((result) => {
        if (result && result[0]) {
            this.info = result[0];
        } else {
            this.info = null;
        }
    }).catch(() => {
        this.info = null;
    });
};
methods.getPercent = function (n) {
    if (!n || isNaN(n)) {
        return '-';
    }
    return n + '%';
};
methods.linkToLabelPage = function(label) {
};
let computed = {};
computed.dataReady = function () {
    if (!this.info) {
        return false;
    }
    for (var k in this.info) {
        return true;
    }
    return false;
};
computed.schemas = function () {
    if (this.info && this.info.outputDetail) {
        return JSON.parse(this.info.outputDetail);
    }
};
computed.labels = function () {
    if (this.info && this.info.outputLabel) {
        return JSON.parse(this.info.outputLabel);
    }
};
computed.loading = function () {
    return (this.info === undefined);
};
computed.dataEmpty = function () {
    return (this.info === null);
};
computed.exportUrl = function () {
    if (!this.info) {
        return;
    }
    const q = {
        moduleId: 'BTRPT_20190425-10-48-39-856',
        macroName: 'ngbass.MC_iop_model_window_info',
        paramListStr: this.info.modelId,
        mode: 'dev'
    };
    return '/autoreport/rptData/exportRptData.do?' + URL.buildQuery(q);
};
computed.sampleDownloadUrl = function () {
    if (!this.info) {
        return;
    }
    return '/autoreport/iop/modelView/downloadTemplate?sampleData=' + this.info.sampleData;
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        info: undefined,
        remark: '其它需要补充的说明，比如抽样验证样本量等'
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
@c-lb-width:  112px;
.page-model-detail {
    padding: 15px 0 30px 28px;
    & > h3 {
        margin-top: 0;
        font-size: 20px;
        font-weight: bold;
    }
}
.my-section {
    & > h4 {
        font-size: 16px;
        font-weight: bold;
    }
}
.c-row {
    & > label {
        display: inline-block;
        vertical-align: top;
        width: @c-lb-width;
        &.lb-2 {
            width: @c-lb-width + 20px;
        }
    }
    & > div {
        display: inline-block;
        vertical-align: top;
        &.col-1 {
            width: 27.3%;
        }
        &.col-2 {
            width: 66.7%;
        }
    }
}
.my-table {
    tr > th,
    tr > td {
        border: 1px solid #DDD;
        padding: 8px 14px;
    }
    tr > th {
        background-color: #EDEDED;
    }
}
.schema-table {
    width: 600px;
}
.data-empty {
    padding: 10px 0 2px 10px;
    color: #777;
}
.label-lb {
    line-height: 34px;
}
.label-ul {
    margin-bottom: -10px;
    li {
        display: inline-block;
        margin-right: 12px;
        padding: 6px 12px;
        border: 1px solid darken(#FF8000, 15%);
        border-radius: 4px;
        margin-bottom: 10px;

        background-color: #FF8000;
        color: #fff;
    }
}
.btn-box {
    text-align: center;
    
}
.fa-info-circle {
    font-size: 18px;
    vertical-align: -1px;
}
</style>

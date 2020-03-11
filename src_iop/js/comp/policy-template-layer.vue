<template>
<center-layer close="true" @close="$emit('close')" width="80vw" height="80vh">
    <div class="center-layer-inner-1">
        <!-- 营销案 -->
        <div class="panel panel-primary" v-if="info">
            <div class="panel-heading">营销案</div>
            <div class="panel-body">
                <div class="m-row-mid-auto">
                    <div class="a-lb-1 lb">营销案编码：</div>
                    <div v-text="info.mpId" class="a-col-1"></div>

                    <div class="a-lb-2 lb">营销案名称：</div>
                    <div v-text="info.mpName"></div>
                </div>
                <div class="m-row-mid-auto mt10">
                    <div class="a-lb-1 lb">营销类型：</div>
                    <div v-text="info.tName" class="a-col-1"></div>

                    <div class="a-lb-2 lb">营销目的：</div>
                    <div v-text="info.pName"></div>
                </div>
            </div>
        </div>
        <!-- 营销活动 -->
        <div class="panel panel-info mt15" v-if="info">
            <div class="panel-heading ">营销活动</div>
            <div class="panel-body">
                <div class="m-row-mid-auto">
                    <div class="b-lb-1 lb">营销活动编码：</div>
                    <div v-text="info.mpSid" class="b-col-1"></div>

                    <div class="b-lb-2 lb">营销活动名称：</div>
                    <div v-text="info.mpSubName" class="b-col-2"></div>

                    <div class="b-lb-3 lb">标签名称：</div>
                    <div v-text="info.mpLabelTitle"></div>
                </div>

                <div class="m-row-mid-auto mt15">
                    <div class="b-lb-1 lb">事件名称：</div>
                    <div v-text="info.eventName" class="b-col-1"></div>

                    <div class="b-lb-2 lb">事件描述：</div>
                    <div v-text="info.eventDesc" class="b-col-2"></div>

                    <div class="b-lb-3 lb">商品名称：</div>
                    <div v-text=""></div>
                </div>
                <div class="m-row-mid-auto mt15">
                    <div class="b-lb-4 lb">营销目标客户群描述：</div>
                    <div v-text="info.mpBaseDesc"></div>
                </div>
            </div>
        </div>
        <!-- 渠道信息 -->
        <div class="panel panel-warning mt15" v-if="info">
            <div class="panel-heading ">营销渠道</div>
            <div class="panel-body">
                <div class="m-row-mid-auto">
                    <div class="c-lb-1 lb">渠道活动编码：</div>
                    <div v-text="info.svcType" class="c-col-1"></div>

                    <div class="c-lb-2 lb">活动开始时间：</div>
                    <div v-text="info.startTime" class="c-col-2"></div>

                    <div class="c-lb-3 lb">活动结束时间：</div>
                    <div v-text="info.endTime"></div>
                </div>

                <div class="m-row-mid-auto mt15">
                    <div class="c-lb-1 lb">营销渠道名称：</div>
                    <div v-text="info.channelTitle" class="c-col-1"></div>

                    <div class="c-lb-2 lb">营销活动说明：</div>
                    <div v-text="info.channelDesc" ></div>
                </div>

                <div class="m-row-mid-auto mt15">
                    <div class="c-lb-1 lb">营销语：</div>
                    <div v-text="info.mpSentence" ></div>
                </div>
            </div>
        </div>

        <!-- 加载中 -->
        <div class="loading-1 m-center" v-if="info === undefined"></div>
        <!-- 错误信息 -->
        <div class="v-msg" v-if="info === null">
            <p v-text="msg"></p>
        </div>
    </div>
</center-layer>
</template>

<script>
let methods = {};
methods.fetchRender = function () {
    this.vRequest.getPolicyTemplateInfo(this.param).then((result) => {
        if (result.resultData && result.resultData[0]) {
            this.info = result.resultData[0];
        } else {
            this.info = null;
            this.msg = result.resultMsg || '没有查询到数据';
        }
    }).catch((e) => {
        this.info = null;
        this.msg = '查询失败';
    });
};
let computed = {};
computed.param = function () {
    let p = {};
    if (this.data) {
        p.svcType = this.data.svcType;
    }
    return p;
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        msg: '',
        info: undefined
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['data'],
    mounted,
    mixins: [
    ],
    beforeDestroy,
    components: {
    }
};
</script>

<style scoped lang="less">
.center-layer-inner-1 {
    padding: 15px;
    overflow: auto;
}
.panel {
    margin-bottom: 0;
}
.panel-heading {
    font-size: 16px;
}
.panel-body {
}
.loading-1 {
    margin-top: 33vh;
}
.lb {
    font-weight: bold;
}
.a-lb-1 {
    width: 100px;
}
.a-lb-2 {
    width: 120px;
}
.a-col-1 {
    width: 220px;
}
.b-lb-1 {
    width: 100px;
}
.b-lb-2 {
    width: 110px;
}
.b-lb-3 {
    width: 100px;
}
.b-lb-4 {
    width: 180px;
}
.b-col-1 {
    width: 220px;
}
.b-col-2 {
    width: 320px;
}
.c-lb-1 {
    width: 110px;
}
.c-lb-2 {
    width: 110px;
}
.c-col-1 {
    width: 130px;
}
.c-col-2 {
    width: 200px;
}
</style>

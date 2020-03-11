<template>
<center-layer height="75vh" width="80vw" @close="onClose" :close="true">
    <div class="clayer-inner">
        <h3>全部公告</h3>
        <ul v-if="list" class="notice-list">
            <li v-for="v in list" class="panel panel-default">
                <div class="panel-heading" 
                    @click="onHeadingClick(v)">
                    <div v-text="v.beginDate" class="my-date"></div>
                    <div v-text="v.noticeTitle" class="my-title"></div>
                </div>
                <div class="panel-body" v-text="v.noticeContent"
                    v-show="isContentVisible(v)"></div>
            </li>
        </ul>
        <div class="alert alert-warning" v-if="list === null">暂无数据</div>
    </div>
</center-layer>
</template>

<script>
const methods = {};
methods.onClose = function () {
    Vue.$disposeComponent(this);
};
methods.onHeadingClick = function (item) {
    this.currentNoticeId = item.noticeId;
};
methods.isContentVisible = function (item) {
    if (this.currentNoticeId == item.noticeId) {
        return true;
    }
};
const computed = {};
const created = function () {};
const mounted = function () {
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: undefined,
        currentNoticeId: -1
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.clayer-inner {
    padding: 4px 12px;
    border-radius: 6px;
    & > h3 {
        margin-top: 8px;
    }
}
.notice-list {
    margin-top: 15px;
    height: calc(~'75vh - 60px');
    overflow-y: auto;
}
.panel-heading {
    cursor: pointer;
}
.my-title {
    word-wrap: break-word;
    word-break: break-all;
    margin-right: 100px;
}
.my-date {
    float: right;
}
</style>

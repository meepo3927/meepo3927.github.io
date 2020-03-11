<template>
<div class="comp-public-notice">
    <span>
        <i class="fa fa-bullhorn"></i> 公告：
    </span>
    <div class="list-wrapper" v-if="list" >
        <scroll-msg :list="list" clickable="1" @itemclick="onItemClick"/>
    </div>
    <span v-if="dataEmpty">暂无公告</span>
</div>
</template>

<script>
import PublicNoticeLayer from 'comp/index/public-notice-layer.vue';
const methods = {};
methods.onItemClick = function (item) {
    let currentNoticeId = -1;
    if (item) {
        currentNoticeId = item.noticeId;
    }
    Vue.$newComponent(PublicNoticeLayer, {
        list: this.list,
        currentNoticeId
    });
};
const computed = {};
computed.dataEmpty = function () {
    return (this.list === null);
};
const created = function () {};
const mounted = function () {
    Request.fetch2('/notice/getPublicNotice').then((data) => {
        this.list = data.length ? data : null;
    }).catch(() => {
        this.list = null;
    });
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
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {
        'scroll-msg': require('comp/index/notice-scroll-msg.vue')
    }
};
</script>

<style scoped lang="less">
@my-height:   40px;
@msg-color:   #666;
.comp-public-notice {
    // background-color: #FDFFED;
    // border-bottom: 1px solid #D3D4D5;
    padding-left: 28px;
    height: @my-height;
    color: #8E899D;
    & > span {
        font-size: 14px;
        line-height: @my-height;
        i {
            font-size: 18px;
            color: #33A2DA;
            vertical-align: -1px;
        }
    }
}
.list-wrapper {
    display: inline-block;
    margin-left: 6px;
    vertical-align: -5px;
    color: @msg-color;
    ul {
        max-width: 400px;
    }
}
</style>

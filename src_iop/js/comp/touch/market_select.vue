<template>
<div class="vue-comp">
    <v-chosen class="v-chosen" v-if="!isModeEdit" :options="list"
        :value="value" @input="onInput" />
    <!-- 编辑模式，显示名称 -->
    <span v-else v-text="mpName"></span>
</div>
</template>

<script>
import URL from 'util/url';
import store from 'store/market_select.js';

let methods = {};
methods.fetchRender = function () {
    if (!this.channelType) {
        return;
    }
    let p = {
        user_id: Config.user.id,
        mpId: URL.query().actPlanID,
        channelType: this.channelType
    };
    this.list = [];
    Request.getMarketList(p).then((result) => {
        let list = result.map((v) => {
            return {
                text: v.mpSubName,
                value: v.mpSid,
                disabled: (v.isExistChannelInPolicy >= 1),
                mpLabelDay: v.mpLabelDay,
                mpLabelType: v.mpLabelType,
                data: {
                    'mp-label-day': v.mpLabelDay,
                    'mp-label-type': v.mpLabelType
                }
            };
        });
        this.list = list;
        let avail = list.filter((item) => {return !item.disabled});
        // 自动选中第一项
        if (avail[0]) {
            this.$emit('input', avail[0].value);
        }
    }).catch(() => {
        this.list = [{
            value: '',
            text: '没有可选的营销活动，请先创建营销活动',
            disabled: true
        }];
    });
};
methods.noticeType = function () {
    if (this.choosendItem) {
        let day = this.choosendItem.mpLabelDay;
        let type = this.choosendItem.mpLabelType;
        let name = this.choosendItem.text;
        store.commit('change', {day, type, name});
    }
};
methods.onInput = function (v) {
    this.$emit('input', v);
};
let computed = {};
computed.isModeEdit = function () {
    return (this.mode === 'edit')
};
computed.choosendItem = function () {
    if (this.list && this.value) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].value === this.value) {
                return this.list[i];
            }
        }
    }
};
computed.mpName = function () {
    return store.state.mpName;
};
let watch = {};
watch.channelType = function () {
    this.fetchRender();
};
watch.choosendItem = function () {
    this.noticeType();
};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: []
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['value', 'channelType', 'mode'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.vue-comp {
    
}
.empty-text {
    color: #ff0000;
}
</style>

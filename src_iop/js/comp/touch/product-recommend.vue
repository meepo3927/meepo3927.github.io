<template>
<ul class="product-recommend-list">
    <li v-for="(item, index) in list" :key="item">
        <!-- 产品名称 -->
        <span class="product-name" :class="{'with-red-star': item.checked}" 
            v-text="item.productName"></span>
        <!-- 产品介绍 输入 -->
        <input type="text" class="form-control" placeholder="产品介绍" 
            @blur="onInputBlur"
            :required="item.checked"
            v-model.trim="item.svcRecommendProdIntro" />
        <!-- 勾选 -->
        <label class="ml15">
            <input type="checkbox" v-model="item.checked" @change="onCheckChange(item)"
                :disabled="item.dataplusAvailable === false"/> 推送
        </label>
        <!-- 不可勾选的提示 -->
        <span class="errmsg ml15" v-if="item.dataplusAvailable === false"
            v-text="notAvailableTip">
        </span>
    </li>
    <li v-if="dataEmpty" class="data-empty">
        <span v-text="dataEmptyTip"></span>
    </li>
</ul>
</template>

<script>
const MAX_RECOMMEND = 1;
const methods = {};
// 同步数据
methods.sync = function () {
    this.$emit('input', this.checkedProducts);
};
// 勾选时，限制总勾选数量
methods.onCheckChange = function (item) {
    if (this.checkedCount <= MAX_RECOMMEND) {
        return this.$nextTick(this.sync);
    }
    item.checked = false;
    mlayer.msg(`最多只能推送${MAX_RECOMMEND}个产品`);
};
methods.onInputBlur = function () {
    this.$nextTick(this.sync);
};
methods.fetchRender = function () {
    const p = {
        activityID: this.mpId
    };
    this.loading = true;
    return Request.products(p).then((result) => {
        this.loading = false;
        return this.handleProducts(result);
    }).catch((e) => {
        this.loading = false;
        this.list = [];
        LOG('[product-recommend] fetchRender Error:', e);
    });
};
methods.handleProducts = function (data) {
    const isChannelDataPlus = this.isChannelDataPlus;
    let checkedCount = 0;
    this.list = data.map((item) => {
        if (isChannelDataPlus) { // 如果是流量加，强行可选
            item.dataplusAvailable = true;
        }
        // 自动勾选前Max可用项
        if (checkedCount < MAX_RECOMMEND) {
            if (item.dataplusAvailable === false) {
                item.checked = false;
            } else {
                item.checked = true;
                checkedCount++;
            }
        } else {
            item.checked = false;
        }
        // 产品介绍
        item.svcRecommendProdIntro = '';
        return item;
    });

    // 回填
    this.restore();
};
methods.restore = function () {
    if (!this.value || !this.value.length) {
        return;
    }
    const map = {};
    for (let i = 0; i < this.value.length; i++) {
        const code = this.value[i].productID;
        map[code] = this.value[i];
    }
    for (let i = 0; i < this.list.length; i++) {
        const productID = this.list[i].productID;
        const item = map[productID];
        if (item) {
            this.list[i].svcRecommendProdIntro = item.svcRecommendProdIntro;
            this.list[i].checked = true;
        } else {
            this.list[i].checked = false;
        }
    }
};
let computed = {};
computed.dataEmpty = function () {
    return (this.list.length === 0);
};
computed.checkedProducts = function () {
    let list = [];
    this.list.forEach((item) => {
        item.checked && list.push(item);
    });
    return list;
};
computed.checkedCount = function () {
    return this.checkedProducts.length;
};
computed.notAvailableTip = function () {
    return '此产品在该平台不支持订购';
};
computed.isChannelDataPlus = function () {
    return (this.channelId === '32');
};
computed.dataEmptyTip = function () {
    if (this.loading) {
        return '--'
    }
    return '无';
};
let watch = {};
watch.value = {
    deep: false,
    handler: function () {
        this.restore();
    }
};
const created = function () {};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: [],
        loading: false
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['channelId', 'value', 'mpId'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
ul > li {
    margin-bottom: 15px;
    display: block;
    width: 740px;
    &:last-child {
        margin-bottom: 0;
    }
    &.data-empty {
        line-height: 30px;
    }
    & > * {
        vertical-align: middle;
    }
    & > .product-name {
        display: inline-block;
        width: 180px;
        margin-right: 15px;
    }
    & > input[type=text] {
        display: inline-block;
        width: 240px;
    }
    & > label {
        cursor: pointer;
    }
}
.errmsg {
    color: red !important;
    white-space: nowrap;
}
</style>

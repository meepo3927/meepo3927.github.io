<template>
<div >
    <div class="col-label"><label>推荐商品名称：</label></div>
    <div class="col-input">
        <ul>
            <li v-for="(v, i) in products" v-text="getProductText(v, i)"></li>
        </ul>
    </div>
</div>
</template>

<script>
import URL from 'util/url.js';
const methods = {};
methods.getProductText = function (item, i) {
    let j = i + 1;
    return j + '. ' + item.offer_title;
};
const computed = {};
const created = function () {};
const mounted = function () {
    const param = {
        mpsid: URL.query().mpsid
    };
    Request.fetch2('/officialWechat/products', param).then((data) => {
        this.products = data;
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        products: []
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: ['value'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">

</style>

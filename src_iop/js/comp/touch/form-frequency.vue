<template>
<div class="m-row-mid-auto" v-if="rootVisible">
    <div class="col-label"><label :for="myInputId">周期更新：</label></div>
    <div class="col-input">
        <input type="checkbox" v-model="value" :id="myInputId"
            @change="onChange" />
    </div>
</div>
</template>

<script>
import URL from 'util/url.js';
const methods = {};
methods.onChange = function (e) {
    this.$emit('input', e.target.checked);
};
const computed = {};
// 如果客群是标签选择，则显示
computed.rootVisible = function () {
    return URL.query().mpLabelType === '1';
};
computed.myInputId = function () {
    return 'frequency_checkbox_' + Tool.randStr();
};
const created = function () {};
const mounted = function () {
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
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

<template>
<div>
    <div class="col-label"><label :for="id">特殊号码过滤：</label></div>
    <div class="col-input">
        <input type="checkbox" v-model="checked" :id="id" />
    </div>
</div>
</template>

<script>
let methods = {};
methods.getValue = function (val) {
    if (val === '0' || val === '0000' || val === 0) {
        return false;
    }
    return true;
};
let computed = {};
let watch = {};
watch.checked = function (b) {
    this.$emit('input', b ? 1 : 0);
};
watch.value = function (v) {
    this.checked = this.getValue(v);
};
const created = function () {};
const mounted = function () {
    this.checked = this.getValue(this.value);
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        id: ('special_filter_id_') + Tool.getUniqueId() + (new Date()).getTime(),
        checked: false
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['value'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
</style>

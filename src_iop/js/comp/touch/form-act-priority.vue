<template>
<div>
    <div class="col-label"><label :for="id" class="with-red-star">活动优先级：</label></div>
    <div class="col-input">
        <input-number class="form-control " min="0" max="100" required
            :id="id"
            :value="value"
            @input="onInput" />
    </div>
    <div class="pl15">
        <span class="text-muted">取值范围0-100，值越大优先级越高</span>
    </div>
</div>
</template>

<script>
const methods = {};
methods.onInput = function (val) {
    this.$emit('input', val);
};
const computed = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        id: ('touch_form_act_priority_') + Tool.getUniqueId() + (new Date()).getTime()
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

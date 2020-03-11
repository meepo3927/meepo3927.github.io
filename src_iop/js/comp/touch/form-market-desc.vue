<template>
<div >
    <div class="col-label">
        <label class="with-red-star" :for="id">营销活动描述：</label>
    </div>
    <div class="col-input">
        <input type="text" class="form-control input-width-1" maxlength="200"
            required ref="tt"
            @input="onInput"
            @blur="onBlur"
            :id="id"
            :value="value"
            :placeholder="myPlaceholder" />
    </div>
</div>
</template>

<script>
const methods = {};
methods.onInput = function (e) {
    const val = e.target.value.trim();
    this.$emit('input', val);
};
methods.onBlur = function () {
    this.$refs.tt.value = (this.value || '');
};
const computed = {};
computed.myPlaceholder = function () {
    return '请输入营销活动描述，供OA审批查看。例如：针对当月使用过腾讯视频客户端客户，通过短信推荐客户订购腾讯视频定向流量包。';
};
computed.lb = function () {
    return this.label || '营销用语';
};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        id: ('touch_form_market_sentence_') + Tool.getUniqueId() + (new Date()).getTime()
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

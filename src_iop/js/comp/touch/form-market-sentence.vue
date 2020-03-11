<template>
<div >
    <div class="col-label">
        <label :class="{'with-red-star': isRequired}" :for="id">{{lb}}：</label>
        <br />
        <div class="my-tip" v-tooltip="myTip">重要提示</div>
    </div>
    <div class="col-input">
        <textarea class="form-control input-width-1" ref="tt"
            @input="onInput"
            @blur="onBlur"
            :id="id"
            :value="value"
            :required="isRequired"
            :placeholder="myPlaceholder"></textarea>
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
    return this.placeholder || ('请输入' + this.lb)
};
computed.lb = function () {
    return this.label || '营销用语';
};
computed.myTip = function () {
    const id = this.channelId;
    if (id === '0' || id === '34') { // 短信 事件短信
        return [
            '（1）营销语中的网址链接地址，应与营销语文字内容前后之间使用“空格”进行间隔，避免用户手机终端收到短信内容后，无法正确解析链接地址。建议将网址链接地址放在营销语最后。',
            '（2）营销语中回车换行、不完整破折号【—】、大于等于号【≥】和小于等于号【≤】将被剔除。'
        ].join('<br />');
    }

    if (id === '5' || id === '6') {     // 自助终端、营业前台
        return '（1）营销语中回车换行和不完整破折号【—】将被自动剔除。';
    }

    // 默认
    return '（1）营销语中回车换行、不完整破折号【—】、大于等于号【≥】和小于等于号【≤】将被剔除。';
};
computed.isRequired = function () {
    if (this.optional) {
        return false;
    }
    return true;
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
    props: ['value', 'label', 'channelId', 'placeholder', 'optional'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.my-tip {
    margin-top: 10px;
    margin-right: 13px;
    color: #e00;
    float: right;
    
}
</style>

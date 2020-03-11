<template>
<div >
    <div class="col-label"><label class="with-red-star" :for="id">生效日期：</label></div>
    <div class="col-input">
        <laydate class="form-control date-input" v-model="value.beginDate"
            name="beginDate" required 
            :options="startOptions"
            :id="id"/>
    </div>
    <div class="pl15 pr15"><span>至</span></div>
    <div class="col-input">
        <laydate class="form-control date-input" v-model="value.endDate" 
            required name="endDate" 
            :options="endOptions"/>
    </div>
    <div class="pl10">
        <i class="fa fa-info-circle" v-tooltip="tip"></i>
    </div>
</div>
</template>

<script>
import TouchUtil from 'util/touch_config.js';
const methods = {};
const computed = {};
computed.startOptions = function () {
    const o = {};
    const date = TouchUtil.getEarliestAvaiableDate(this.prevtime);

    if (date) {
        o.min = date;
    }
    return o;
};
computed.endOptions = function () {
    const o = {};
    if (this.$store.getters.lastAvailableDate) {
        o.max = this.$store.getters.lastAvailableDate;
    }
    return o;
};
computed.tip = function () {
    return [
        '1. 所有波次生效时间跨度不能超过3个月.',
        '2. 当前波次的开始日期必须晚于上一个波次的结束日期.',
        '3. 如果客群标签包含月标签，则开始日期不能选择3号及以前.'
    ].join('<br />');
};
const created = function () {};
const mounted = function () {
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        id: ('touch_form_start_date_') + Tool.getUniqueId() + (new Date()).getTime()
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: ['value', 'prevtime'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.date-input {
    width: 138px;
}
.fa-info-circle {
    pointer-events: auto;
}
</style>

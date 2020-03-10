<template>
    <input type="text" class="vue-input-date" />
</template>

<script>
let MDate = require('lib/mdate.js');
var methods = {};
methods.initValue = function (v) {
    if (typeof v === 'number') {
        let str = MDate.Util.getDateOffsetStr(new Date, v)
        this.setValue(str);
    } else {
        this.setValue(v);
    }
};
methods.setValue = function (v) {
    if (v !== undefined) {
        this.$el.value = v;
        this.date.setValue(v);
    }
};
var computed = {};
var mounted = function () {
    let vm = this;
    this.date = new MDate(this.$el, {
        format: this.format,
        onChoose: function (v) {
            vm.$emit('input', v);
        }
    });
    if (this.value) {
        this.initValue(this.value);
    } else if (this.value === undefined) {
        let v = MDate.Util.getYMDStr();
        this.setValue(v)
        this.$emit('input', v);
    }
};
let watch = {};
watch.value = function (v) {
    this.setValue(v);
};
module.exports = {
    data: function () {
        return {};
    },
    watch,
    methods,
    computed,
    props: ['value', 'format'],
    mounted
};
</script>

<style scoped lang="less">
.vue-input-date {
    
}
</style>
<template>
    <input type="text" :value="value" @input="onInput" 
        @blur="onBlur" />
</template>

<script>
let methods = {};
methods.onBlur = function () {
    let val = this.getFixedValue();
    if (isNaN(val)) {
        this.$el.value = '';
        this.$emit('input', '');
    }
    if (val[val.length - 1] === '.') {
        let n = parseFloat(val);
        this.$el.value = n;
        this.$emit('input', n);
    }
};
methods.getFixedValue = function () {
    let oValue = this.$el.value.trim();
    if (oValue === '') {
        return oValue;
    }
    if (oValue === '-') {
        if (this.min !== undefined && this.min >= 0) {
            return '';
        } else {
            return '-';
        }
    }
    let n = parseFloat(oValue);
    if (isNaN(n)) {
        return 0;
    }
    let subfix = '';
    if (this.numType === 'integer') { // 仅整数
        oValue = parseInt(oValue, 10) || 0;
    } else if (oValue[oValue.length - 1] === '.') { // 正在输入小数
        subfix = '.';
        oValue = parseInt(oValue, 10) || 0;
    } else {
        // 处理末尾0的情况
        if (~oValue.indexOf('.')) {
            let j = oValue.length - 1;
            while (oValue[j] === '0') {
                subfix += '0';
                j--;
            }
        }
        oValue = n;
    }

    if (this.min !== undefined && oValue < this.min) {
        oValue = this.min;
    }
    if (this.max !== undefined && oValue > this.max) {
        oValue = this.max;
    }
    return oValue + subfix;
};
methods.onInput = function () {
    let val = this.getFixedValue();
    this.$el.value = val;
    this.$emit('input', val);
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: {
        value: Number,
        numType: String,
        min: Number,
        max: Number
    },
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">

</style>

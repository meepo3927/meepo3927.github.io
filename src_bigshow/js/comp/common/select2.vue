<template>
<select>
    <slot></slot>
    <option v-for="v in o" v-text="v.text" 
        :disabled="v.disabled"
        :value="v.value"
        v-bind="v.data"></option>
</select>
</template>

<script>
import $ from 'jquery';
import 'lib/select2.js';
const methods = {};
methods.onSelectChange = function (e) {
    this.syncInput();
    const elem = e.currentTarget;
    const option = elem.children[elem.selectedIndex];
    this.$emit('change', this.$select.select2('data'), this.$select.val(), e);
};
// <select>与this.value值不一致, 以this.value为准
methods.fixSelectValue = function () {
    if (this.value === undefined || this.value === null) {
        return;
    }
    // 当option中存在this.value时，自动选中
    if (this.$select.find('[value=' + this.value + ']').length) {
        this.$select.val(this.value);
    }
};
methods.initPlugin = function () {
    // adaptContainerCssClass
    // adaptDropdownCssClass
    // ajax[object]
    // allowClear[boolean]
    // amdBase[string]
    // amdLanguageBase[string]
    // closeOnSelect[boolean]
    // containerCss[object]
    // containerCssClass[string]
    // data[object or array]
    // dataAdapter
    // debug[boolean]
    // dir
    // disabled[boolean]
    // dropdownAdapter
    // dropdownAutoWidth
    // dropdownCss[object]
    // dropdownCssClass[string]
    // dropdownParent[jQuery selector or DOM node]
    // escapeMarkup[callback]
    // matcher[callback]
    // maximumInputLength[integer]
    // maximumSelectionLength[integer]
    // minimumInputLength[integer]
    // minimumResultsForSearch[integer]
    // multiple[boolean]
    // placeholder[string]
    // resultsAdapter
    // selectionAdapter
    // selectOnClose[boolean]
    // sorter[callback]
    // tags[boolean / array of objects]
    // templateResult[callback]
    // templateSelection[callback]
    // theme[string]
    // tokenizer[callback]
    // tokenSeparators[array]
    // width[string]
    // scrollAfterSelect[boolean]
    if (this.$select.hasClass("select2-hidden-accessible")) {
        // Select2 has been initialized
        this.disposePlugin();
    }
    const params = {};
    if (this.placeholder) {
        params.placeholder = this.placeholder;
    }
    this.$select.select2(params);
};
methods.disposePlugin = function () {
    this.$select.select2('destroy');
};
methods.syncInput = function () {
    this.$emit('input', this.$select.val(), this.$select.select2('data'));
};
var computed = {};
computed.o = function () {
    const arr = [];
    this.options && this.options.forEach((v) => {
        const option = {};
        for (const p in v) {
            option[p] = v[p];
        }
        // text, value
        if (option.text && option.value === undefined) {
            option.value = option.text;
        }
        arr.push(option);
    });
    return arr;
};
let watch = {};
// 选项发生变化
watch.o = function () {
    this.$nextTick(this.fixSelectValue);
    this.$nextTick(this.initPlugin);
};
watch.value = function (val) {
    this.$select.val(val).trigger('change.select2');
};
const mounted = function () {
    this.$select = $(this.$el);
    // 初始化赋值
    if (this.value) {
        this.$select.val(this.value);
    }
    this.$nextTick(this.initPlugin);
    this.$select.on('change', this.onSelectChange);
};
const beforeDestroy = function () {
    this.$select.off('change', this.onSelectChange);
    this.disposePlugin();
};
const dataFunc = function () {
    var o = {};
    return o;
};
export default {
    data: dataFunc,
    methods,
    computed,
    watch,
    props: [
        'options', 'value', 'placeholder'
    ],
    mounted,
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
select {
    min-width: 120px;
}
</style>
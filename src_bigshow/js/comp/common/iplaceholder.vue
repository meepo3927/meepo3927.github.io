<template>
<div class="iplaceholder" v-if="IE9" 
    v-show="visible"
    @click="onClick"
    :style="myStyle"><slot>{{text}}</slot></div>
</template>

<script>
const methods = {};
methods.getInputElem = function () {
    var el = this.$el.previousElementSibling || this.$el.previousSibling;
    do {
        const tagName = el.tagName.toUpperCase();
        if (tagName === 'INPUT') {
            return el;
        }
        el = el.previousElementSibling || el.previousSibling;
    } while (el);
};
methods.onClick = function () {
    if (this.iElem) {
        this.iElem.focus();
    }
};
methods.init = function (target) {
    this.iElem = target;
    this.$nextTick(this.updateText);
    this.$nextTick(this.updateStyle);
};
methods.updateText = function () {
    const str = this.iElem.getAttribute('placeholder');
    if (str) {
        this.text = str;
    }
};
methods.updateStyle = function () {
    const target = this.iElem;
    if (!target) {
        return;
    }
    const style = window.getComputedStyle(target, null);
    const height = target.offsetHeight;
    const myMarginTop = -height;
    this.myStyle = {
        fontSize: style.fontSize,
        marginTop: myMarginTop + 'px',
        marginLeft: style.paddingLeft,
        lineHeight: height + 'px'
    };
};
const computed = {};
computed.IE9 = function () {
    return (document.documentMode) && (document.documentMode <= 9);
};
computed.visible = function () {
    if (this.value) {
        return false;
    }
    return true;
};
const created = function () {};
const mounted = function () {
    const iElem = this.getInputElem();
    if (iElem) {
        this.init(iElem);
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    const o = {
        text: undefined,
        myStyle: undefined
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
.iplaceholder {
    position: absolute;
    color: #777;
}
</style>

<template>
<span class="mui-switch" @click="onClick" :class="[statusClass]">
    <span></span>
</span>
</template>

<script>
let methods = {};
methods.onClick = function () {
    this.checked = !this.checked;
    this.$emit('input', this.checked);
};
let computed = {};
computed.statusClass = function () {
    return this.checked === true ? 'checked' : '';
};
let watch = {};
watch.value = function (v) {
    if (v !== this.checked) {
        this.checked = v;
    }
};
const created = function () {};
const mounted = function () {
    if (this.value !== undefined) {
        this.checked = this.value;
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        checked: false
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: {
        value: {
            type: Boolean
        }
    },
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@active-color:        #13ce66;
@inactive-color:      #dcdfe6;

.mui-switch {
    margin: 0;
    display: inline-block;
    position: relative;
    width: 40px;
    height: 20px;
    border: 1px solid;
    outline: none;
    border-radius: 10px;
    box-sizing: border-box;
    cursor: pointer;
    transition: border-color .3s, background-color .3s;
    vertical-align: middle;

    border-color: @inactive-color;
    background-color:  @inactive-color;

    &.checked {
        border-color:  @active-color;
        background-color: @active-color;
        & > span {
            left: 21px;
        }
    }

    & > span {
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 100%;
        width: 16px;
        height: 16px;
        background-color: #fff;
        transition: all .3s;
    }
}

</style>

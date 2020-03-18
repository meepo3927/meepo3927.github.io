<template>
<div class="v-input-file">
    <label :for="id" v-text="text" :title="fileName"></label>
    <input type="file" ref="file"@change="onChange" 
        :id="id" 
        :name="inputName" />
</div>
</template>

<script>
let MAX_LEN = 50;
let MAX_LEN_HAFT = Math.round(MAX_LEN / 2);
let uuid = 1;
let methods = {};
methods.onChange = function (e) {
    let v = this.$refs.file.value;
    this.fileName = v.split('\\').pop();
    this.$emit('input', v);
};
let computed = {};
computed.text = function () {
    let name = this.fileName;
    if (name && name.length >= MAX_LEN) {
        return name.substr(0, MAX_LEN_HAFT)
             + '...' 
             + name.substr(name.length - MAX_LEN_HAFT);
    }
    return name || '选择文件';
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        id: 'vInputFile_' + (uuid++),
        fileName: ''
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['inputName'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@label-height:  34px;
.v-input-file {
    display: inline-block;
}
label {
    display: block;
    border: 1px solid #ccc;
    padding: 6px 12px;
    font-size: 14px;
    height: @label-height;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
    font-weight: normal;
}
input[type=file] {
    display: none;
}
</style>

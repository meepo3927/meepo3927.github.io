<template>
<div class="v-input-file">
    <label :for="id" v-text="text" :title="fileName"></label>
    <input type="file" ref="file" @change="onChange" :id="id" v-if="keep"
        :key="resetCount"
        :name="inputName" />
</div>
</template>

<script>
let MAX_LEN = 50;
let MAX_LEN_HAFT = Math.round(MAX_LEN / 2);
let uuid = 1;
let methods = {};
// 重置
methods.reset = function () {
    this.fileName = '';
    this.$emit('input', '');
    this.keep = false;
    this.resetCount++;
    this.$nextTick(this.delayKeep);
    
};
methods.delayKeep = function () {
    setTimeout(() => {
        this.keep = true;
    }, 80);
};
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
watch.value = function (val) {
    this.fileName = val;
};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {
    this.$emit('input', '');
    // 文件名
    if (this.value) {
        this.fileName = this.value;
    }
};
const dataFunc = function () {
    let o = {
        id: 'vInputFile_' + (uuid++),
        keep: true,
        resetCount: 0,
        fileName: ''
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: {
        inputName: String,
        value: String
    },
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">

.v-input-file {
    display: inline-block;
}
label {
    display: block;
    border: 1px solid #ccc;
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
    font-weight: normal;
}
input[type=file] {
    display: none;
}
</style>

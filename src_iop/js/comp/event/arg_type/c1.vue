<template>
<div class="c1">
    <v-chosen class="x-chosen-1" v-model="v" :options="options" key="C1chosen1"
        v-if="!multiple" @input="onInput" />
    <v-chosen class="x-chosen-2" v-model="v" :options="options" multiple key="C1chosen2"
        v-if="multiple"  @input="onInput"
        :max="maxSelectedOptions" />
    <div class="text-error mt10" v-html="errmsg" v-if="errmsg"></div>
</div>
</template>

<script>
var methods = {};
methods.onInput = function () {
    if (!this.getError()) {
        this.errmsg = '';
    }
};
methods.getError = function () {
    if (this.mesh == '2') {
        if (this.v.length < 2) {
            return '请至少选择两项';
        }
    }
    if (!this.v || !this.v[0]) {
        return '请至少选择一项';
    }
};
methods.check = function () {
    let err = this.getError();
    if (err) {
        this.errmsg = err;
        return false;
    }
    this.errmsg = '';
    return true;
};
var computed = {};
computed.multiple = function () {
    return (this.mesh === 'N') || (this.mesh > 1);
};
computed.maxSelectedOptions = function () {
    let mesh = this.mesh;
    if (mesh === 'N') {
        return undefined;
    }
    return parseInt(mesh, 10) || undefined;
};
var mounted = function () {
    this.fetchOptions();
};
let watch = {};
watch.atomId = function () {
    this.v = '';
    this.fetchOptions();
};
export default {
    data: function () {
        return {
            options: [],
            v: ''
        };
    },
    watch,
    methods,
    computed,
    mounted,
    mixins: [require('./mix.js')]
};
</script>

<style scoped lang="less">
.c1 {
    display: inline-block;
}
.x-chosen-2 {
    min-width: 140px;
}
</style>
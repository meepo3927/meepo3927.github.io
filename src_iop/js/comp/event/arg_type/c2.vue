<template>
    <v-chosen class="c2" multiple :options="options" v-model="v" />
</template>

<script>
var methods = {};
var computed = {};
var mounted = function () {
    this.fetchOptions();
};
let watch = {};
watch.atomId = function () {
    this.v = [];
    this.fetchOptions();
};
export default {
    data: function () {
        return {
            options: [],
            v: []
        };
    },
    watch,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [require('./mix.js')]
};
</script>

<style scoped lang="less">
.c2 {
    width: 160px;
}
</style>
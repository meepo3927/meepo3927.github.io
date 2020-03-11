<template>
<form class="form-inline" @submit.prevent>

    <div class="form-group mr50">
        <label for="" class="control-label">事件创建人：</label>
        <input type="text" class="form-control" v-model="eventCreator" />
    </div>

    <div class="form-group mr50">
        <label for="" class="control-label">事件状态：</label>
        <v-chosen :options="statusOptions" v-model="eventStatus" />
    </div>

    <button class="btn btn-primary" type="button" @click="submit">查询</button>
</form>
</template>

<script>
import mlayer from 'mlayer';
var data = function () {
    return {
        eventCreator: '',
        eventStatus: ''
    };
};
var methods = {};
methods.onStatusChange = function (val, e) {
    this.eventStatus = val;
};
methods.submit = function () {
    this.$emit('search', this.$data);
};
var computed = {};
computed.statusOptions = function () {
    return [
        {text: '全部', value:''},
        {text: '生效', value:'1'},
        {text: '失效', value:'0'}
    ];
};
var mounted = function () {};
export default {
    data,
    methods,
    computed,
    props: [],
    mixins: [
    ],
    mounted
};
</script>

<style scoped lang="less">

</style>
<template>
<form class="form-inline" @submit.prevent>

    <div class="form-group mr30">
        <label for="" class="control-label">优先级：</label>
        <v-chosen v-model="priority" >
            <option value="">全部</option>
            <option value="1">高</option>
            <option value="2">中</option>
            <option value="3">低</option>
        </v-chosen>
    </div>

    <div class="form-group mr30">
        <label for="" class="control-label">启停状态：</label>
        <v-chosen v-model="startStopFlag">
            <option value="">全部</option>
            <option value="1">启用</option>
            <option value="0">停用</option>
        </v-chosen>
    </div>
    <div class="form-group mr20">
        <label for="" class="control-label">营销活动名称：</label>
        <input type="text" class="form-control name-input" v-model.trim="keyword" />
    </div>

    <div class="form-group form-group-lg mr20">
        <label for="" class="control-label">触点类型：</label>
        <v-chosen :options="typeOptions" v-model="contactId" />

    </div>

    <button class="btn btn-primary" type="button" 
        @click="submit">查询</button>
</form>
</template>

<script>
var methods = {};
methods.submit = function () {
    this.$emit('search', {
        priority: this.priority,
        startStopFlag: this.startStopFlag,
        keyword: this.keyword,
        contactId: this.contactId
    });
};
var computed = {};
const created = function () {
    Request.getContactSelect().then((data) => {
        this.typeOptions = [{value: '', text: '全部'}].concat(data.map((v) => {
            return {
                value: v.contactId,
                text: v.contactDesc
            };
        }));
    });
};
var mounted = function () {};
export default {
    data: function () {
        return {
            typeOptions: [],
            priority: '',
            startStopFlag: '',
            keyword: '',
            contactId: ''
        };
    },
    created,
    methods,
    computed,
    mixins: [],
    props: [],
    mounted
};
</script>

<style scoped lang="less">
.name-input {
    width: 140px;
}
</style>
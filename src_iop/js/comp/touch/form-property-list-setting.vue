<template>
<div>
    <ul v-if="list">
        <li class="m-row-mid-auto mb15" v-for="(item, i) in list">
            <div class="my-label">属性编码：</div>
            <div >
                <input type="text" class="form-control input-sm" 
                    v-model="item.id" />
            </div>
            <div class="my-label pl15"><label :class="labelClass">属性值：</label></div>
            <div>
                <input type="text" class="form-control input-sm" :required="isRequired"
                    v-model.trim="item.value"
                    @blur="onInputBlur" />
            </div>
            <div class="my-label pl15"><label :class="labelClass">属性描述：</label></div>
            <div>
                <input type="text" class="form-control input-sm" :required="isRequired"
                    v-model.trim="item.desc"
                    @blur="onInputBlur" />
            </div>
            <div class="pl15" v-if="i > 0">
                <a href="javascript:;" title="删除" @click="remove(item)">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </li>
    </ul>
    <button class="btn btn-success btn-ms" type="button" 
        @click="add">增加一组属性</button>
</div>
</template>

<script>
const methods = {};
methods.onInputBlur = function () {
    this.sync();
};
methods.sync = function () {
    this.$emit('input', this.list);
};
methods.getCalcId = function () {
    const arr = [];
    if (Config.user.id) {
        arr.push(Config.user.id.substr(0, 2));
    }
    const dateStr = (new Date).getTime() + '';
    arr.push(dateStr.substr(dateStr.length - 6));
    arr.push(Math.round(Math.random() * 99999));
    return arr.join('_');
};
methods.add = function () {
    this.list.push({
        id: '',
        value: '',
        desc: ''
    });
};
methods.remove = function (p) {
    for (let i = this.list.length - 1; i >= 0; i--) {
        if (this.list[i] === p) {
            this.list.splice(i, 1);
        }
    }
    this.sync();
};
const computed = {};
computed.isRequired = function () {
    return true;
};
computed.labelClass = function () {
    return {
        'with-red-star': this.isRequired
    }
};
const created = function () {};
const mounted = function () {
    if (this.value && this.valua.length) {
        this.list = this.value;
    } else {
        this.add();
    }
};
const watch = {};
watch.value = {
    deep: false,
    handler: function (val) {
        if (val) {
            this.list = val;
        }
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: []
    };
    return o;
};
export default {
    watch,
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

</style>

<template>
<div class="page-channel-freq-setting">
    <h2>触点频次限制</h2>
    <table class="m-table">
        <thead>
            <tr>
                <th>触点</th>
                <th>频次</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="v in touchList">
                <td v-text="v.name"></td>
                <td>
                    <input-number v-model="v.value"
                        :disabled="isModeDefault(v)" />
                </td>
                <td>
                    <button class="btn btn-primary" type="button" :disabled="isModeSaving(v)"
                        v-if="!loading"
                        v-show="!isModifyBtnVisible(v)" 
                        @click="save(v)">保存</button>
                    <button class="btn btn-default" type="button"
                        v-if="!loading"
                        v-show="isModifyBtnVisible(v)"
                        @click="enterModify(v)">修改</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import mlayer from 'mlayer';
const methods = {};
methods.enterModify = function (item) {
    item.mode = 'modify';
};
methods.save = function (item) {
    if (this.isModeSaving(item)) {
        return;
    }
    if (!item.value) {
        return mlayer.msg('频次不能为空');
    }
    if (isNaN(item.value)) {
        return mlayer.msg('频次请输入数字');
    }
    if (item.value <= 0) {
        return mlayer.msg('频次必须大于0');
    }
    item.mode = 'saving';
    const p = {
        channelId: item.channelId,
        channelTitle: item.name,
        freqNum: item.value
    };
    const url = Config.basePath + '/touchConfig/saveChannelFreqConfig.action';
    Request.post(url, p).then((data) => {
        mlayer.msg('修改成功');
        item.mode = 'default';
    }).catch(() => {
        mlayer.msg('修改失败');
        item.mode = 'modify';
    });
};
methods.isModifyBtnVisible = function (item) {
    return this.isModeDefault(item);
};
methods.isModeDefault = function (item) {
    return (item.mode === 'default')
};
methods.isModeModify = function (item) {
    return (item.mode === 'modify')
};
methods.isModeSaving = function (item) {
    return (item.mode === 'saving')
};
methods.restore = function (arr) {
    const map = {};
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        map[item.channelId] = item.freqNum;
    }
    for (let i = 0; i < this.touchList.length; i++) {
        const touch = this.touchList[i];
        if (map[touch.channelId]) {
            touch.value = map[touch.channelId];
        }
    }
};
const computed = {};
const created = function () {};
const mounted = function () {
    this.loading = true;
    Request.fetch2('/touchConfig/getChannelFreqConfig').then((data) => {
        this.loading = false;
        this.restore(data);
    }).catch(() => {
        this.loading = false;
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        loading: false,
        touchList: [
            {channelId: '38', name: '和生活', value: undefined, mode: 'default'},
            {channelId: '40', name: '随身厅-营销助手', value: undefined, mode: 'default'},
            {channelId: '46', name: '实时在线-IVR', value: undefined, mode: 'default'},
            {channelId: '47', name: '实时在线-弹窗', value: undefined, mode: 'default'},
            {channelId: '48', name: '实时在线-官微', value: undefined, mode: 'default'}
        ]
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.page-channel-freq-setting {
    padding: 1px 20px;
}
input[type=text] {
    height: 32px;
    padding: 4px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
}
</style>

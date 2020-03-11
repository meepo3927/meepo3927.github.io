<template>
<c-layer close="true" @close="close">
    <div class="center-layer-inner-1">
        <h3 v-text="myTitle"></h3>
        <div class="date-row" v-text="dateStr"></div>
        <div class="mt20" :class="[isModeInput ? 'm-row-mid-auto' : 'm-row-auto']">
            <div class="col-1">
                <label for="">标题：</label>
            </div>
            
            <div v-if="isModeInput">
                <input type="text" class="form-control" placeholder="请填写日程标题" 
                    v-model="form.title" />
            </div>
            <div class="row-text" v-text="form.title" v-else>
            </div>
        </div>

        <div class="m-row-auto mt20">
            <label class="col-1" for="">内容：</label>
            <div v-if="isModeInput">
                <textarea class="form-control" placeholder="请填写日程内容" 
                    v-model="form.content" ></textarea>
            </div>
            <div class="row-text" v-text="form.content" v-else>
            </div>
        </div>

        <div class="btn-box" v-if="isModeInput">
            <button class="btn btn-primary" @click="save">
                保存
                <div class="loading-1 v-inline" v-show="loadingSave"></div>
            </button>
        </div>
        <div class="btn-box mt30" v-else>
            <button class="btn btn-primary" @click="modify">编辑</button>
            <button class="btn btn-danger ml40" @click="del">
                删除
                <div class="loading-1 v-inline" v-show="loadingDelete"></div>
            </button>
        </div>
    </div>
</c-layer>
</template>

<script>
const CalendarUtil = require('util/calendar.js');

let methods = {};
methods.close = function () {
    this.$emit('close')
};
methods.addData = function () {
    if (!this.cell) {
        return;
    }
    let copy = JSON.parse(JSON.stringify(this.cell));
    let form = JSON.parse(JSON.stringify(this.form));
    if (copy.data) {
        copy.data.push(form);
    } else {
        copy.data = [form];
    }
    this.$emit('update', copy);
};
methods.updateData = function () {
    let index = this.getItemIndex();
    let copy = JSON.parse(JSON.stringify(this.cell));
    let form = JSON.parse(JSON.stringify(this.form));
    if (index >= 0) {
        copy.data.splice(index, 1, form);
        this.$emit('update', copy);
    }
};
methods.removeData = function () {
    let cell = this.cell;
    if (!cell || !cell.data) {
        return;
    }
    let copy = JSON.parse(JSON.stringify(cell));
    let index = this.getItemIndex();
    if (index >= 0) {
        copy.data.splice(index, 1);
        this.$emit('update', copy);
    }
};
methods.getItemIndex = function (item) {
    item = item || this.data;
    if (this.cell && this.cell.data) {
        return this.cell.data.indexOf(item);
    }
    return -1;
};
methods.getSaveParam = function () {
    if (this.isModeCreate) {
        var o = {
            title: this.form.title,
            content: this.form.content,
            date: CalendarUtil.buildStr(this.cell)
        };
        return {json: JSON.stringify(o)};
    } else {
        o = {
            title: this.form.title,
            content: this.form.content
        };
        return {
            id: this.data.id,
            json: JSON.stringify(o)
        };
    }
};
methods.save = function () {
    if (this.check() !== true) {
        return;
    }
    if (this.loadingSave) {
        return;
    }
    this.loadingSave = true;
    let url = this.isModeCreate ? '/iop/calendar/save.action' : '/iop/calendar/updateCalendar.action';
    let param = this.getSaveParam();
    this.vRequest.post(url, param).then((result) => {
        this.loadingSave = false;
        if (this.isModeCreate) {
            this.addData(result);
        } else {
            this.updateData(result);
        }
        mlayer.msg('保存成功');
        this.close();
    }).catch((e) => {
        this.loadingSave = false;
        mlayer.msg('保存失败');
    });
};
methods.modify = function () {
    this.$emit('change-mode', 'modify');
};
methods.del = function () {
    if (!confirm('确定删除该日程吗？')) {
        return;
    }
    this.loadingDelete = true;
    let p = {
        id: this.data.id
    };
    this.vRequest.fetch2('/calendar/deleteCalendar', p).then(() => {
        this.loadingDelete = false;
        this.removeData();
        this.close();
        mlayer.msg('删除成功');
    }).catch(() => {
        this.loadingDelete = false;
        mlayer.msg('删除失败');
    });
};
methods.clean = function () {
    for (let i in this.form) {
        this.form[i] = '';
    }
};
methods.check = function () {
    if (!this.form.title) {
        return mlayer.msg('请填写日程标题');
    }
    if (!this.form.content) {
        return mlayer.msg('请填写日程内容');
    }
    return true;
};
methods.restore = function (obj) {
    for (let i in this.form) {
        if (obj[i] && obj[i] !== undefined) {
            this.form[i] = obj[i];
        }
    }
};
let computed = {};
computed.myTitle = function () {
    return this.isModeInput ? '请输入日程' : '日程详情'
};
computed.dateStr = function () {
    if (this.cell) {
        return CalendarUtil.buildStrCN(this.cell);
    }
};
computed.isModeInput = function () {
    return (this.mode === 'create' || this.mode === 'modify');
};
computed.isModeCreate = function () {
    return (this.mode === 'create');
};
computed.isModeModify = function () {
    return (this.mode === 'modify')
};
computed.isModeBrowse = function () {
    return (this.mode === 'browse');
};
let watch = {};
watch.data = function (v) {
    if (v) {
        this.restore(v);
    }
};
const created = function () {};
const mounted = function () {
    if (this.data) {
        this.restore(this.data);
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        loadingSave: false,
        loadingDelete: false,
        form: {
            title: '',
            content: ''
        }
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['cell', 'data', 'mode'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {
        'c-layer': require('comp/common/cover-layer.vue')
    }
};
</script>

<style scoped lang="less">
@label-width:  60px;
.center-layer-inner-1 {
    max-height: 80vh;
    overflow-x: hidden;
    overflow-y: auto;
}
h3 {
    margin-top: 0;
}
.date-row {
    font-size: 16px;
    font-weight: bold;
    margin-top: 15px;
    color: #666;
}
.col-1 {
    width: @label-width;
}
.btn-box {
    padding: 10px 0 0 @label-width;
}
.row-text {
    max-width: 340px;
    word-wrap: break-word;
    word-break: break-all;
}
textarea {
    width: 300px;
    height: 120px;
}
</style>

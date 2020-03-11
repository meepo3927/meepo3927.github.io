<template>
<div class="page-notice-publish">
    <h2>发布公告</h2>

    <div class="m-row-mid-auto mt30">
        <div class="col-label">
            <label class="with-red-star">公告标题：</label>
        </div>
        <div>
            <input type="text" class="form-control input-title"
                placeholder="请输入公告标题，建议50字以内" 
                v-model.trim="form.title" />
        </div>
    </div>

    <div class="m-row-auto mt20">
        <div class="col-label">
            <label class="with-red-star">公告内容：</label>
        </div>
        <div>
            <textarea class="form-control input-content"
                placeholder="建议300字以内"
                v-model.trim="form.content"></textarea>
        </div>
    </div>

    <div class="m-row-mid-auto mt20">
        <div class="col-label">
            <label class="with-red-star">生效时间：</label>
        </div>
        <div>
            <laydate class="form-control input-date"
                v-model="form.beginDate" />
        </div>
        <div class="pl10 pr10">至</div>
        <div>
            <laydate class="form-control input-date" 
                v-model="form.endDate" />
        </div>
    </div>

    <div class="btn-box mt25">
        <button class="btn btn-primary" type="button"
            @click="submit"
            :disabled="submiting">+发布</button>
    </div>
</div>
</template>

<script>
import Calendar from 'util/calendar.js';
import mlayer from 'mlayer';
const methods = {};
methods.check = function () {
    if (!this.form.title) {
        return mlayer.msg('请输入公告标题');
    }
    if (!this.form.content) {
        return mlayer.msg('请输入公告内容');
    }
    if (!this.form.beginDate) {
        return mlayer.msg('请选择生效日期');
    }
    if (!this.form.endDate) {
        return mlayer.msg('请选择失效日期');
    }
    return true;
};
methods.submit = function () {
    if (this.check() !== true) {
        return;
    }
    const p = {
        noticeTitle: this.form.title,
        noticeContent: this.form.content,
        beginDate: this.form.beginDate.replace(/-/g, ''),
        endDate: this.form.endDate.replace(/-/g, '')
    };
    this.submiting = true;
    const url = Config.basePath + '/notice/publish.action';
    const headers = {
        'Content-Type': 'application/json'
    };
    Request.post(url, JSON.stringify(p), headers).then((data) => {
        this.submiting = false;
        this.clean();
        mlayer.msg('发布成功');
    }).catch(() => {
        this.submiting = false;
        mlayer.msg('发布失败');
    });
};
methods.clean = function () {
    this.form.title = '';
    this.form.content = '';
};
const computed = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    const beginDate = Calendar.getOffsetStr(new Date, 1);
    const endDate = Calendar.getOffsetStr(new Date, 1, 'month');
    let o = {
        submiting: false,
        form: {
            title: '',
            content: '',
            beginDate,
            endDate
        }
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
@col-label-width:    90px;
@input-title-width:  540px;
.page-notice-publish {
    background-color: #fff;
    padding: 1px 22px 20px;
    height: 100vh;
}
.col-label {
    width: @col-label-width;
    padding-left: 6px;
}
.input-title {
    width: @input-title-width;
}
.input-content {
    width: @input-title-width;
    height: 120px;
}
.input-date {
    width: 120px;
}
.btn-box {
    padding-left: @col-label-width;
}
</style>

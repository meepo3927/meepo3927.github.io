<template>
<span class="v-file-upload">
    <!-- 文件名 -->
    <label class="v-file-name" :for="elemId" >
        <div v-text="fileName" :title="fileName"></div>
    </label>
    <!-- 选择文件 -->
    <label class="choose-btn" title="选择文件" :for="elemId" 
        v-show="chooseBtnVisible"
        v-text="labelText"></label>
    <!-- 上传按钮 -->
    <label class="send-btn" v-show="sendBtnVisible" :class="{disabled: loading}"
        @click="onSendClick">{{loading ? '上传中..' : '上传'}}</label>
    <!-- 错误信息 -->
    <span class="error-msg" v-show="errmsgVisible" 
        v-text="errmsg"></span>
    <!-- 查看文件 -->
    <a :href="value" class="open-file" target="_blank" @click.stop
        v-show="openFileVisible">查看文件</a>
    <!-- 实际表单 -->
    <form :action="formAction" :method="formMethod" style="display: none;" ref="form">
        <slot></slot>
    </form>
</span>
</template>

<script>
import FormAsync from 'util/form_async.js';
let uuid = 1;
const TYPE_EXT_MAP = {
    image: 'jpg,png,jpeg,gif',
    excel: 'xlsx,xls'
};
const TYPE_TEXT_MAP = {
    image: '图片',
    excel: 'Excel'
};
const TYPE_HTML5_NAME = {
    image: 'image',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};
const isFilePreviewSupported = (typeof window.FileReader !== 'undefined');
// 类型错误信息
const getTypeErrMsg = (type) => {
    type = type ? type.toLowerCase() : '';
    let text = TYPE_TEXT_MAP[type] || type;
    return '请选择[' + text + ']类型的文件';
};
// HTML5类型判断
const HTML5ValiType = (allowType, type) => {
    const HTML5_TYPE = TYPE_HTML5_NAME[allowType];
    // LOG('HTML5ValiType:' + allowType + ':' + type);
    if (type === HTML5_TYPE) {
        return true;
    }
    // ---> image/png, image/jpeg
    if (type.split('/')[0] === HTML5_TYPE) {
        return true;
    }
    return getTypeErrMsg(allowType);
};
// 校验扩展名
const valiFileExtension = (allowType, fileName) => {
    // 没有扩展名
    if (fileName.indexOf('.') === -1) {
        return getTypeErrMsg(allowType);
    }
    // 没有扩展名
    const ext = fileName.split('.').pop();
    if (!ext) {
        return getTypeErrMsg(allowType);
    }
    const allowExtentions = (TYPE_EXT_MAP[allowType] || '').toLowerCase().split(',');
    if (allowExtentions.indexOf(ext) >= 0) {
        return true;
    }
    return getTypeErrMsg(allowType);
};

let methods = {};
methods.removeFileInput = function () {
    this.$form.children('.v-file').remove();
};
methods.makeFileInput = function () {
    let $file = $('<input type="file" class="v-file" />');
    $file.css('display', 'none');
    $file.attr('id', this.elemId);
    $file.attr('name', this.myInputName);
    $file.on('change', (e) => {this.onChange(e);});
    this.$form.append($file);
};
methods.getFileInputElem = function () {
    return this.$form.children('.v-file')[0];
};
methods.reset = function () {
    this.filePath = '';
    this.cleanErrMsg();
    this.removeFileInput();
    this.makeFileInput();
};
// 检查文件类型
methods.checkFileType = function (el) {
    el = el || this.getFileInputElem();
    if (!this.filetype) {  // 没有type限制
        return true;
    }
    if (el && el.files) {
        if (el.files.length === 0) {
            // 没有选中文件
            return true;
        }
        return HTML5ValiType(this.filetype, el.files[0].type);
    }
    // 校验扩展名
    return valiFileExtension(this.filetype, this.fileName);
};
methods.onChange = function (e) {
    var elem = e.target || e.currentTarget;
    this.filePath = elem.value;
    // 没有选择文件
    if (!this.filePath) {
        return false;
    }
    // 类型不对
    let result = this.checkFileType(elem);
    if (result !== true) {
        return this.setErrMsg(result);
    }
    this.cleanErrMsg();
    // 预览
    this.preview(elem.files);
};
methods.setErrMsg = function (msg) {
    this.errmsg = msg;
    return false;
};
methods.cleanErrMsg = function () {
    this.errmsg = '';
};
methods.preview = function (files) {
    if (!isFilePreviewSupported || !files || !files[0]) {
        return false;
    }
    var reader = new window.FileReader();
    reader.onload = () => {
        this.$emit('preview', reader.result);
    }
    reader.readAsDataURL(files[0]);
};
// 点击-上传
methods.onSendClick = function () {
    if (this.loading) {
        return;
    }
    this.cleanErrMsg();
    // 文件为空
    if (!this.filePath) {
        return this.setErrMsg('请选择文件');
    }
    // 类型不对
    const result = this.checkFileType();
    if (result !== true) {
        return this.setErrMsg(result);
    }
    this.sendForm();
};
// 发送数据
methods.sendForm = function () {
    this.loading = true;
    FormAsync(this.$refs.form).send().then((result) => {
        this.loading = false;
        if (result.success) {
            this.$emit('input', result.data);
        }
        this.$emit('complete', result);
    }).catch(() => {
        this.loading = false;
        this.setErrMsg('上传失败');
    });
};
var computed = {};
computed.elemId = function () {
    return 'v_file_upload_' + this.id;
};
computed.labelText = function () {
    return this.label || '选择文件';
};
computed.myInputName = function () {
    return this.inputname || 'file';
};
computed.fileName = function () {
    if (!this.filePath) {
        return '';
    }
    const list = this.filePath.split('\\').pop();
    return list.split('/').pop();
};
computed.formAction = function () {
    return this.action;
};
computed.errmsgVisible = function () {
    if (this.errmsg) {
        return true;
    }
    return false;;
};
computed.openFileVisible = function () {
    if (this.errmsgVisible) {
        return false;
    }
    if (!this.value) {
        return false;
    }
    return true;
};
computed.chooseBtnVisible = function () {
    return !this.sendBtnVisible;
};
computed.sendBtnVisible = function () {
    return this.filePath ? true : false;
};
computed.formMethod = function () {
    // if (Config.mock) {
    //     return 'GET';
    // }
    return 'POST';
};
const mounted = function () {
    this.$form = $(this.$refs.form);
    this.makeFileInput();
};
const beforeDestroy = function () {};
export default {
    data: function () {
        return {
            id: (uuid++),
            filePath: '',
            errmsg: '',
            loading: false
        };
    },
    methods,
    computed,
    props: {
        label: String,
        inputname: String,
        filetype: String,
        action: String,
        value: [String, Object]
    },
    mounted,
    beforeDestroy
};
</script>

<style scoped lang="less">
@height:                32px;
@line-height:           @height - 2px;
@border-radius:         3px;
@border-color:          #eee;
@background-color:      #eee;
@send-btn-back-color:   #5faee3;
.v-file-upload {
    display: table;
    table-layout: fixed;
    & > label {
        display: table-cell;
        vertical-align: middle;
        height: @height;
        line-height: @line-height;
    }
    & > span {
        vertical-align: middle;
    }
}
.v-file-name {
    min-width: 230px;
    padding-right: 10px;
    margin-right: 10px;
    & > div {
        height: @height;
        padding-left: 8px;
        padding-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: @background-color;
        color: #333;
        cursor: pointer;
        white-space: nowrap;
        border-radius: @border-radius;
    }
}
.choose-btn, .send-btn {
    border: 1px solid @border-color;
    border-radius: @border-radius;
    background-color: @background-color;
    color: #fff;
    cursor: pointer;
    white-space: nowrap;
    width: 90px;
    text-align: center;
    height: @height;
    line-height: @line-height;
    font-size: 14px;
}
.choose-btn {
    background-color: #aaa;
}
.send-btn {
    background-color: @send-btn-back-color;
    border-color: #49a3df;
    &.disabled {
        cursor: default;
        background-color: lighten(@send-btn-back-color, 15%);
    }
}
.error-msg {
    margin-left: 12px;
    color: #ee0000;
    line-height: @line-height;
}
.open-file {
    margin-left: 12px;
    line-height: @height;
}
</style>
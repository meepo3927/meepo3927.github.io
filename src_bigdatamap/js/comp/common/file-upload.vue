<template>
<span class="v-file-upload">
    <!-- for click -->
    <label class="v-file-name" :for="elemId" >
        <div v-text="file" :title="file"></div>
    </label>
    <!-- for click -->
    <label class="v-file-label ml10" title="选择要上传的文件"
        :for="elemId" 
        v-show="selectBtnVisible"
        v-text="myText"></label>
    <!-- send by hand -->
    <button class="send-btn" v-show="sendBtnVisible"
        @click="checkAndSend">上传</button>
    <!-- Error Msg -->
    <span class="error-msg ml10" v-show="errmsgVisible" 
        v-text="errmsg"></span>
    <!-- Current File -->
    <a :href="value" class="open-file" target="_blank" v-show="openFileVisible"
        click-jump >查看文件</a>
    <form :action="formAction" style="display: none;" ref="form">
        <slot></slot>
    </form>
</span>
</template>

<script>
let formAsync = require('util/form_async');
let config = require('global/config');
let uuid = 1;
let typeExtMap = {
    image: 'jpg,png,jpeg,gif',
    excel: 'xlsx'
};
let typeTextMap = {
    image: '图片',
    excel: 'Excel'
};
const isFilePreviewSupported = (typeof window.FileReader !== 'undefined');
const getTypeText = (type) => {
    type = type ? type.toLowerCase() : '';
    return typeTextMap[type] || type;
};
const getErrmsg = (type) => {
    return '请选择[' + getTypeText(type) + ']类型的文件';
};
const valiFileObjectType = (allowType, type) => {
    if (!type) {
        return {ok: false, errmsg: getErrmsg(allowType)};
    }
    var arr = type ? type.split('/') : [];
    if (arr.length === 0) {
        return {
            ok: false,
            errmsg: getErrmsg(allowType)
        };
    }

    if (arr[0] === allowType) {
        return {ok: true};
    }
    return {
        ok: false,
        errmsg: getErrmsg(allowType)
    };
};
const valiFileExtension = (allowType, fileName) => {
    var ok = {ok: true};
    var err = {ok: false, errmsg: getErrmsg(allowType)};
    if (fileName.indexOf('.') === -1) {
        return err;
    }
    var ext = fileName.split('.').pop();
    if (!ext) {
        return err;
    }
    var allowExtentions = (typeExtMap[allowType] || '').toLowerCase().split(',');
    if (allowExtentions.indexOf(ext) >= 0) {
        return ok;
    }
    return err;
};
const valiType = (el, filetype, fileName) => {
    let r = {ok: true};
    if (!filetype) {  // 没有type限制
        return r;
    }
    if (el.files && el.files.length === 0) { // 没有选中文件
        return r;
    }
    var fileInstance = el.files && el.files[0];
    if (fileInstance) {
        // return valiFileObjectType(filetype, fileInstance.type);
    }
    // 校验扩展名
    return valiFileExtension(filetype, fileName);
};

var methods = {};
methods.removeFileInput = function () {
    let $file = $(this.$refs.form).children('.v-file');
    if ($file.length) {
        $file.remove();
    }
};
methods.makeFileInput = function () {
    let $file = $('<input type="file" class="v-file" />');
    $file.css('display', 'none');
    $file.attr('id', this.elemId);
    $file.attr('name', this.myElemName);
    $file.on('change', (e) => {
        this.change(e);
    });
    $(this.$refs.form).append($file);
};
methods.getFileInputElem = function () {
    return $(this.$refs.form).children('.v-file')[0];
};
methods.reset = function () {
    this.fileValue = '';
    this.filePath = '';
    this.errmsg = '';
    this.removeFileInput();
    this.makeFileInput();
};
methods.checkType = function (el) {
    el = el || this.getFileInputElem();
    if (!el) {
        return true;
    }
    var r = valiType(el, this.filetype, this.file);
    if (r.ok) {
        return true;
    } else {
        return r.errmsg;
    }
};
methods.change = function (e) {
    var elem = e.target || e.currentTarget;
    var value = elem.value;
    this.filePath = value;

    let result = this.checkType(elem);
    if (result !== true) {
        this.fileValue = '';
        this.errmsg = result;
        return false;
    }

    // this.preview(elem.files);

    // 没有选择文件
    if (!value) {
        return false;
    }

    this.fileValue = value;
    if (this.checkNull()) {
        this.errmsg = '';
        if (this.sendOnSelect) {
            // Send request to server
            this.send();
        }
    } else {
    }
};
methods.preview = function (files) {
    if (!files) {
        return false;
    }
    var file = files[0];
    if (!file) {
        return false;
    }
    if (!isFilePreviewSupported) {
        return false;
    }
    var reader = new window.FileReader();
    reader.onload = () => {
        this.$emit('preview', reader.result);
    }
    reader.readAsDataURL(file);
};
methods.checkNull = function () {
    if (!this.fileValue) {
        return '请上传文件';
    }
    return true;
};
methods.check = function () {
    if (this.silent) {
        return true;
    }
    // 类型不对
    let r = this.checkType();
    if (r !== true) {
        this.errmsg = r;
        return false;
    }
    // 没有上传文件
    r = this.checkNull();
    if (r !== true) {
        this.errmsg = r;
        return false;
    }
    this.errmsg = '';
    return true;
};
methods.checkAndSend = function () {
    if (this.loading) {
        return false;
    }
    // 文件为空
    if (!this.filePath) {
        this.errmsg = '请选择文件';
        return false;
    }
    // 类型不对
    let r = this.checkType();
    if (r !== true) {
        this.errmsg = r;
        return false;
    }
    return this.send();

};
methods.send = function () {
    this.loading = true;
    var fa = formAsync(this.$refs.form, {
        success: (json) => {
            this.loading = false;
            this.$emit('success', json);
            if (json.success) {
                this.$emit('input', json.data);
            }
        },
        error: () => {
            this.loading = false;
            this.fileValue = '';
            this.errmsg = '上传失败';
            // LOG('upload error');
        }
    });
    fa.send();
};
var computed = {};
computed.elemId = function () {
    return 'v_file_upload_' + this.id;
};
computed.myText = function () {
    if (this.loading) {
        return '上传中..';
    }
    return this.labelText || '选择文件';
};
computed.myElemName = function () {
    return this.elemName || 'file';
};
computed.file = function () {
    if (!this.filePath) {
        return '';
    }
    var list = this.filePath.split('\\').pop();

    return list.split('/').pop();
};
computed.formAction = function () {
    return this.action || config.uploadUrl;
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
computed.selectBtnVisible = function () {
    return !this.sendBtnVisible;
};
computed.sendBtnVisible = function () {
    if (this.loading) {
        return false;
    }
    if (this.filePath) {
        return true;
    }
    return false;
};
const mounted = function () {
    this.makeFileInput();
};
const beforeDestroy = function () {};
module.exports = {
    data: function () {
        const id = (uuid++);
        return {
            id,
            fileValue: '',
            filePath: '',
            errmsg: '',
            loading: false
        };
    },
    methods,
    computed,
    props: [
        'labelText', 'elemName', 'filetype',
        'silent', 'action', 'sendOnSelect',
        'value'],
    mounted,
    beforeDestroy
};
</script>

<style scoped lang="less">
@height:                32px;
@border-radius:         3px;
@border-color:          #eee;
@color:                 #333;
@background-color:      #eee;
.v-file-upload {
    display: table;
    table-layout: fixed;
    
    & > label {
        display: table-cell;
        vertical-align: middle;
        height: @height;
        line-height: @height;
    }
    & > em {
        display: table-cell;
        width: 8px;
    }
    .error-msg {
        color: #ee0000;
        line-height: @height;
    }
}
.v-file-name {
    min-width: 200px;
    padding-right: 10px;
    & > div {
        height: @height;
        padding-left: 8px;
        padding-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        
        display: block;
    }
}
.v-file-name > div,
.v-file-label,
.send-btn {
    border: 1px solid @border-color;
    background-color: @background-color;
    color: @color;
    
    cursor: pointer;
    white-space: nowrap;
    border-radius: @border-radius;
}
.v-file-label,
.send-btn {
    border: 1px solid @border-color;
    width: 90px;
    text-align: center;
    background-color: #aaa;
    color: #fff;
}
.send-btn {
    height: @height;
    background-color: #5faee3;
    border-color: #49a3df;
}

.open-file {
    margin-left: 12px;
    line-height: @height;
}
</style>
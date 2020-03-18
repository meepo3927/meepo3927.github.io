<template>
<div class="mui-msg" >
    <div class="mui-msg-content" :class="contentClass">
        <div class="mui-msgbox-header">
            <span v-text="title"></span>
        </div>
        <div class="mui-msgbox-content" :class="[iconTypeClass]">
            <i class="fa" :class="[iconClass]" v-if="iconClass"></i>
            <p v-text="text"></p>
            <input type="text" class="form-control" v-if="inputVisible"
                ref="input" @keyup.enter="onEnterUp"
                v-model="inputValue" />
        </div>
        <div class="mui-msgbox-btnbox">
            <button class="btn btn-primary" type="button" 
                @click="ok" ref="okBtn">确定</button>
            <button class="btn btn-cancel" type="button" @click="cancel"
                v-if="cancelBtnVisible">取消</button>
        </div>
    </div>
</div>
</template>

<script>
const STATUS_OK = 1;
const STATUS_CANCEL = 2;
const iconMap = {
    success: 'fa-check-circle',
    warning: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    error: 'fa-times-circle'
};
let methods = {};
methods.onEnterUp = function (e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    this.ok();
};
methods.onKeyUp = function (e) {
    let code = e.keyCode;
    if (code === 27) { // esc关闭消息
        this.close();
    } else if (code === 13 ) {
        this.ok();
    }
};
methods.emitCallback = function (status) {
    let func = this.callback;
    if (!func) {
        return;
    }
    let t = this.type;
    if (t === 'alert') {
        return func();
    } else if (t === 'confirm') {
        return func(status === STATUS_OK ? true : false);
    } else if (t === 'prompt') {
        return func(status === STATUS_OK ? this.inputValue : false);
    }
};
methods.ok = function () {
    this.emitCallback(STATUS_OK);
    this.close();
};
methods.cancel = function () {
    this.emitCallback(STATUS_CANCEL);
    this.close();
};
methods.close = function () {
    this.$el.parentNode.removeChild(this.$el);
    this.$destroy(true);
};
methods.autoFocus = function () {
    if (this.type === 'prompt') {
        this.$refs.input.focus();
    } else {
        this.$refs.okBtn.focus();
        this.$refs.okBtn.blur();
    }
};
let computed = {};
computed.contentClass = function () {
    let arr = [
        'type-' + this.type
    ];
    return arr;
};
computed.cancelBtnVisible = function () {
    if (this.type === 'alert') {
        return false;
    }
    return true;
};
computed.iconTypeClass = function () {
    if (this.icon) {
        return 'icon-' + this.icon;
    }
};
computed.iconClass = function () {
    return iconMap[this.icon] || '';
};
computed.inputVisible = function () {
    if (this.type === 'prompt') {
        return true;
    }
    return false;
};
let watch = {};
const created = function () {};
const mounted = function () {
    document.addEventListener('keyup', this.onKeyUp);
    setTimeout(this.autoFocus, 50);
};
const beforeDestroy = function () {

    document.removeEventListener('keyup', this.onKeyUp);
};
const dataFunc = function () {
    let o = {
        title: '',
        text: '',
        icon: '',
        type: 'alert',
        callback: null,
        inputValue: ''
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/with_cover.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";

.mui-msg {}
.mui-msg-content {
    border: 1px solid #ebeef5;
    background-color: #fff;
    padding-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0px 0px 10px #666;

    text-align: left;

    &.type-alert {
        max-width: 60%;
    }
}
.mui-msgbox-header,
.mui-msgbox-content,
.mui-msgbox-btnbox {
    padding-left: 15px;
    padding-right: 15px;
}
.mui-msgbox-header {
    position: relative;
    font-size: 18px;
    padding-top: 12px;
    padding-bottom: 10px;
    span {
        line-height: 1;
    }
}
.mui-msgbox-content {
    word-wrap: break-word;
    word-break: break-all;
    min-width: 400px;
    font-size: 14px;
    position: relative;
    padding-top: 5px;
    padding-bottom: 5px;
    &.icon-success > i.fa {
        color:  @success-text-color;
    }
    &.icon-warning > i.fa {
        color:  @warning-text-color;
    }
    &.icon-error > i.fa {
        color:  @error-text-color;
    }
    & > i.fa {
        font-size: 24px;
        position: absolute;
        left: 16px;
        top: 50%;
        margin-top: -12px;
    }
    & > i.fa + p {
        margin-left: 32px;
    }
    & > p {
        line-height: 24px;
        margin-top: 0;
        margin-bottom: 0;
    }
    & > input[type=text] {
        margin-top: 15px;
        margin-bottom: 10px;
    }
}
.mui-msgbox-btnbox {
    text-align: right;
    padding-top: 5px;
    & > button {
        margin-left: 10px;
    }
}
</style>

<template>
<div class="mui-msg-fixed" >
    <div class="mui-msg-content" :class="contentClass">
        <i class="fa" :class="[iconClass]" v-if="iconVisible"></i>
        <p v-text="text"></p>
    </div>
</div>
</template>

<script>

let methods = {};
methods.close = function () {
    this.$el.parentNode.removeChild(this.$el);
    this.$destroy(true);
};
let computed = {};
computed.contentClass = function () {
    return [
        'type-' + this.type
    ];
};
computed.iconVisible = function () {
    return this.iconClass ? true : false;
};
computed.iconClass = function () {
    return this.muiAlertIconMap[this.type] || '';
};
let watch = {};
const created = function () {};
const mounted = function () {
    if (this.duration) {
        setTimeout(this.close, this.duration);
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        text: '',
        duration: 2500,
        type: 'msg'
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/mui.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">

@import "./ref";


.mui-msg-content {
    font-size: 16px;
    min-width: 120px;
    display: block;
    &.type-success,
    &.type-warning,
    &.type-info,
    &.type-error {
        border-width: 1px;
        border-style: solid;
        padding: 15px 15px 15px 40px;
        p {
            padding-left: 8px;
        }
    }
    & > i.fa {
        position: absolute;
        left: 20px;
        top: 50%;
        margin-top: -9px;
        line-height: 1;
        font-size: 18px;
    }
    & > p {
        line-height: 1.4;
        margin-top: 0;
        margin-bottom: 0;
        max-width: 75vw;
        word-wrap: break-word;
    }
}
.mui-msg-content.type-msg {
    padding: 12px;
    border-radius: 3px;
    padding: 12px 25px;
    text-align: center;
    color: #fff;
    background-color: #000;
    filter: alpha(opacity=80);
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 15px #666;
}
.mui-msg-content.type-success {
    background-color: @success-back-color;
    border-color:     @success-border-color;
    & > p,
    & > i {
        color: @success-text-color;
    }
}
.mui-msg-content.type-warning {
    background-color: @warning-back-color;
    border-color:     @warning-border-color;
    & > p,
    & > i {
        color: @warning-text-color;
    }
}
.mui-msg-content.type-info {
    background-color: @info-back-color;
    border-color:     @info-border-color;
    & > p,
    & > i {
        color: @info-text-color;
    }
}
.mui-msg-content.type-error {
    background-color: @error-back-color;
    border-color:     @error-border-color;
    & > p,
    & > i {
        color: @error-text-color;
    }
}
</style>

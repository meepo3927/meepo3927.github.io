<template>
<ul class="clearfix">
    <li v-for="v in list">
        <i class="iconfont" :class="v.icon"></i>
        <a href="javascript:;" @click="onClick">
            <div class="text-section">
                <h4 v-text="v.text"></h4>
                <p v-text="v.subtext"></p>
            </div>
        </a>
    </li>
</ul>
</template>

<script>
const methods = {};
methods.onClick = function () {
    mlayer.msg('跳转子页面');
};
const computed = {};
const created = function () {};
const mounted = function () {
    Request.fetch2('/firstPageNew/firstLineData').then((result) => {
        if (result.svcNum !== undefined) {
            this.list[0].subtext = '目前全区共' + result.svcNum + '个生效活动';
        }
        
        if (result.labelNum !== undefined) {
            this.list[1].subtext = '目前有' + result.labelNum + '个标签';
        }
        const arr = [];
        if (result.evtTypeNum !== undefined) {
            arr.push('目前有' + result.evtTypeNum + '类事件');
        }
        if (result.evtRuleNum !== undefined) {
            arr.push('全区共创建' + result.evtRuleNum + '个事件规则');
        }
        if (arr.length) {
            this.list[2].subtext = arr.join('，');
        }
        this.list[3].subtext = '对已生效的营销活动进行30天追踪评估';
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: [
            {
                text: '发起营销', subtext: '', icon: 'iconyingxiao',
                url: ''
            },
            {
                text: '查询标签', subtext: '', icon: 'iconshengqian',
                url: ''
            },
            {
                text: '创建事件', subtext: '' ,icon: 'iconshijiantai',
                url: ''
            },
            {
                text: '活动评估', subtext: '', icon: 'iconpinggu',
                url: ''
            }
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
@back-color-1:  #B0CE71;
@back-color-2:  #159FC8;
@back-color-3:  #F29249;
@back-color-4:  #59C2DD;
@img-path:      "../../../images/home";
ul {
}
ul > li {
    width: 25%;
    overflow: hidden;
    float: left;
    position: relative;
}
li > i.iconfont {
    position: absolute;
    font-size: 74px;
    line-height: 1;
    color: #fff;
    opacity: .2;
    right: 15px;
    bottom: 2px;
    pointer-events: none;
}
// 调整位置
li:nth-child(3) > i.iconfont {
    right: 8px;
}
// 调整位置
li:nth-child(4) > i.iconfont {
    right: 2px;
}
li > a {
    display: block;
    color: #fff;
    border-radius: 6px;
    height: 90px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-position: right bottom;
    &:hover h4 {
        transition: transform .3s ease;
        transform: scale(1.25);
        transform-origin: 0 50%;
    }
    &:hover p {
        transition: transform .3s ease;
        transform: scale(0.75);
        transform-origin: 0 50%;
    }
    & > i.fa { // removed
        font-size: 54px;
        float: left;
        margin-top: 4px;
    }
    .text-section {
        padding: 15px 20px;
        h4 {
            margin-top: 0px;
            font-size: 28px;
            font-weight: bold;
        }
        p {
            white-space: nowrap;
            font-size: 15px;
        }
    }
}
li:nth-child(1) {padding-right: 7px;}
li:nth-child(2) {padding-left: 3px; padding-right: 5px;}
li:nth-child(3) {padding-left: 5px; padding-right: 3px;}
li:nth-child(4) {padding-left: 7px;}
li:nth-child(1) > a {
    background-color: @back-color-1;
}
li:nth-child(2) > a {
    background-color: @back-color-2;
}
li:nth-child(3) > a {
    background-color: @back-color-3;
}
li:nth-child(4) > a {
    background-color: @back-color-4;
}
</style>

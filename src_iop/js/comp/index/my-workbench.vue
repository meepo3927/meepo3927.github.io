<template>
<div >
    <ul>
        <li v-for="(v, i) in list" :class="[getItemClass(i + 1)]">
            <a :href="v.url" @click="onClick(v)">
                <span v-text="v.text"></span>
                <i class="fa fa-angle-right"></i>
            </a>
        </li>
    </ul>
</div>
</template>

<script>
const DEFAULT_TEXT = [
    '查看正在创建的营销活动',
    '查看正在执行的营销活动',
    '查看我的客群标签',
    '查看标签查询任务',
    '查看我的事件规则',
    '查看我的日历'
];
const methods = {};
methods.getItemClass = function (n) {
    return 'li-' + n;
};
methods.onClick = function (item) {
    if (!item.url) {
        return mlayer.msg('正在建设');
    }
};
const computed = {};
const created = function () {};
const mounted = function () {
    Request.fetch2('/firstPageNew/getMyIOPInfo').then((data) => {
        this.list[0].text = '当前有' + data.svcNumCreating +  '个营销活动正在创建';
        this.list[1].text = '当前有' + data.svcNumRunning + '个营销活动正在执行';
        this.list[2].text = '一共创建了' + data.labelNum + '个标签';
        this.list[3].text = DEFAULT_TEXT[3]; // 从DHX接口
        this.list[4].text = '一共创建了' + data.evtRuleNum + '个事件规则';
        this.list[5].text = '当前有' + data.alarmNum + '个日历提醒';

    }).catch(() => {
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].text = DEFAULT_TEXT[i];
        }
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: [
            {
                // 营销案列表
                text: ''
            },
            {
                // 营销案列表
                text: ''
            },
            {
                // 营销标签
                text: ''
            },
            {
                // 标签查询任务
                text: ''
            },
            {
                // 事件列表
                text: '', url: Vue.getEntryUrl('/eventlist')
            },
            {
                // 我的日历
                text: '', url: Vue.getEntryUrl('/calendar')
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
@back-color-1:  #ACD69A;
@back-color-2:  #FACE88;
@back-color-3:  #A1CECC;
@back-color-4:  #FAC1D9;
@back-color-5:  #FEDC5A;
@back-color-6:  #66E1E3;
@li-height:  50px;
ul {
    padding: 13px 12px 0 12px;
}
ul > li {
    border-radius: 2px;
    & + li {
        margin-top: 12px;
    }
}
ul > li > a {
    display: block;
    color: #fff;
    height: @li-height;
    line-height: @li-height;
    padding: 1px 10px 1px 30px;
    & > span {
        font-size: 16px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(~'100% - 24px');
    }
    & > i.fa-angle-right {
        font-size: 22px;
        float: right;
        margin-top: (@li-height - 24px) / 2;
        margin-right: 6px;
    }
}
.li-1 {background-color: @back-color-1;}
.li-2 {background-color: @back-color-2;}
.li-3 {background-color: @back-color-3;}
.li-4 {background-color: @back-color-4;}
.li-5 {background-color: @back-color-5;}
.li-6 {background-color: @back-color-6;}
</style>
